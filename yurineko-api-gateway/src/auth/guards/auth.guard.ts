import { Injectable, CanActivate, ExecutionContext, HttpStatus, UnauthorizedException, Inject } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { ValidateResponse } from '../auth.pb';
import { AuthService } from '../auth.service';
import { AuthUser } from '../types';
import { UserRole } from './role.guard';


const RoleIntToEnum = [
  undefined, UserRole.USER, UserRole.UPLOADER, UserRole.ADMIN
]

@Injectable()
export class AuthGuard implements CanActivate {
  private authService: AuthService;
  private userService: UserService;

  constructor({ authService, userService }: { authService: AuthService, userService: UserService }) {
    this.authService = authService;
    this.userService = userService;
  }

  public async canActivate(ctx: ExecutionContext): Promise<boolean> | never {
    const req: Request = ctx.switchToHttp().getRequest();
    const authorization: string = req.headers['authorization'];

    const token: string = authorization?.split(' ')[1];

    if (!token) {
      return true;
    }

    const { status, data }: ValidateResponse = await this.authService.validate(token);

    if (status !== HttpStatus.OK) {
      throw new UnauthorizedException();
    }

    if (!data) {
      return true;
    }

    const user = await this.userService.findUserByIdForAuth(data.mUserId);

    if (!user) {
      return true;
    }

    req.user = { ...user, mRole: RoleIntToEnum[user.mRole] } as AuthUser;


    return true;
  }
}