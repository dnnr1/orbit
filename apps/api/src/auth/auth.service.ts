import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { db } from '@orbit/db';
import { users, tokens, organizations } from '@orbit/db';
import { eq, and, gt } from 'drizzle-orm';
import { 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  generateSlug,
  generateId 
} from '@orbit/shared';
import {
  RegisterUser,
  LoginUser,
  ForgotPassword,
  ResetPassword,
  AuthTokens,
} from '@orbit/shared';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  organizationId: string;
  type: 'access' | 'refresh';
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(data: RegisterUser): Promise<AuthTokens> {
    const existing = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const slug = generateSlug(data.email.split('@')[0]);
    const orgName = data.email.split('@')[1].split('.')[0];
    
    const userId = generateId();

    const passwordHash = await hashPassword(data.password);

    await db.transaction(async tx => {
      const [org] = await tx.insert(organizations).values({
        name: orgName.charAt(0).toUpperCase() + orgName.slice(1),
        slug: slug + '-' + Date.now().toString(36),
      }).returning({ id: organizations.id });

      await tx.insert(users).values({
        id: userId,
        organizationId: org.id,
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'org_admin',
        status: 'active',
        emailVerified: false,
      });
    });

    return this.generateTokens(userId, org.id);
  }

  async login(data: LoginUser): Promise<AuthTokens> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await verifyPassword(data.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    return this.generateTokens(user.id, user.organizationId);
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const tokenRecord = await db.query.tokens.findFirst({
      where: and(
        eq(tokens.token, refreshToken),
        eq(tokens.revoked, false),
        gt(tokens.expiresAt, new Date())
      ),
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, tokenRecord.userId),
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('User not found or inactive');
    }

    await db
      .update(tokens)
      .set({ revoked: true })
      .where(eq(tokens.id, tokenRecord.id));

    return this.generateTokens(user.id, user.organizationId);
  }

  async forgotPassword(data: ForgotPassword): Promise<{ message: string }> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await db.insert(tokens).values({
      userId: user.id,
      type: 'password_reset',
      token,
      expiresAt,
    });

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(data: ResetPassword): Promise<{ message: string }> {
    const tokenRecord = await db.query.tokens.findFirst({
      where: and(
        eq(tokens.token, data.token),
        eq(tokens.type, 'password_reset'),
        eq(tokens.revoked, false),
        gt(tokens.expiresAt, new Date())
      ),
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const passwordHash = await hashPassword(data.password);

    await db.transaction(async tx => {
      await tx
        .update(users)
        .set({ passwordHash, updatedAt: new Date() })
        .where(eq(users.id, tokenRecord.userId));
      await tx
        .update(tokens)
        .set({ revoked: true })
        .where(eq(tokens.id, tokenRecord.id));
    });

    return { message: 'Password reset successfully' };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const tokenRecord = await db.query.tokens.findFirst({
      where: and(
        eq(tokens.token, token),
        eq(tokens.type, 'email_verify'),
        eq(tokens.revoked, false),
        gt(tokens.expiresAt, new Date())
      ),
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    await db
      .update(users)
      .set({ emailVerified: true, updatedAt: new Date() })
      .where(eq(users.id, tokenRecord.userId));
    await db
      .update(tokens)
      .set({ revoked: true })
      .where(eq(tokens.id, tokenRecord.id));

    return { message: 'Email verified successfully' };
  }

  async generateTokens(userId: string, organizationId: string): Promise<AuthTokens> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      type: 'access',
    };

    const refreshPayload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      type: 'refresh',
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
    });

    const refreshExpiresAt = new Date();
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);

    await db.insert(tokens).values({
      userId: user.id,
      type: 'refresh',
      token: refreshToken,
      expiresAt: refreshExpiresAt,
    });

    return { accessToken, refreshToken };
  }

  async getMe(userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { passwordHash, ...userPublic } = user;
    return userPublic;
  }
}