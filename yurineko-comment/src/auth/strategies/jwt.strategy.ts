import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '../guards/role.guard';

const RoleIntToEnum = [
  undefined,
  UserRole.USER,
  UserRole.UPLOADER,
  UserRole.ADMIN,
];

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      signOptions: { expiresIn: configService.get('JWT_EXPIRE') },
    });
  }

  async validate(payload: Record<string, any>) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        teamId: true,
        role: true,
        premiumTime: true,
        bannedTime: true,
        avatar: true,
        name: true,
      },
    });
    if (!user || user.bannedTime > new Date()) {
      throw new UnauthorizedException('Bạn đã bị ban!');
    }
    return { ...user, role: RoleIntToEnum[user.role] };
  }
}
