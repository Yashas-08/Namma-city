import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '@namma-city/database';
import { requireAuth, requireRole } from '../../middleware/auth';

const router = Router();

// Staff or Admin role required for all staff portal routes
router.use(requireAuth, requireRole(['STAFF', 'ADMIN']));

// GET /api/v1/staff/dashboard (Operational metrics & summaries)
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const departmentId = req.user!.departmentId;

    // Filter base: If Staff, issues assigned to them or their department
    const baseWhere: any = {};
    if (userRole === 'STAFF') {
      baseWhere.OR = [
        { assignedStaffId: userId },
        ...(departmentId ? [{ departmentId, assignedStaffId: null }] : []),
      ];
    }

    const [
      totalAssigned,
      pendingCount,
      inProgressCount,
      resolvedCount,
      recentRequests,
      userProfile,
    ] = await Promise.all([
      prisma.civicRequest.count({
        where: {
          ...baseWhere,
          status: { in: ['ASSIGNED', 'IN_PROGRESS'] },
        },
      }),
      prisma.civicRequest.count({
        where: {
          ...baseWhere,
          status: 'ASSIGNED',
        },
      }),
      prisma.civicRequest.count({
        where: {
          ...baseWhere,
          status: 'IN_PROGRESS',
        },
      }),
      prisma.civicRequest.count({
        where: {
          ...baseWhere,
          status: 'RESOLVED',
        },
      }),
      prisma.civicRequest.findMany({
        where: baseWhere,
        include: {
          attachments: true,
          citizen: { select: { id: true, name: true, phone: true } },
          department: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      prisma.user.findUnique({
        where: { id: userId },
        include: { department: true },
      }),
    ]);

    // Overdue: created more than 48 hours ago and not resolved
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const overdueCount = await prisma.civicRequest.count({
      where: {
        ...baseWhere,
        createdAt: { lt: fortyEightHoursAgo },
        status: { in: ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS'] },
      },
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalAssigned,
          pendingCount,
          inProgressCount,
          resolvedCount,
          overdueCount,
        },
        staffInfo: {
          id: userProfile?.id,
          name: userProfile?.name,
          email: userProfile?.email,
          phone: userProfile?.phone,
          role: userProfile?.role,
          departmentName: userProfile?.department?.name || 'Municipal Field Operations',
          departmentCode: userProfile?.department?.code || 'BBMP',
          assignedArea: userProfile?.assignedArea || 'Ward 151, Koramangala',
        },
        recentRequests,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/staff/assigned (Assigned complaints with filters)
router.get('/assigned', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const departmentId = req.user!.departmentId;
    const { status, priority, search, date } = req.query;

    const where: any = {};
    if (userRole === 'STAFF') {
      where.OR = [
        { assignedStaffId: userId },
        ...(departmentId ? [{ departmentId }] : []),
      ];
    }

    if (status && status !== 'all') {
      if (status === 'pending' || status === 'PENDING') {
        where.status = 'ASSIGNED';
      } else if (status === 'in-progress' || status === 'IN_PROGRESS') {
        where.status = 'IN_PROGRESS';
      } else if (status === 'resolved' || status === 'RESOLVED') {
        where.status = 'RESOLVED';
      } else {
        where.status = status;
      }
    }

    if (priority && priority !== 'all') {
      where.priority = priority;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.trim();
      where.AND = [
        {
          OR: [
            { publicRequestId: { contains: q } },
            { title: { contains: q } },
            { description: { contains: q } },
            { address: { contains: q } },
            { categoryName: { contains: q } },
          ],
        },
      ];
    }

    if (date === 'today') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      where.createdAt = { gte: startOfDay };
    } else if (date === 'week') {
      const startOfWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      where.createdAt = { gte: startOfWeek };
    }

    const requests = await prisma.civicRequest.findMany({
      where,
      include: {
        citizen: { select: { id: true, name: true, phone: true } },
        department: true,
        assignedStaff: { select: { id: true, name: true, phone: true } },
        attachments: true,
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/staff/work-queue (Prioritized active work queue)
router.get('/work-queue', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const departmentId = req.user!.departmentId;

    const where: any = {
      status: { in: ['ASSIGNED', 'IN_PROGRESS'] },
    };

    if (userRole === 'STAFF') {
      where.OR = [
        { assignedStaffId: userId },
        ...(departmentId ? [{ departmentId, assignedStaffId: null }] : []),
      ];
    }

    const queue = await prisma.civicRequest.findMany({
      where,
      include: {
        citizen: { select: { id: true, name: true, phone: true } },
        department: true,
        attachments: true,
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' },
      ],
    });

    res.json({ success: true, data: queue });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/staff/history (Completed & resolved work history)
router.get('/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const where: any = {
      status: 'RESOLVED',
    };

    if (userRole === 'STAFF') {
      where.assignedStaffId = userId;
    }

    const history = await prisma.civicRequest.findMany({
      where,
      include: {
        citizen: { select: { id: true, name: true, phone: true } },
        department: true,
        attachments: true,
      },
      orderBy: { resolvedAt: 'desc' },
    });

    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/staff/requests/:id (Specific complaint details for staff)
router.get('/requests/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const request = await prisma.civicRequest.findFirst({
      where: {
        OR: [{ id }, { publicRequestId: id }, { publicRequestId: `#${id}` }],
      },
      include: {
        citizen: { select: { id: true, name: true, phone: true, email: true } },
        department: true,
        assignedStaff: { select: { id: true, name: true, phone: true, email: true, assignedArea: true } },
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
        error: { code: 'NOT_FOUND', message: 'Request not found' },
      });
    }

    res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/staff/requests/:id/accept (Acknowledge assignment)
router.post('/requests/:id/accept', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const request = await prisma.civicRequest.findFirst({
      where: { OR: [{ id }, { publicRequestId: id }] },
    });

    if (!request) {
      return res.status(404).json({ success: false, error: { message: 'Request not found' } });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const reqUpdated = await tx.civicRequest.update({
        where: { id: request.id },
        data: {
          acceptedAt: new Date(),
          assignedStaffId: request.assignedStaffId || userId,
        },
      });

      await tx.requestStatusHistory.create({
        data: {
          requestId: request.id,
          previousStatus: request.status,
          newStatus: request.status,
          changedById: userId,
          note: `Staff member ${req.user!.name} acknowledged assignment and verified location.`,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: 'STAFF_ACCEPTED_ASSIGNMENT',
          entityType: 'CIVIC_REQUEST',
          entityId: request.id,
          metadata: JSON.stringify({ publicRequestId: request.publicRequestId }),
        },
      });

      await tx.notification.create({
        data: {
          userId: request.citizenId,
          title: `Assignment Acknowledged: ${request.publicRequestId}`,
          message: `Officer ${req.user!.name} has accepted your request and is preparing field action.`,
          type: 'REQUEST_UPDATE',
          relatedEntityId: request.id,
        },
      });

      return reqUpdated;
    });

    res.json({ success: true, data: updated, message: 'Assignment accepted successfully' });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/staff/requests/:id/start (Move to IN_PROGRESS)
router.post('/requests/:id/start', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const request = await prisma.civicRequest.findFirst({
      where: { OR: [{ id }, { publicRequestId: id }] },
    });

    if (!request) {
      return res.status(404).json({ success: false, error: { message: 'Request not found' } });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const reqUpdated = await tx.civicRequest.update({
        where: { id: request.id },
        data: {
          status: 'IN_PROGRESS',
        },
      });

      await tx.requestStatusHistory.create({
        data: {
          requestId: request.id,
          previousStatus: request.status,
          newStatus: 'IN_PROGRESS',
          changedById: userId,
          note: `Field staff ${req.user!.name} commenced on-ground resolution work.`,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: 'STAFF_STARTED_WORK',
          entityType: 'CIVIC_REQUEST',
          entityId: request.id,
          metadata: JSON.stringify({ publicRequestId: request.publicRequestId }),
        },
      });

      await tx.notification.create({
        data: {
          userId: request.citizenId,
          title: `Work In Progress: ${request.publicRequestId}`,
          message: `Field team led by ${req.user!.name} has started resolution at ${request.address}.`,
          type: 'REQUEST_UPDATE',
          relatedEntityId: request.id,
        },
      });

      return reqUpdated;
    });

    res.json({ success: true, data: updated, message: 'Work started on complaint' });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/staff/requests/:id/progress (Post progress note)
const progressSchema = z.object({
  note: z.string().min(3),
});

router.post('/requests/:id/progress', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { note } = progressSchema.parse(req.body);

    const request = await prisma.civicRequest.findFirst({
      where: { OR: [{ id }, { publicRequestId: id }] },
    });

    if (!request) {
      return res.status(404).json({ success: false, error: { message: 'Request not found' } });
    }

    await prisma.$transaction(async (tx) => {
      await tx.requestStatusHistory.create({
        data: {
          requestId: request.id,
          previousStatus: request.status,
          newStatus: request.status,
          changedById: userId,
          note: `Field update: ${note}`,
        },
      });

      await tx.requestComment.create({
        data: {
          requestId: request.id,
          authorId: userId,
          message: note,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: 'STAFF_PROGRESS_UPDATE',
          entityType: 'CIVIC_REQUEST',
          entityId: request.id,
          metadata: JSON.stringify({ note }),
        },
      });

      await tx.notification.create({
        data: {
          userId: request.citizenId,
          title: `Update on ${request.publicRequestId}`,
          message: note,
          type: 'REQUEST_UPDATE',
          relatedEntityId: request.id,
        },
      });
    });

    res.json({ success: true, message: 'Progress update logged successfully' });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/staff/requests/:id/resolve (Resolve with resolution note and evidence)
const resolveSchema = z.object({
  resolutionNote: z.string().min(5),
  evidenceUrl: z.string().optional(),
});

router.post('/requests/:id/resolve', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { resolutionNote, evidenceUrl } = resolveSchema.parse(req.body);

    const request = await prisma.civicRequest.findFirst({
      where: { OR: [{ id }, { publicRequestId: id }] },
    });

    if (!request) {
      return res.status(404).json({ success: false, error: { message: 'Request not found' } });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const reqUpdated = await tx.civicRequest.update({
        where: { id: request.id },
        data: {
          status: 'RESOLVED',
          resolvedAt: new Date(),
          resolutionNote,
          resolutionEvidence: evidenceUrl || null,
        },
      });

      if (evidenceUrl) {
        await tx.requestAttachment.create({
          data: {
            requestId: request.id,
            storageKey: `evidence/${request.id}/resolved.jpg`,
            fileUrl: evidenceUrl,
            contentType: 'image/jpeg',
            size: 200000,
            uploadedBy: userId,
          },
        });
      }

      await tx.requestStatusHistory.create({
        data: {
          requestId: request.id,
          previousStatus: request.status,
          newStatus: 'RESOLVED',
          changedById: userId,
          note: `Issue resolved on site. Note: ${resolutionNote}`,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: 'STAFF_RESOLVED_COMPLAINT',
          entityType: 'CIVIC_REQUEST',
          entityId: request.id,
          metadata: JSON.stringify({ resolutionNote, evidenceUrl }),
        },
      });

      await tx.notification.create({
        data: {
          userId: request.citizenId,
          title: `Grievance Resolved: ${request.publicRequestId}`,
          message: `Your grievance has been marked resolved: "${resolutionNote}". Thank you for helping keep Namma City clean and safe.`,
          type: 'REQUEST_UPDATE',
          relatedEntityId: request.id,
        },
      });

      return reqUpdated;
    });

    res.json({ success: true, data: updated, message: 'Grievance marked as resolved' });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/staff/requests/:id/reassignment-request (Request reassignment)
const reassignmentSchema = z.object({
  reason: z.string().min(5),
});

router.post('/requests/:id/reassignment-request', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { reason } = reassignmentSchema.parse(req.body);

    const request = await prisma.civicRequest.findFirst({
      where: { OR: [{ id }, { publicRequestId: id }] },
    });

    if (!request) {
      return res.status(404).json({ success: false, error: { message: 'Request not found' } });
    }

    await prisma.$transaction(async (tx) => {
      await tx.civicRequest.update({
        where: { id: request.id },
        data: {
          reassignmentReason: reason,
        },
      });

      await tx.requestStatusHistory.create({
        data: {
          requestId: request.id,
          previousStatus: request.status,
          newStatus: request.status,
          changedById: userId,
          note: `Staff requested reassignment: ${reason}`,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: 'STAFF_REASSIGNMENT_REQUESTED',
          entityType: 'CIVIC_REQUEST',
          entityId: request.id,
          metadata: JSON.stringify({ reason }),
        },
      });
    });

    res.json({ success: true, message: 'Reassignment request submitted for administrative review' });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/staff/profile
router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        department: true,
        _count: {
          select: {
            assignedRequests: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: { message: 'Staff profile not found' } });
    }

    const resolvedCount = await prisma.civicRequest.count({
      where: {
        assignedStaffId: userId,
        status: 'RESOLVED',
      },
    });

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        assignedArea: user.assignedArea || 'Ward 151, Koramangala',
        departmentId: user.departmentId,
        departmentName: user.department?.name || 'General Municipal Services',
        departmentCode: user.department?.code || 'BBMP',
        stats: {
          totalAssigned: user._count.assignedRequests,
          totalResolved: resolvedCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
