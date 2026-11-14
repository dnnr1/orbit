import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard as PassportLocalGuard } from '@nestjs/passport';

@Injectable()
export class LocalGuard extends PassportLocalGuard {}