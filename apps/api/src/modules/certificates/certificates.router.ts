import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../../middleware/auth';

const router = Router();

// In-memory or state storage for demo certificates (with realistic application flow)
interface CertificateApplication {
  id: string;
  applicationNumber: string;
  userId: string;
  certificateType: string;
  applicantName: string;
  status: 'PENDING_VERIFICATION' | 'APPROVED' | 'DISPATCHED';
  appliedDate: string;
  estimatedCompletion: string;
  isSimulated: boolean;
}

const demoApplications: CertificateApplication[] = [
  {
    id: 'cert-1',
    applicationNumber: 'CERT-BBMP-2026-8819',
    userId: 'default',
    certificateType: 'Birth Certificate',
    applicantName: 'Yashas K',
    status: 'APPROVED',
    appliedDate: '2026-09-15',
    estimatedCompletion: 'Completed',
    isSimulated: true,
  },
];

const applyCertificateSchema = z.object({
  certificateType: z.string(),
  applicantName: z.string().min(2),
  details: z.record(z.any()).optional(),
});

router.get('/services', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: 'birth-cert',
        title: 'Birth Certificate',
        description: 'Digitally signed e-certificate with municipal seal',
        issuingAuthority: 'BBMP Vital Statistics Dept',
        processingDays: '3-5 Working Days',
        fee: '₹ 50',
      },
      {
        id: 'death-cert',
        title: 'Death Certificate',
        description: 'Official vital record certificate with QR verification',
        issuingAuthority: 'BBMP Vital Statistics Dept',
        processingDays: '3-5 Working Days',
        fee: '₹ 50',
      },
      {
        id: 'trade-license',
        title: 'Trade License Renewal',
        description: 'Annual commercial and retail trade establishment license',
        issuingAuthority: 'BBMP Health & Revenue Wing',
        processingDays: '7-10 Working Days',
        fee: '₹ 1,500',
      },
    ],
  });
});

router.get('/requests', requireAuth, (req: Request, res: Response) => {
  const userApps = demoApplications.filter(
    (a) => a.userId === req.user!.id || a.userId === 'default'
  );
  res.json({ success: true, data: userApps });
});

router.post('/requests', requireAuth, (req: Request, res: Response) => {
  const { certificateType, applicantName } = applyCertificateSchema.parse(req.body);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const applicationNumber = `CERT-BBMP-2026-${randomNum}`;

  const newApp: CertificateApplication = {
    id: `cert-${Date.now()}`,
    applicationNumber,
    userId: req.user!.id,
    certificateType,
    applicantName,
    status: 'PENDING_VERIFICATION',
    appliedDate: new Date().toISOString().split('T')[0],
    estimatedCompletion: '3 Working Days',
    isSimulated: true,
  };

  demoApplications.unshift(newApp);

  res.status(201).json({
    success: true,
    data: newApp,
    message: 'Certificate application submitted successfully (Demonstration Flow)',
  });
});

export default router;
