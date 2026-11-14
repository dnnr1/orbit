import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard as PassportJwtGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends PassportJwtGuard {}