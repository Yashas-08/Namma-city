import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '@namma-city/database';

const router = Router();

// Haversine distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// GET /locations/nearby
router.get('/nearby', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, lat, lng } = req.query;

    const userLat = lat ? parseFloat(lat as string) : 12.9352; // Default Koramangala
    const userLng = lng ? parseFloat(lng as string) : 77.6245;

    const where: any = { active: true };
    if (category && category !== 'all' && category !== 'ALL') {
      where.category = (category as string).toUpperCase();
    }

    const locations = await prisma.civicLocation.findMany({ where });

    const withDistance = locations.map((loc) => {
      const distanceKm = calculateDistanceKm(userLat, userLng, loc.latitude, loc.longitude);
      return {
        id: loc.id,
        name: loc.name,
        category: loc.category,
        address: loc.address,
        latitude: loc.latitude,
        longitude: loc.longitude,
        phone: loc.phone,
        openingHours: loc.openingHours,
        distanceKm,
        isOpenNow: true,
      };
    });

    withDistance.sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({ success: true, data: withDistance });
  } catch (error) {
    next(error);
  }
});

// GET /locations/search (Bengaluru places lookup)
const BENGALURU_PLACES = [
  { name: 'Koramangala 5th Block, Bengaluru', address: 'Koramangala 5th Block, Bengaluru - 560034', lat: 12.9352, lng: 77.6245 },
  { name: 'Indiranagar 100ft Road, Bengaluru', address: '100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru - 560038', lat: 12.9719, lng: 77.6412 },
  { name: 'HSR Layout Sector 1, Bengaluru', address: '27th Main Rd, Sector 1, HSR Layout, Bengaluru - 560102', lat: 12.9116, lng: 77.6389 },
  { name: 'Jayanagar 4th Block, Bengaluru', address: '11th Main Rd, 4th Block, Jayanagar, Bengaluru - 560011', lat: 12.9308, lng: 77.5838 },
  { name: 'BTM Layout 2nd Stage, Bengaluru', address: 'Outer Ring Rd, BTM 2nd Stage, Bengaluru - 560076', lat: 12.9166, lng: 77.6101 },
  { name: 'Whitefield Main Road, Bengaluru', address: 'Whitefield Main Rd, Prestige Ozone, Bengaluru - 560066', lat: 12.9698, lng: 77.7499 },
  { name: 'Malleshwaram 8th Cross, Bengaluru', address: 'Sampige Rd, Malleshwaram, Bengaluru - 560003', lat: 13.0031, lng: 77.5694 },
  { name: 'MG Road Metro Station, Bengaluru', address: 'Mahatma Gandhi Rd, Haridevpur, Shanthala Nagar, Bengaluru - 560001', lat: 12.9756, lng: 77.6097 },
];

router.get('/search', (req: Request, res: Response) => {
  const q = ((req.query.q as string) || '').toLowerCase();
  if (!q) {
    return res.json({ success: true, data: BENGALURU_PLACES });
  }

  const results = BENGALURU_PLACES.filter(
    (p) => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
  );
  res.json({ success: true, data: results });
});

// GET /locations/reverse
router.get('/reverse', (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);

  if (isNaN(lat) || isNaN(lng)) {
    return res.json({
      success: true,
      data: { address: 'Koramangala 5th Block, Bengaluru - 560034', lat: 12.9352, lng: 77.6245 },
    });
  }

  // Find nearest from known places
  let closest = BENGALURU_PLACES[0];
  let minDistance = calculateDistanceKm(lat, lng, closest.lat, closest.lng);

  for (const place of BENGALURU_PLACES) {
    const d = calculateDistanceKm(lat, lng, place.lat, place.lng);
    if (d < minDistance) {
      minDistance = d;
      closest = place;
    }
  }

  res.json({
    success: true,
    data: {
      address: closest.address,
      latitude: lat,
      longitude: lng,
    },
  });
});

export default router;
