import { db } from '../src';
import { organizations, users, buildings, rooms } from '../src/schema';
import { hashPassword } from '@orbit/shared';

async function seed() {
  const orgId = '00000000-0000-0000-0000-000000000001';
  const adminId = '00000000-0000-0000-0000-000000000002';
  const buildingId = '00000000-0000-0000-0000-000000000003';
  const roomId1 = '00000000-0000-0000-0000-000000000004';
  const roomId2 = '00000000-0000-0000-0000-000000000005';

  await db.delete(rooms);
  await db.delete(buildings);
  await db.delete(users);
  await db.delete(organizations);

  await db.insert(organizations).values({
    id: orgId,
    name: 'Orbit Demo University',
    slug: 'orbit-demo',
    status: 'active',
    settings: {
      timezone: 'America/New_York',
      allowOverlappingBookings: false,
      requireApproval: true,
      maxAdvanceBookingDays: 30,
      minBookingNoticeHours: 1,
    },
  });

  const passwordHash = await hashPassword('Admin123!');
  await db.insert(users).values({
    id: adminId,
    organizationId: orgId,
    email: 'admin@orbitdemo.edu',
    passwordHash,
    firstName: 'Admin',
    lastName: 'User',
    role: 'org_admin',
    status: 'active',
    emailVerified: true,
  });

  await db.insert(buildings).values({
    id: buildingId,
    organizationId: orgId,
    name: 'Main Campus Building',
    address: '123 University Ave',
  });

  await db.insert(rooms).values([
    {
      id: roomId1,
      buildingId,
      organizationId: orgId,
      name: 'Conference Room A',
      code: 'CR-A',
      capacity: 12,
      floor: '3',
      resources: [
        { name: 'Projector', quantity: 1 },
        { name: 'Whiteboard', quantity: 1 },
        { name: 'Video Conference', quantity: 1 },
      ],
      status: 'active',
    },
    {
      id: roomId2,
      buildingId,
      organizationId: orgId,
      name: 'Study Room 101',
      code: 'SR-101',
      capacity: 4,
      floor: '1',
      resources: [
        { name: 'Whiteboard', quantity: 1 },
      ],
      status: 'active',
    },
  ]);

  console.log('Seed complete');
}

seed().catch(console.error);