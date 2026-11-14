import { pgTable, uuid, text, timestamp, integer, jsonb, boolean } from 'drizzle-orm/pg-core';
import { buildings } from './buildings';
import { organizations } from './organizations';
import { ROOM_STATUS } from '@orbit/shared';

export const rooms = pgTable('rooms', {
  id: uuid('id').defaultRandom().primaryKey(),
  buildingId: uuid('building_id')
    .notNull()
    .references(() => buildings.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  code: text('code').notNull(),
  capacity: integer('capacity').notNull(),
  floor: text('floor'),
  resources: jsonb('resources').notNull().default([]),
  status: text('status')
    .notNull()
    .default(ROOM_STATUS.ACTIVE)
    .$type<typeof ROOM_STATUS[keyof typeof ROOM_STATUS]>(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;