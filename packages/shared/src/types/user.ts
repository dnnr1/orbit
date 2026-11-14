import { z } from 'zod';
import { ROLES, USER_STATUS } from '../constants';

export interface User {
  id: string;
  organizationId: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: (typeof ROLES)[keyof typeof ROLES];
  status: (typeof USER_STATUS)[keyof typeof USER_STATUS];
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublic {
  id: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: (typeof ROLES)[keyof typeof ROLES];
  status: (typeof USER_STATUS)[keyof typeof USER_STATUS];
  emailVerified: boolean;
  createdAt: Date;
}

export const RegisterUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});

export const LoginUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1),
});

export const UpdateUserSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  role: z.enum([ROLES.ORG_ADMIN, ROLES.MANAGER, ROLES.BOOKER]).optional(),
  status: z
    .enum([USER_STATUS.ACTIVE, USER_STATUS.INACTIVE, USER_STATUS.SUSPENDED])
    .optional(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

export type RegisterUser = z.infer<typeof RegisterUserSchema>;
export type LoginUser = z.infer<typeof LoginUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type ChangePassword = z.infer<typeof ChangePasswordSchema>;