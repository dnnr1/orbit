import { z } from 'zod';
import { ROOM_STATUS } from '../constants';

export interface RoomResource {
  id: string;
  name: string;
  quantity: number;
}

export interface Room {
  id: string;
  buildingId: string;
  organizationId: string;
  name: string;
  code: string;
  capacity: number;
  floor: string | null;
  resources: RoomResource[];
  status: (typeof ROOM_STATUS)[keyof typeof ROOM_STATUS];
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const RoomResourceSchema = z.object({
  name: z.string().min(1).max(100),
  quantity: z.number().int().min(0).default(1),
});

export const CreateRoomSchema = z.object({
  name: z.string().min(2).max(200),
  code: z
    .string()
    .min(2)
    .max(20)
    .regex(/^[A-Z0-9-]+$/, 'Code must be uppercase alphanumeric with hyphens'),
  capacity: z.number().int().min(1).max(10000),
  floor: z.string().max(50).nullable().optional(),
  resources: z.array(RoomResourceSchema).default([]),
  description: z.string().max(1000).nullable().optional(),
});

export const UpdateRoomSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  code: z
    .string()
    .min(2)
    .max(20)
    .regex(/^[A-Z0-9-]+$/, 'Code must be uppercase alphanumeric with hyphens')
    .optional(),
  capacity: z.number().int().min(1).max(10000).optional(),
  floor: z.string().max(50).nullable().optional(),
  resources: z.array(RoomResourceSchema).optional(),
  description: z.string().max(1000).nullable().optional(),
  status: z.enum([ROOM_STATUS.ACTIVE, ROOM_STATUS.INACTIVE, ROOM_STATUS.MAINTENANCE]).optional(),
});

export type CreateRoom = z.infer<typeof CreateRoomSchema>;
export type UpdateRoom = z.infer<typeof UpdateRoomSchema>;