import { z } from 'zod';

export interface Building {
  id: string;
  organizationId: string;
  name: string;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const CreateBuildingSchema = z.object({
  name: z.string().min(2).max(200),
  address: z.string().max(500).nullable().optional(),
});

export const UpdateBuildingSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  address: z.string().max(500).nullable().optional(),
});

export type CreateBuilding = z.infer<typeof CreateBuildingSchema>;
export type UpdateBuilding = z.infer<typeof UpdateBuildingSchema>;