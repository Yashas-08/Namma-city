import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Namma City database...');

  // 1. Departments
  const deptRoads = await prisma.department.upsert({
    where: { code: 'BBMP_ROADS' },
    update: {},
    create: {
      name: 'BBMP Roads & Infrastructure',
      code: 'BBMP_ROADS',
      contactDetails: 'support.roads@bbmp.gov.in | 080-22660000',
      active: true,
    },
  });

  const deptBescom = await prisma.department.upsert({
    where: { code: 'BESCOM_POWER' },
    update: {},
    create: {
      name: 'BESCOM Electrical & Streetlights',
      code: 'BESCOM_POWER',
      contactDetails: 'helpline@bescom.karnataka.gov.in | 1912',
      active: true,
    },
  });

  const deptBwssb = await prisma.department.upsert({
    where: { code: 'BWSSB_WATER' },
    update: {},
    create: {
      name: 'BWSSB Water Supply & Sewerage',
      code: 'BWSSB_WATER',
      contactDetails: 'callcenter@bwssb.gov.in | 1916',
      active: true,
    },
  });

  const deptSwm = await prisma.department.upsert({
    where: { code: 'BBMP_SWM' },
    update: {},
    create: {
      name: 'BBMP Solid Waste Management',
      code: 'BBMP_SWM',
      contactDetails: 'cleanliness@bbmp.gov.in | 080-22975555',
      active: true,
    },
  });

  const deptHealth = await prisma.department.upsert({
    where: { code: 'BBMP_HEALTH' },
    update: {},
    create: {
      name: 'BBMP Public Health & Welfare',
      code: 'BBMP_HEALTH',
      contactDetails: 'health@bbmp.gov.in',
      active: true,
    },
  });

  // 2. Users (Citizen, Staff, Admin)
  // Demo password: "password123" (simple hash or base64 token for demo)
  const passwordHash = 'nammacity#pass123';

  const citizen = await prisma.user.upsert({
    where: { email: 'yashas@example.com' },
    update: {
      name: 'Yashas K',
      phone: '+91 98765 43210',
      avatarUrl: '/avatars/yashas.png',
      role: 'CITIZEN',
    },
    create: {
      name: 'Yashas K',
      email: 'yashas@example.com',
      phone: '+91 98765 43210',
      avatarUrl: '/avatars/yashas.png',
      passwordHash,
      role: 'CITIZEN',
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'ramesh@bbmp.gov.in' },
    update: {
      name: 'Officer Ramesh',
      phone: '+91 94480 12345',
      role: 'STAFF',
      assignedArea: 'Ward 151, Koramangala',
      departmentId: deptRoads.id,
      userStatus: 'ACTIVE',
    },
    create: {
      name: 'Officer Ramesh',
      email: 'ramesh@bbmp.gov.in',
      phone: '+91 94480 12345',
      passwordHash,
      role: 'STAFF',
      assignedArea: 'Ward 151, Koramangala',
      departmentId: deptRoads.id,
      userStatus: 'ACTIVE',
    },
  });

  const staff2 = await prisma.user.upsert({
    where: { email: 'suresh@bescom.karnataka.gov.in' },
    update: {
      name: 'Inspector Suresh',
      phone: '+91 98860 54321',
      role: 'STAFF',
      assignedArea: 'Ward 142, HSR Layout',
      departmentId: deptBescom.id,
      userStatus: 'ACTIVE',
    },
    create: {
      name: 'Inspector Suresh',
      email: 'suresh@bescom.karnataka.gov.in',
      phone: '+91 98860 54321',
      passwordHash,
      role: 'STAFF',
      assignedArea: 'Ward 142, HSR Layout',
      departmentId: deptBescom.id,
      userStatus: 'ACTIVE',
    },
  });

  const citizenPrimary = await prisma.user.upsert({
    where: { email: 'citizen@nammacity.gov.in' },
    update: {
      name: 'Yashas Citizen',
      phone: '+91 98765 43210',
      avatarUrl: '/avatars/yashas.png',
      role: 'CITIZEN',
      userStatus: 'ACTIVE',
    },
    create: {
      name: 'Yashas Citizen',
      email: 'citizen@nammacity.gov.in',
      phone: '+91 98765 43210',
      avatarUrl: '/avatars/yashas.png',
      passwordHash,
      role: 'CITIZEN',
      userStatus: 'ACTIVE',
    },
  });

  const staffPrimary = await prisma.user.upsert({
    where: { email: 'staff@nammacity.gov.in' },
    update: {
      name: 'Field Officer Ramesh',
      phone: '+91 94480 12345',
      role: 'STAFF',
      assignedArea: 'Ward 151, Koramangala',
      departmentId: deptRoads.id,
      userStatus: 'ACTIVE',
    },
    create: {
      name: 'Field Officer Ramesh',
      email: 'staff@nammacity.gov.in',
      phone: '+91 94480 12345',
      passwordHash,
      role: 'STAFF',
      assignedArea: 'Ward 151, Koramangala',
      departmentId: deptRoads.id,
      userStatus: 'ACTIVE',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@nammacity.gov.in' },
    update: {
      name: 'Municipal Admin Divya',
      phone: '+91 80222 11111',
      role: 'ADMIN',
      userStatus: 'ACTIVE',
    },
    create: {
      name: 'Municipal Admin Divya',
      email: 'admin@nammacity.gov.in',
      phone: '+91 80222 11111',
      passwordHash,
      role: 'ADMIN',
      userStatus: 'ACTIVE',
    },
  });

  // 3. Service Categories
  const catPayments = await prisma.serviceCategory.upsert({
    where: { slug: 'payments' },
    update: {},
    create: { name: 'Payments', slug: 'payments', sortOrder: 1 },
  });

  const catCivic = await prisma.serviceCategory.upsert({
    where: { slug: 'civic' },
    update: {},
    create: { name: 'Civic Issues', slug: 'civic', sortOrder: 2 },
  });

  const catCertificates = await prisma.serviceCategory.upsert({
    where: { slug: 'certificates' },
    update: {},
    create: { name: 'Certificates', slug: 'certificates', sortOrder: 3 },
  });

  const catTransport = await prisma.serviceCategory.upsert({
    where: { slug: 'transport' },
    update: {},
    create: { name: 'Transport', slug: 'transport', sortOrder: 4 },
  });

  const catLocal = await prisma.serviceCategory.upsert({
    where: { slug: 'local-info' },
    update: {},
    create: { name: 'Local Info', slug: 'local-info', sortOrder: 5 },
  });

  // 4. Civic Services (Screen 2 & Screen 3)
  const servicesData = [
    {
      categoryId: catPayments.id,
      name: 'Electricity Bill',
      slug: 'electricity-bill',
      description: 'Pay BESCOM bill online with instant receipt',
      icon: 'zap',
      iconBgColor: '#F59E0B',
      integrationMode: 'DEMO',
      badge: 'Fast Pay',
    },
    {
      categoryId: catPayments.id,
      name: 'Water Bill',
      slug: 'water-bill',
      description: 'Pay BWSSB water and sewerage charges',
      icon: 'droplets',
      iconBgColor: '#0EA5E9',
      integrationMode: 'DEMO',
    },
    {
      categoryId: catPayments.id,
      name: 'Property Tax',
      slug: 'property-tax',
      description: 'Pay your BBMP property tax SAS online',
      icon: 'home',
      iconBgColor: '#10B981',
      integrationMode: 'DEMO',
    },
    {
      categoryId: catCivic.id,
      name: 'Report an Issue',
      slug: 'report-issue',
      description: 'File a civic complaint with photo and GPS location',
      icon: 'megaphone',
      iconBgColor: '#EF4444',
      integrationMode: 'LIVE',
      badge: 'Citizen Action',
    },
    {
      categoryId: catCertificates.id,
      name: 'Birth/Death Certificate',
      slug: 'birth-death-certificate',
      description: 'Apply for digitally verified civic vital certificates',
      icon: 'file-text',
      iconBgColor: '#6B7280',
      integrationMode: 'DEMO',
    },
    {
      categoryId: catCertificates.id,
      name: 'Trade License',
      slug: 'trade-license',
      description: 'Apply or renew municipal commercial trade license',
      icon: 'briefcase',
      iconBgColor: '#8B5CF6',
      integrationMode: 'DEMO',
    },
    {
      categoryId: catTransport.id,
      name: 'Bus & Transport Info',
      slug: 'transport-info',
      description: 'BMTC routes, live timings, metro & bus schedules',
      icon: 'bus',
      iconBgColor: '#059669',
      integrationMode: 'DEMO',
    },
    {
      categoryId: catLocal.id,
      name: 'Nearby Municipal Offices',
      slug: 'nearby-offices',
      description: 'Find BBMP ward offices, health centers, police stations',
      icon: 'map-pin',
      iconBgColor: '#176B68',
      integrationMode: 'LIVE',
    },
  ];

  for (const s of servicesData) {
    await prisma.civicService.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  // 5. Utility Providers & Bills (Screen 7 & Screen 8)
  const bescomProvider = await prisma.utilityProvider.upsert({
    where: { providerCode: 'BESCOM' },
    update: {},
    create: {
      name: 'BESCOM',
      serviceType: 'ELECTRICITY',
      providerCode: 'BESCOM',
      integrationMode: 'DEMO',
      enabled: true,
    },
  });

  const bwssbProvider = await prisma.utilityProvider.upsert({
    where: { providerCode: 'BWSSB' },
    update: {},
    create: {
      name: 'BWSSB',
      serviceType: 'WATER',
      providerCode: 'BWSSB',
      integrationMode: 'DEMO',
      enabled: true,
    },
  });

  const bbmpTaxProvider = await prisma.utilityProvider.upsert({
    where: { providerCode: 'BBMP_TAX' },
    update: {},
    create: {
      name: 'BBMP Property Tax',
      serviceType: 'PROPERTY_TAX',
      providerCode: 'BBMP_TAX',
      integrationMode: 'DEMO',
      enabled: true,
    },
  });

  // Seed demo bill matching Screen 7 (Consumer 1234567890, ₹1,240, Due 20 Oct 2026)
  const bescomBill = await prisma.bill.upsert({
    where: {
      providerId_accountReference: {
        providerId: bescomProvider.id,
        accountReference: '1234567890',
      },
    },
    update: {},
    create: {
      providerId: bescomProvider.id,
      accountReference: '1234567890',
      customerName: 'Yashas K',
      amountMinor: 124000, // ₹ 1,240.00
      currency: 'INR',
      dueDate: new Date('2026-10-20T23:59:59Z'),
      billingPeriod: 'Sep 2026',
      billStatus: 'UNPAID',
    },
  });

  await prisma.bill.upsert({
    where: {
      providerId_accountReference: {
        providerId: bwssbProvider.id,
        accountReference: 'BWSSB-77291',
      },
    },
    update: {},
    create: {
      providerId: bwssbProvider.id,
      accountReference: 'BWSSB-77291',
      customerName: 'Yashas K',
      amountMinor: 68000, // ₹ 680.00
      currency: 'INR',
      dueDate: new Date('2026-10-25T23:59:59Z'),
      billingPeriod: 'Sep 2026',
      billStatus: 'UNPAID',
    },
  });

  // 6. Payment Transaction (Screen 8)
  await prisma.paymentTransaction.upsert({
    where: { transactionId: 'TXN789456123' },
    update: {},
    create: {
      transactionId: 'TXN789456123',
      userId: citizen.id,
      billId: bescomBill.id,
      providerName: 'BESCOM',
      serviceType: 'ELECTRICITY',
      accountReference: '1234567890',
      amountMinor: 124000,
      currency: 'INR',
      gateway: 'SANDBOX_UPI',
      paymentMethod: 'UPI (Google Pay)',
      status: 'SUCCESSFUL',
      receiptNumber: 'REC-2026-9841',
      isSimulated: true,
      createdAt: new Date('2026-09-12T10:42:00Z'),
    },
  });

  // 7. Civic Requests (Screens 9 & 10)
  // Request 1: #REQ-2048 (In Progress, Roads & Footpaths, Koramangala 5th Block)
  const req2048 = await prisma.civicRequest.upsert({
    where: { publicRequestId: '#REQ-2048' },
    update: {},
    create: {
      publicRequestId: '#REQ-2048',
      citizenId: citizen.id,
      departmentId: deptRoads.id,
      categoryId: 'ROADS',
      categoryName: 'Roads & Footpaths',
      title: 'Road maintenance',
      description: 'Large pothole near the 5th cross making it difficult for vehicles to pass.',
      address: 'Koramangala 5th Block, Bengaluru - 560034',
      latitude: 12.9352,
      longitude: 77.6245,
      landmark: 'Near 5th Cross Junction',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      assignedStaffId: staff.id,
      assignedAt: new Date('2026-10-05T14:10:00Z'),
      acceptedAt: new Date('2026-10-05T14:15:00Z'),
      createdAt: new Date('2026-10-05T10:24:00Z'),
    },
  });

  await prisma.requestAttachment.deleteMany({ where: { requestId: req2048.id } });
  await prisma.requestAttachment.create({
    data: {
      requestId: req2048.id,
      storageKey: 'requests/pothole-koramangala.jpg',
      fileUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
      contentType: 'image/jpeg',
      size: 421000,
      uploadedBy: citizen.id,
    },
  });

  await prisma.requestStatusHistory.deleteMany({ where: { requestId: req2048.id } });
  await prisma.requestStatusHistory.createMany({
    data: [
      {
        requestId: req2048.id,
        previousStatus: null,
        newStatus: 'SUBMITTED',
        changedById: citizen.id,
        note: 'Citizen submitted grievance via Namma City mobile portal.',
        createdAt: new Date('2026-10-05T10:24:00Z'),
      },
      {
        requestId: req2048.id,
        previousStatus: 'SUBMITTED',
        newStatus: 'ASSIGNED',
        changedById: admin.id,
        note: 'Assigned to Ward 151 Field Engineering Wing.',
        createdAt: new Date('2026-10-05T14:10:00Z'),
      },
      {
        requestId: req2048.id,
        previousStatus: 'ASSIGNED',
        newStatus: 'IN_PROGRESS',
        changedById: staff.id,
        note: 'Work in progress: Inspection completed. Hot-mix asphalt patch scheduled.',
        createdAt: new Date('2026-10-06T11:45:00Z'),
      },
    ],
  });

  // Request 2: #REQ-2031 (Street light not working, HSR Layout, Resolved)
  const req2031 = await prisma.civicRequest.upsert({
    where: { publicRequestId: '#REQ-2031' },
    update: {},
    create: {
      publicRequestId: '#REQ-2031',
      citizenId: citizen.id,
      departmentId: deptBescom.id,
      categoryId: 'STREET_LIGHTS',
      categoryName: 'Street Lights',
      title: 'Street light not working',
      description: 'Pole #14 streetlight lamp blinking and non-functional since 3 nights.',
      address: 'HSR Layout, Bengaluru',
      latitude: 12.9116,
      longitude: 77.6389,
      status: 'RESOLVED',
      priority: 'MEDIUM',
      assignedStaffId: staff2.id,
      assignedAt: new Date('2026-09-28T19:00:00Z'),
      acceptedAt: new Date('2026-09-28T19:15:00Z'),
      resolutionNote: 'Replaced faulty capacitor and LED driver on pole 14. Tested lighting lumen levels.',
      createdAt: new Date('2026-09-28T18:30:00Z'),
      resolvedAt: new Date('2026-09-29T16:00:00Z'),
    },
  });

  await prisma.requestAttachment.deleteMany({ where: { requestId: req2031.id } });
  await prisma.requestAttachment.create({
    data: {
      requestId: req2031.id,
      storageKey: 'requests/streetlight.jpg',
      fileUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
      contentType: 'image/jpeg',
      size: 290000,
      uploadedBy: citizen.id,
    },
  });

  // Request 3: #REQ-1987 (Garbage not collected, BTM Layout, In Progress)
  const req1987 = await prisma.civicRequest.upsert({
    where: { publicRequestId: '#REQ-1987' },
    update: {},
    create: {
      publicRequestId: '#REQ-1987',
      citizenId: citizen.id,
      departmentId: deptSwm.id,
      categoryId: 'GARBAGE',
      categoryName: 'Garbage & Cleanliness',
      title: 'Garbage not collected',
      description: 'Solid waste pile near park gate 2 not cleared for 48 hours.',
      address: 'BTM Layout, Bengaluru',
      latitude: 12.9166,
      longitude: 77.6101,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      createdAt: new Date('2026-09-20T09:15:00Z'),
    },
  });

  await prisma.requestAttachment.deleteMany({ where: { requestId: req1987.id } });
  await prisma.requestAttachment.create({
    data: {
      requestId: req1987.id,
      storageKey: 'requests/garbage.jpg',
      fileUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80',
      contentType: 'image/jpeg',
      size: 380000,
      uploadedBy: citizen.id,
    },
  });

  // Request 4: #REQ-1765 (Water leakage, Jayanagar, Resolved)
  const req1765 = await prisma.civicRequest.upsert({
    where: { publicRequestId: '#REQ-1765' },
    update: {},
    create: {
      publicRequestId: '#REQ-1765',
      citizenId: citizen.id,
      departmentId: deptBwssb.id,
      categoryId: 'WATER',
      categoryName: 'Water Supply',
      title: 'Water leakage',
      description: 'Underground feeder valve leakage leaking drinking water onto road.',
      address: 'Jayanagar, Bengaluru',
      latitude: 12.9308,
      longitude: 77.5838,
      status: 'RESOLVED',
      priority: 'URGENT',
      resolutionNote: 'Main feeder valve replaced and pressure test passed at 4.2 bar.',
      createdAt: new Date('2026-09-12T08:00:00Z'),
      resolvedAt: new Date('2026-09-13T14:30:00Z'),
    },
  });

  await prisma.requestAttachment.deleteMany({ where: { requestId: req1765.id } });
  await prisma.requestAttachment.create({
    data: {
      requestId: req1765.id,
      storageKey: 'requests/water-leak.jpg',
      fileUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
      contentType: 'image/jpeg',
      size: 310000,
      uploadedBy: citizen.id,
    },
  });

  // Request 5: #REQ-2104 (Newly Submitted, Unassigned - Ready for Admin Assignment demo)
  const req2104 = await prisma.civicRequest.upsert({
    where: { publicRequestId: '#REQ-2104' },
    update: {},
    create: {
      publicRequestId: '#REQ-2104',
      citizenId: citizen.id,
      departmentId: deptBwssb.id,
      categoryId: 'DRAINAGE',
      categoryName: 'Drainage & Sewerage',
      title: 'Stormwater drain overflowing',
      description: 'Heavy water logging and clogged culvert drain on 80ft Road.',
      address: 'Koramangala 4th Block, Bengaluru',
      latitude: 12.9341,
      longitude: 77.6259,
      status: 'SUBMITTED',
      priority: 'HIGH',
      assignedStaffId: null,
      createdAt: new Date('2026-10-08T09:30:00Z'),
    },
  });

  // Request 6: #REQ-2092 (Assigned to Officer Ramesh - Ready for Staff to Accept/Start Work)
  const req2092 = await prisma.civicRequest.upsert({
    where: { publicRequestId: '#REQ-2092' },
    update: {},
    create: {
      publicRequestId: '#REQ-2092',
      citizenId: citizen.id,
      departmentId: deptRoads.id,
      categoryId: 'ROADS',
      categoryName: 'Roads & Footpaths',
      title: 'Broken footpath paving slabs',
      description: 'Three damaged slabs creating pedestrian tripping risk outside bus shelter.',
      address: 'Koramangala 5th Block, Ganapathi Temple Rd',
      latitude: 12.9366,
      longitude: 77.6212,
      status: 'ASSIGNED',
      priority: 'MEDIUM',
      assignedStaffId: staff.id,
      assignedAt: new Date('2026-10-07T11:00:00Z'),
      createdAt: new Date('2026-10-07T08:15:00Z'),
    },
  });

  // 8. Civic Locations (Screen 11)
  const locationsData = [
    {
      name: 'BBMP Ward Office - Koramangala',
      category: 'MUNICIPAL',
      address: 'Koramangala 3rd Block, 80 Feet Road, Bengaluru - 560034',
      latitude: 12.9342,
      longitude: 77.6255,
      phone: '080-25530123',
      openingHours: 'Mon - Sat: 9:30 AM - 5:30 PM',
    },
    {
      name: 'Koramangala Police Station',
      category: 'POLICE',
      address: 'Near Water Tank, 80 Feet Rd, 6th Block, Bengaluru - 560095',
      latitude: 12.9381,
      longitude: 77.6224,
      phone: '080-22942548',
      openingHours: 'Open 24/7',
    },
    {
      name: 'Primary Health Center',
      category: 'HOSPITAL',
      address: 'Koramangala 4th Block, Near BDA Complex, Bengaluru - 560034',
      latitude: 12.9312,
      longitude: 77.6291,
      phone: '080-25534120',
      openingHours: 'Mon - Sun: 8:00 AM - 8:00 PM',
    },
    {
      name: 'Post Office',
      category: 'POST_OFFICE',
      address: 'Koramangala 5th Block, Ganapathi Temple Rd, Bengaluru - 560095',
      latitude: 12.9366,
      longitude: 77.6212,
      phone: '080-25531999',
      openingHours: 'Mon - Sat: 9:00 AM - 4:00 PM',
    },
    {
      name: 'BMTC Bus Depot 15',
      category: 'TRANSPORT',
      address: 'Koramangala 8th Block, Near Passport Seva Kendra, Bengaluru',
      latitude: 12.9412,
      longitude: 77.6189,
      phone: '080-22483777',
      openingHours: 'Open 24/7',
    },
  ];

  for (const loc of locationsData) {
    const existing = await prisma.civicLocation.findFirst({ where: { name: loc.name } });
    if (!existing) {
      await prisma.civicLocation.create({ data: loc });
    }
  }

  // 9. Notifications
  await prisma.notification.deleteMany({ where: { userId: citizen.id } });
  await prisma.notification.createMany({
    data: [
      {
        userId: citizen.id,
        title: 'Work in progress on #REQ-2048',
        message: 'Field team has initiated asphalt road patch repair at Koramangala 5th Block.',
        type: 'REQUEST_UPDATE',
        relatedEntityId: req2048.id,
        createdAt: new Date('2026-10-06T11:45:00Z'),
      },
      {
        userId: citizen.id,
        title: 'Payment Successful',
        message: 'Your BESCOM electricity payment of ₹1,240 was processed successfully.',
        type: 'PAYMENT',
        createdAt: new Date('2026-09-12T10:42:00Z'),
      },
      {
        userId: citizen.id,
        title: 'Civic Notice: Water Pipeline Maintenance',
        message: 'Scheduled maintenance in Koramangala Ward 151 on Oct 12th from 10 AM to 2 PM.',
        type: 'CIVIC_ALERT',
        createdAt: new Date('2026-10-07T08:00:00Z'),
      },
    ],
  });

  // 10. Saved Locations
  await prisma.savedLocation.deleteMany({ where: { userId: citizen.id } });
  await prisma.savedLocation.createMany({
    data: [
      {
        userId: citizen.id,
        label: 'Home',
        address: 'Koramangala 5th Block, Bengaluru - 560034',
        latitude: 12.9352,
        longitude: 77.6245,
      },
      {
        userId: citizen.id,
        label: 'Office',
        address: 'Embassy Tech Village, Outer Ring Road, Bengaluru - 560103',
        latitude: 12.9279,
        longitude: 77.6974,
      },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
