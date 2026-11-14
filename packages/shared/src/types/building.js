import { z } from 'zod';
export const CreateBuildingSchema = z.object({
    name: z.string().min(2).max(200),
    address: z.string().max(500).nullable().optional(),
});
export const UpdateBuildingSchema = z.object({
    name: z.string().min(2).max(200).optional(),
    address: z.string().max(500).nullable().optional(),
});
