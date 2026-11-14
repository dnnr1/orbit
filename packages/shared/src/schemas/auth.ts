import { z } from 'zod';
import { TOKEN_TYPES } from '../constants';

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8).max(128),
});

export const VerifyEmailSchema = z.object({
  token: z.string(),
});

export type AuthTokens = z.infer<typeof AuthTokensSchema>;
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;
export type ResetPassword = z.infer<typeof ResetPasswordSchema>;
export type VerifyEmail = z.infer<typeof VerifyEmailSchema>;

export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: '15m',
  REFRESH_TOKEN: '7d',
  PASSWORD_RESET: '1h',
  EMAIL_VERIFY: '24h',
} as const;

export const TOKEN_TYPE_VALUES = {
  [TOKEN_TYPES.ACCESS]: 'access',
  [TOKEN_TYPES.REFRESH]: 'refresh',
  [TOKEN_TYPES.PASSWORD_RESET]: 'password_reset',
  [TOKEN_TYPES.EMAIL_VERIFY]: 'email_verify',
} as const;