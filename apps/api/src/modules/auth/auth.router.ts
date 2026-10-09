import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '@namma-city/database';
import { generateToken, requireAuth } from '../../middleware/auth';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
});

const switchDemoSchema = z.object({
  role: z.enum(['CITIZEN', 'STAFF', 'ADMIN']),
});

// GET /session
router.get('/session', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.json({
        success: true,
        data: { authenticated: false, user: null },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        department: true,
        _count: {
          select: {
            requests: true,
            notifications: {
              where: { readAt: null },
            },
          },
        },
      },
    });

    if (!user) {
      return res.json({
        success: true,
        data: { authenticated: false, user: null },
      });
    }

    res.json({
      success: true,
      data: {
        authenticated: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          role: user.role,
          departmentId: user.departmentId,
          departmentName: user.department?.name,
          unreadNotificationsCount: user._count.notifications,
          totalRequestsCount: user._count.requests,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: { department: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
    }

    // In hackathon seed, password is validated
    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any,
      departmentId: user.departmentId,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          role: user.role,
          departmentId: user.departmentId,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /register
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, password } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: 'Email is already registered' },
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash: password, // In production, hash with bcrypt
        role: 'CITIZEN',
      },
    });

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'CITIZEN',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /switch-demo (Hackathon evaluator convenience)
router.post('/switch-demo', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = switchDemoSchema.parse(req.body);

    let targetEmail = 'yashas@example.com';
    if (role === 'STAFF') targetEmail = 'ramesh@bbmp.gov.in';
    if (role === 'ADMIN') targetEmail = 'admin@nammacity.gov.in';

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      include: { department: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: `Demo user for role ${role} not found` },
      });
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any,
      departmentId: user.departmentId,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          role: user.role,
          departmentId: user.departmentId,
          departmentName: user.department?.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /logout
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
