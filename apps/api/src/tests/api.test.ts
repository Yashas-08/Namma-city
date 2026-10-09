import test from 'node:test';
import assert from 'node:assert/strict';

// 1. Test Public ID format
function generatePublicRequestId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `#REQ-${num}`;
}

test('generatePublicRequestId generates valid #REQ-XXXX format', () => {
  const id = generatePublicRequestId();
  assert.match(id, /^#REQ-\d{4}$/);
});

// 2. Test Currency formatting from integer minor units (paise)
function formatCurrency(amountMinor: number): string {
  return `₹ ${(amountMinor / 100).toLocaleString('en-IN')}`;
}

test('formatCurrency correctly formats minor units to INR format', () => {
  assert.equal(formatCurrency(124000), '₹ 1,240');
  assert.equal(formatCurrency(68000), '₹ 680');
  assert.equal(formatCurrency(450000), '₹ 4,500');
});

// 3. Test Haversine distance calculation
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
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

test('calculateDistanceKm accurately measures proximity within Bengaluru', () => {
  // Distance from Koramangala 5th block (12.9352, 77.6245) to Koramangala Police Station (12.9381, 77.6224)
  const dist = calculateDistanceKm(12.9352, 77.6245, 12.9381, 77.6224);
  assert.ok(dist >= 0.3 && dist <= 0.6, `Expected distance ~0.4km, got ${dist}`);
});

// 4. Test Complaint Status Lifecycle Transitions
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  SUBMITTED: ['ASSIGNED', 'REJECTED'],
  ASSIGNED: ['IN_PROGRESS', 'REJECTED'],
  IN_PROGRESS: ['RESOLVED', 'REJECTED'],
  RESOLVED: ['IN_PROGRESS'], // can reopen if permitted
  REJECTED: ['SUBMITTED'],
};

function isValidTransition(current: string, next: string): boolean {
  return ALLOWED_TRANSITIONS[current]?.includes(next) ?? false;
}

test('Civic grievance lifecycle transitions follow municipal rules', () => {
  assert.equal(isValidTransition('SUBMITTED', 'ASSIGNED'), true);
  assert.equal(isValidTransition('ASSIGNED', 'IN_PROGRESS'), true);
  assert.equal(isValidTransition('IN_PROGRESS', 'RESOLVED'), true);
  // Invalid jump
  assert.equal(isValidTransition('SUBMITTED', 'RESOLVED'), false);
});
