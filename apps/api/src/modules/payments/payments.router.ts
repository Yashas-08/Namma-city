import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '@namma-city/database';
import { requireAuth } from '../../middleware/auth';

const router = Router();

// GET /payments/providers
router.get('/providers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const providers = await prisma.utilityProvider.findMany({
      where: { enabled: true },
    });
    res.json({ success: true, data: providers });
  } catch (error) {
    next(error);
  }
});

// POST /payments/bill-lookup
const lookupSchema = z.object({
  providerCode: z.string(),
  accountReference: z.string().min(3),
});

router.post('/bill-lookup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { providerCode, accountReference } = lookupSchema.parse(req.body);

    const provider = await prisma.utilityProvider.findUnique({
      where: { providerCode },
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROVIDER_NOT_FOUND', message: 'Utility provider not supported' },
      });
    }

    const now = new Date();
    const dueDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from now

    // Lookup or dynamically create a simulated bill for evaluation
    const bill = await prisma.bill.upsert({
      where: {
        providerId_accountReference: {
          providerId: provider.id,
          accountReference,
        },
      },
      update: {},
      create: {
        providerId: provider.id,
        accountReference,
        customerName: req.user?.name || 'Yashas K',
        amountMinor: 124000, // ₹ 1,240
        currency: 'INR',
        dueDate,
        billingPeriod: 'Sep 2026',
        billStatus: 'UNPAID',
      },
    });

    const dueDateObj = new Date(bill.dueDate);
    const diffTime = dueDateObj.getTime() - new Date().getTime();
    const dueInDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    res.json({
      success: true,
      data: {
        id: bill.id,
        providerCode: provider.providerCode,
        providerName: provider.name,
        serviceType: provider.serviceType,
        accountReference: bill.accountReference,
        customerName: bill.customerName,
        amountMinor: bill.amountMinor,
        amountFormatted: `₹ ${(bill.amountMinor / 100).toLocaleString('en-IN')}`,
        currency: bill.currency,
        billingPeriod: bill.billingPeriod,
        dueDate: bill.dueDate,
        dueInDays,
        billStatus: bill.billStatus,
        isSimulated: true,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /payments/pay
const paySchema = z.object({
  billId: z.string().optional(),
  providerCode: z.string(),
  accountReference: z.string(),
  paymentMethod: z.string().default('UPI (Google Pay)'),
  amountMinor: z.number().positive(),
  idempotencyKey: z.string().optional(),
});

router.post('/pay', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = paySchema.parse(req.body);

    const provider = await prisma.utilityProvider.findUnique({
      where: { providerCode: body.providerCode },
    });

    const providerName = provider?.name || body.providerCode;

    // Check idempotency if provided
    if (body.idempotencyKey) {
      const existingTx = await prisma.paymentTransaction.findUnique({
        where: { idempotencyKey: body.idempotencyKey },
      });
      if (existingTx) {
        return res.json({ success: true, data: existingTx });
      }
    }

    const randomTxnNum = Math.floor(100000000 + Math.random() * 900000000);
    const transactionId = `TXN${randomTxnNum}`;
    const randomRecNum = Math.floor(1000 + Math.random() * 9000);
    const receiptNumber = `REC-2026-${randomRecNum}`;

    const transaction = await prisma.$transaction(async (tx) => {
      // Create payment transaction
      const txn = await tx.paymentTransaction.create({
        data: {
          transactionId,
          userId: req.user!.id,
          billId: body.billId || null,
          idempotencyKey: body.idempotencyKey || null,
          providerName,
          serviceType: provider?.serviceType || 'UTILITY',
          accountReference: body.accountReference,
          amountMinor: body.amountMinor,
          currency: 'INR',
          gateway: 'SANDBOX_UPI',
          paymentMethod: body.paymentMethod,
          status: 'SUCCESSFUL',
          receiptNumber,
          isSimulated: true,
        },
      });

      // Update bill if billId provided
      if (body.billId) {
        await tx.bill.update({
          where: { id: body.billId },
          data: { billStatus: 'PAID' },
        });
      }

      // Create notification
      await tx.notification.create({
        data: {
          userId: req.user!.id,
          title: 'Payment Successful',
          message: `Your payment of ₹${(body.amountMinor / 100).toLocaleString('en-IN')} to ${providerName} (${body.accountReference}) was successful.`,
          type: 'PAYMENT',
          relatedEntityId: txn.id,
        },
      });

      return txn;
    });

    res.status(201).json({
      success: true,
      data: {
        id: transaction.id,
        transactionId: transaction.transactionId,
        providerName: transaction.providerName,
        accountReference: transaction.accountReference,
        amountMinor: transaction.amountMinor,
        amountFormatted: `₹ ${(transaction.amountMinor / 100).toLocaleString('en-IN')}`,
        currency: transaction.currency,
        paymentMethod: transaction.paymentMethod,
        status: transaction.status,
        receiptNumber: transaction.receiptNumber,
        isSimulated: true,
        createdAt: transaction.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /payments/history
router.get('/history', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await prisma.paymentTransaction.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: transactions.map((t) => ({
        ...t,
        amountFormatted: `₹ ${(t.amountMinor / 100).toLocaleString('en-IN')}`,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// GET /payments/:id
router.get('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.paymentTransaction.findFirst({
      where: {
        OR: [{ id }, { transactionId: id }],
        userId: req.user!.id,
      },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, error: { message: 'Payment transaction not found' } });
    }

    res.json({
      success: true,
      data: {
        ...transaction,
        amountFormatted: `₹ ${(transaction.amountMinor / 100).toLocaleString('en-IN')}`,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
