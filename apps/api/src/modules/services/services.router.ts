import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '@namma-city/database';

const router = Router();

// GET /services/categories
router.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

// GET /services
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search } = req.query;

    const where: any = { enabled: true };

    if (category && category !== 'all') {
      where.category = { slug: category as string };
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const services = await prisma.civicService.findMany({
      where,
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
    });

    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
});

// GET /services/:slug
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await prisma.civicService.findUnique({
      where: { slug: req.params.slug },
      include: { category: true },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Service not found' },
      });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
});

export default router;
