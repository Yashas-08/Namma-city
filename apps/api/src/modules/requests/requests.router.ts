import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '@namma-city/database';
import { requireAuth } from '../../middleware/auth';

const router = Router();

const createRequestSchema = z.object({
  categoryId: z.string(),
  categoryName: z.string(),
  title: z.string().min(2),
  description: z.string().min(5),
  address: z.string().min(3),
  latitude: z.number(),
  longitude: z.number(),
  landmark: z.string().optional(),
  photos: z.array(z.string()).default([]),
});

// Category to Department Code mapping
function getDepartmentCodeForCategory(category: string): string {
  const cat = category.toUpperCase();
  if (cat.includes('ROAD') || cat.includes('FOOTPATH')) return 'BBMP_ROADS';
  if (cat.includes('LIGHT') || cat.includes('ELECTRIC')) return 'BESCOM_POWER';
  if (cat.includes('WATER') || cat.includes('DRAINAGE')) return 'BWSSB_WATER';
  if (cat.includes('GARBAGE') || cat.includes('CLEAN')) return 'BBMP_SWM';
  return 'BBMP_ROADS';
}

// GET /requests (List citizen's requests)
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;

    const where: any = {
      citizenId: req.user!.id,
    };

    if (status && status !== 'all') {
      if (status === 'in-progress' || status === 'IN_PROGRESS') {
        where.status = { in: ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS'] };
      } else if (status === 'resolved' || status === 'RESOLVED') {
        where.status = 'RESOLVED';
      } else {
        where.status = status;
      }
    }

    const requests = await prisma.civicRequest.findMany({
      where,
      include: {
        attachments: true,
        department: true,
        assignedStaff: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = requests.map((r) => ({
      id: r.id,
      publicRequestId: r.publicRequestId,
      categoryId: r.categoryId,
      categoryName: r.categoryName,
      title: r.title,
      description: r.description,
      address: r.address,
      latitude: r.latitude,
      longitude: r.longitude,
      landmark: r.landmark,
      status: r.status,
      departmentName: r.department?.name,
      assignedStaffName: r.assignedStaff?.name,
      photoUrl: r.attachments[0]?.fileUrl || null,
      photosCount: r.attachments.length,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      resolvedAt: r.resolvedAt,
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
});

// GET /requests/:id (Details)
router.get('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const request = await prisma.civicRequest.findFirst({
      where: {
        OR: [{ id }, { publicRequestId: id }, { publicRequestId: `#${id}` }],
      },
      include: {
        citizen: { select: { id: true, name: true, phone: true } },
        department: true,
        assignedStaff: { select: { id: true, name: true, phone: true } },
        attachments: true,
        statusHistory: {
          include: { changedBy: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
        comments: {
          include: { author: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Civic request not found' },
      });
    }

    res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
});

// POST /requests (Submit complaint)
router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = createRequestSchema.parse(req.body);

    // Generate unique #REQ-XXXX with collision check
    let publicRequestId = '';
    for (let attempts = 0; attempts < 5; attempts++) {
      const candidate = `#REQ-${Math.floor(1000 + Math.random() * 9000)}`;
      const exists = await prisma.civicRequest.findUnique({ where: { publicRequestId: candidate } });
      if (!exists) {
        publicRequestId = candidate;
        break;
      }
    }
    if (!publicRequestId) {
      publicRequestId = `#REQ-${Date.now().toString().slice(-4)}`;
    }

    // Find appropriate department
    const deptCode = getDepartmentCodeForCategory(body.categoryId);
    const dept = await prisma.department.findUnique({ where: { code: deptCode } });

    // Transactionally create request, attachment, history, and notification
    const result = await prisma.$transaction(async (tx) => {
      const newRequest = await tx.civicRequest.create({
        data: {
          publicRequestId,
          citizenId: req.user!.id,
          departmentId: dept?.id || null,
          categoryId: body.categoryId,
          categoryName: body.categoryName,
          title: body.title,
          description: body.description,
          address: body.address,
          latitude: body.latitude,
          longitude: body.longitude,
          landmark: body.landmark || null,
          status: 'SUBMITTED',
        },
      });

      // Attach photos if provided
      if (body.photos && body.photos.length > 0) {
        for (let i = 0; i < body.photos.length; i++) {
          await tx.requestAttachment.create({
            data: {
              requestId: newRequest.id,
              storageKey: `uploads/${newRequest.id}/photo-${i + 1}.jpg`,
              fileUrl: body.photos[i],
              contentType: 'image/jpeg',
              size: 250000,
              uploadedBy: req.user!.id,
            },
          });
        }
      }

      // Initial status history
      await tx.requestStatusHistory.create({
        data: {
          requestId: newRequest.id,
          previousStatus: null,
          newStatus: 'SUBMITTED',
          changedById: req.user!.id,
          note: 'Citizen submitted grievance via Namma City mobile portal.',
        },
      });

      // Notification
      await tx.notification.create({
        data: {
          userId: req.user!.id,
          title: `Request ${publicRequestId} Submitted`,
          message: `Your grievance for ${body.categoryName} at ${body.address} has been received.`,
          type: 'REQUEST_UPDATE',
          relatedEntityId: newRequest.id,
        },
      });

      return newRequest;
    });

    res.status(201).json({
      success: true,
      data: {
        id: result.id,
        publicRequestId: result.publicRequestId,
        message: 'Civic request submitted successfully',
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /requests/:id/comments
const commentSchema = z.object({
  message: z.string().min(1),
});

router.post('/:id/comments', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { message } = commentSchema.parse(req.body);

    const request = await prisma.civicRequest.findFirst({
      where: { OR: [{ id }, { publicRequestId: id }] },
    });

    if (!request) {
      return res.status(404).json({ success: false, error: { message: 'Request not found' } });
    }

    const comment = await prisma.requestComment.create({
      data: {
        requestId: request.id,
        authorId: req.user!.id,
        message,
      },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    });

    // If comment is by staff, notify citizen
    if (req.user!.role !== 'CITIZEN') {
      await prisma.notification.create({
        data: {
          userId: request.citizenId,
          title: `New Update on ${request.publicRequestId}`,
          message: `${req.user!.name}: ${message}`,
          type: 'REQUEST_UPDATE',
          relatedEntityId: request.id,
        },
      });
    }

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
});

// POST /requests/:id/reopen (Citizen can reopen a resolved request)
const reopenRequestSchema = z.object({
  reason: z.string().min(5),
});

router.post('/:id/reopen', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { reason } = reopenRequestSchema.parse(req.body);

    const request = await prisma.civicRequest.findFirst({
      where: {
        OR: [{ id }, { publicRequestId: id }, { publicRequestId: `#${id}` }],
      },
    });

    if (!request) {
      return res.status(404).json({ success: false, error: { message: 'Request not found' } });
    }

    // Citizen can only reopen their own request
    if (req.user!.role === 'CITIZEN' && request.citizenId !== req.user!.id) {
      return res.status(403).json({ success: false, error: { message: 'Unauthorized' } });
    }

    if (request.status !== 'RESOLVED') {
      return res.status(400).json({
        success: false,
        error: { message: 'Only resolved grievances can be reopened.' },
      });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const reqUpdated = await tx.civicRequest.update({
        where: { id: request.id },
        data: {
          status: 'IN_PROGRESS',
          resolvedAt: null,
        },
      });

      await tx.requestStatusHistory.create({
        data: {
          requestId: request.id,
          previousStatus: 'RESOLVED',
          newStatus: 'IN_PROGRESS',
          changedById: req.user!.id,
          note: `Citizen reopened grievance: "${reason}"`,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: req.user!.id,
          action: 'CITIZEN_REOPENED_REQUEST',
          entityType: 'CIVIC_REQUEST',
          entityId: request.id,
          metadata: JSON.stringify({ reason }),
        },
      });

      // Notify assigned staff if one exists
      if (request.assignedStaffId) {
        await tx.notification.create({
          data: {
            userId: request.assignedStaffId,
            title: `Grievance Reopened: ${request.publicRequestId}`,
            message: `Citizen reported unresolved issue: "${reason}"`,
            type: 'REQUEST_UPDATE',
            relatedEntityId: request.id,
          },
        });
      }

      return reqUpdated;
    });

    res.json({ success: true, data: updated, message: 'Grievance reopened for field review' });
  } catch (error) {
    next(error);
  }
});

export default router;
