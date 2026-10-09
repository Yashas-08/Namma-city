import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '@namma-city/database';
import { requireAuth } from '../../middleware/auth';

const router = Router();

// GET /users/me
router.get('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        department: true,
        savedLocations: true,
        _count: {
          select: {
            requests: true,
            payments: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        role: user.role,
        departmentName: user.department?.name,
        totalRequests: user._count.requests,
        totalPayments: user._count.payments,
        savedLocations: user.savedLocations,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /users/me
const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
});

router.patch('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = updateProfileSchema.parse(req.body);
    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: body,
      select: { id: true, name: true, email: true, phone: true, avatarUrl: true, role: true },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// GET /users/me/locations
router.get('/me/locations', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locations = await prisma.savedLocation.findMany({
      where: { userId: req.user!.id },
    });
    res.json({ success: true, data: locations });
  } catch (error) {
    next(error);
  }
});

// POST /users/me/locations
const addLocationSchema = z.object({
  label: z.string().min(1),
  address: z.string().min(3),
  latitude: z.number(),
  longitude: z.number(),
});

router.post('/me/locations', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = addLocationSchema.parse(req.body);
    const saved = await prisma.savedLocation.create({
      data: {
        userId: req.user!.id,
        ...body,
      },
    });
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
});

export default router;
