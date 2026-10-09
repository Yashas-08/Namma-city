import { test, describe } from 'node:test';
import assert from 'node:assert';
import app from '../index';
import { generateToken } from '../middleware/auth';
import { prisma } from '@namma-city/database';

describe('Role-Based Access Control and End-to-End Complaint Lifecycle', () => {
  // Test Tokens
  let citizenToken: string;
  let staffToken: string;
  let adminToken: string;

  let citizenUser: any;
  let staffUser: any;
  let adminUser: any;
  let testComplaintId: string;

  test('0. Setup test users and tokens', async () => {
    citizenUser = await prisma.user.findUnique({ where: { email: 'yashas@example.com' } });
    staffUser = await prisma.user.findUnique({ where: { email: 'ramesh@bbmp.gov.in' } });
    adminUser = await prisma.user.findUnique({ where: { email: 'admin@nammacity.gov.in' } });

    assert.ok(citizenUser, 'Citizen user must exist in DB');
    assert.ok(staffUser, 'Staff user must exist in DB');
    assert.ok(adminUser, 'Admin user must exist in DB');

    citizenToken = generateToken({
      id: citizenUser.id,
      name: citizenUser.name,
      email: citizenUser.email,
      role: 'CITIZEN',
    });

    staffToken = generateToken({
      id: staffUser.id,
      name: staffUser.name,
      email: staffUser.email,
      role: 'STAFF',
      departmentId: staffUser.departmentId,
    });

    adminToken = generateToken({
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: 'ADMIN',
    });
  });

  test('1. Authorization Enforcement: Citizen blocked from Admin routes (HTTP 403)', async () => {
    const res = await fetch('http://localhost:5000/api/v1/admin/dashboard', {
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    assert.strictEqual(res.status, 403, 'Citizen must receive 403 on admin routes');
  });

  test('2. Authorization Enforcement: Citizen blocked from Staff routes (HTTP 403)', async () => {
    const res = await fetch('http://localhost:5000/api/v1/staff/dashboard', {
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    assert.strictEqual(res.status, 403, 'Citizen must receive 403 on staff routes');
  });

  test('3. Authorization Enforcement: Staff blocked from Admin console (HTTP 403)', async () => {
    const res = await fetch('http://localhost:5000/api/v1/admin/dashboard', {
      headers: { Authorization: `Bearer ${staffToken}` },
    });
    assert.strictEqual(res.status, 403, 'Staff must receive 403 on admin console');
  });

  test('4. Authorization Success: Staff can access Staff Dashboard (HTTP 200)', async () => {
    const res = await fetch('http://localhost:5000/api/v1/staff/dashboard', {
      headers: { Authorization: `Bearer ${staffToken}` },
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.stats, 'Dashboard must return computed operational stats');
  });

  test('5. Authorization Success: Admin can access Admin Dashboard (HTTP 200)', async () => {
    const res = await fetch('http://localhost:5000/api/v1/admin/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.metrics.totalComplaints >= 0);
  });

  test('6. Lifecycle Step 1: Citizen submits complaint -> status SUBMITTED', async () => {
    const res = await fetch('http://localhost:5000/api/v1/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${citizenToken}`,
      },
      body: JSON.stringify({
        categoryId: 'ROADS',
        categoryName: 'Roads & Footpaths',
        title: 'Deep pothole near 80 Feet Road junction',
        description: 'Large crater posing severe safety risk to two-wheelers near Sony World signal.',
        address: '80 Feet Road, 4th Block, Koramangala, Bengaluru',
        latitude: 12.9344,
        longitude: 77.6256,
        photos: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800'],
      }),
    });

    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.id);
    testComplaintId = json.data.id;

    // Verify DB state
    const created = await prisma.civicRequest.findUnique({ where: { id: testComplaintId } });
    assert.strictEqual(created?.status, 'SUBMITTED');
  });

  test('7. Lifecycle Step 2: Admin reviews and assigns Department & Staff -> status ASSIGNED', async () => {
    const dept = await prisma.department.findFirst();

    const res = await fetch(`http://localhost:5000/api/v1/admin/complaints/${testComplaintId}/assignment`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        departmentId: dept?.id,
        assignedStaffId: staffUser.id,
        note: 'High priority road surface defect assigned to Officer Ramesh.',
      }),
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.status, 'ASSIGNED');
    assert.strictEqual(json.data.assignedStaffId, staffUser.id);
  });

  test('8. Lifecycle Step 3: Staff accepts assignment', async () => {
    const res = await fetch(`http://localhost:5000/api/v1/staff/requests/${testComplaintId}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` },
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.acceptedAt, 'acceptedAt must be recorded in database');
  });

  test('9. Lifecycle Step 4: Staff commences work -> status IN_PROGRESS', async () => {
    const res = await fetch(`http://localhost:5000/api/v1/staff/requests/${testComplaintId}/start`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` },
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.status, 'IN_PROGRESS');
  });

  test('10. Lifecycle Step 5: Staff posts operational progress update', async () => {
    const res = await fetch(`http://localhost:5000/api/v1/staff/requests/${testComplaintId}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`,
      },
      body: JSON.stringify({
        note: 'Hot-mix asphalt patch team deployed on-ground at 80 Feet Road.',
      }),
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
  });

  test('11. Lifecycle Step 6: Staff resolves complaint with verification note & evidence -> status RESOLVED', async () => {
    const res = await fetch(`http://localhost:5000/api/v1/staff/requests/${testComplaintId}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`,
      },
      body: JSON.stringify({
        resolutionNote: 'Pothole compacted with dense bituminous macadam. Road smooth and safe for vehicular transit.',
        evidenceUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800',
      }),
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.status, 'RESOLVED');
    assert.ok(json.data.resolvedAt);
    assert.ok(json.data.resolutionNote);
  });

  test('12. Lifecycle Step 7: Citizen tracks resolved complaint and verifies timeline', async () => {
    const res = await fetch(`http://localhost:5000/api/v1/requests/${testComplaintId}`, {
      headers: { Authorization: `Bearer ${citizenToken}` },
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.status, 'RESOLVED');
    assert.ok(json.data.statusHistory.length >= 4, 'Timeline must contain full status history');
  });

  test('13. Lifecycle Step 8: Citizen receives database-backed notification', async () => {
    const res = await fetch('http://localhost:5000/api/v1/notifications', {
      headers: { Authorization: `Bearer ${citizenToken}` },
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    const notification = json.data.notifications.find((n: any) => n.relatedEntityId === testComplaintId);
    assert.ok(notification, 'Citizen must receive notification for the complaint');
  });

  test('14. Lifecycle Step 9: Citizen can reopen resolved complaint with reason -> status IN_PROGRESS', async () => {
    const res = await fetch(`http://localhost:5000/api/v1/requests/${testComplaintId}/reopen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${citizenToken}`,
      },
      body: JSON.stringify({
        reason: 'Uneven asphalt edges remaining along the pavement curb.',
      }),
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.status, 'IN_PROGRESS');
  });
});
