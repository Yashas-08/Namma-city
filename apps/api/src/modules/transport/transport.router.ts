import { Router, Request, Response } from 'express';

const router = Router();

const TRANSIT_ROUTES = [
  {
    routeNumber: 'KIA-8',
    from: 'Electronic City',
    to: 'Kempegowda Int. Airport',
    via: 'Koramangala, Indiranagar, Hebbal',
    type: 'Vayu Vajra AC',
    frequency: 'Every 20 mins',
    firstBus: '04:30 AM',
    lastBus: '11:15 PM',
  },
  {
    routeNumber: 'G-2',
    from: 'Majestic (KBS)',
    to: 'Sarjapur',
    via: 'Corporation, Dairy Circle, Koramangala',
    type: 'Big City Ordinary',
    frequency: 'Every 12 mins',
    firstBus: '05:45 AM',
    lastBus: '10:30 PM',
  },
  {
    routeNumber: '500-D',
    from: 'Hebbal',
    to: 'Silk Board',
    via: 'Manyata, Marathahalli, Bellandur',
    type: 'Vajra AC / Ordinary',
    frequency: 'Every 8 mins',
    firstBus: '05:00 AM',
    lastBus: '11:30 PM',
  },
  {
    routeNumber: 'Green Line',
    from: 'Nagasandra',
    to: 'Silk Institute',
    via: 'Majestic, RV Road, Jayanagar',
    type: 'Namma Metro',
    frequency: 'Every 5 mins (Peak)',
    firstBus: '05:00 AM',
    lastBus: '11:00 PM',
  },
  {
    routeNumber: 'Purple Line',
    from: 'Challaghatta',
    to: 'Whitefield (Kadugodi)',
    via: 'Majestic, MG Road, Indiranagar',
    type: 'Namma Metro',
    frequency: 'Every 4 mins (Peak)',
    firstBus: '05:00 AM',
    lastBus: '11:05 PM',
  },
];

router.get('/routes', (req: Request, res: Response) => {
  const q = ((req.query.q as string) || '').toLowerCase();
  if (!q) {
    return res.json({ success: true, data: TRANSIT_ROUTES });
  }

  const filtered = TRANSIT_ROUTES.filter(
    (r) =>
      r.routeNumber.toLowerCase().includes(q) ||
      r.from.toLowerCase().includes(q) ||
      r.to.toLowerCase().includes(q) ||
      r.via.toLowerCase().includes(q)
  );

  res.json({ success: true, data: filtered });
});

export default router;
