import { z } from 'zod';
import { ORG_STATUS } from '../constants';
export const OrgSettingsSchema = z.object({
    timezone: z.string().default('UTC'),
    allowOverlappingBookings: z.boolean().default(false),
    requireApproval: z.boolean().default(true),
    maxAdvanceBookingDays: z.number().int().min(1).max(365).default(30),
    minBookingNoticeHours: z.number().int().min(0).max(168).default(1),
});
export const CreateOrganizationSchema = z.object({
    name: z.string().min(2).max(200),
    slug: z
        .string()
        .min(2)
        .max(50)
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
});
export const UpdateOrganizationSchema = z.object({
    name: z.string().min(2).max(200).optional(),
    slug: z
        .string()
        .min(2)
        .max(50)
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens')
        .optional(),
    settings: OrgSettingsSchema.partial().optional(),
    status: z.enum([ORG_STATUS.ACTIVE, ORG_STATUS.SUSPENDED]).optional(),
});
