import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../types/jwt-payload.type';

export enum UserRole {
  USER = 'USER',
  UPLOADER = 'UPLOADER',
  ADMIN = 'ADMIN',
}

const matchRoles = (roles: UserRole[], userRoles: string) => {
  return roles.some((role) => role === userRoles);
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const req = context.switchToHttp().getRequest() as any;
    const user = req.user as JwtPayload;
    return matchRoles(roles, user.role);
  }
}
