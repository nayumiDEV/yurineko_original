import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { PrismaService } from 'src/prisma/prisma.service';
import { removeTimeZone } from 'src/utilities';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) { }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: {
        mId: id
      },
    });
  }

  async findByIdsForMentions(ids: number[]) {

    return this.prisma.user.findMany({
      where: {
        mId: {
          in: ids,
        }
      },
      select: {
        mId: true,
        mName: true,
        mUsername: true,
      },
    });
  }

  async findByName(name: string) {
    return this.prisma.user.findMany({
      where: {
        mName: {
          search: `*${name}*`,
        }
      },
      select: {
        mId: true,
        mName: true,
        mAvatar: true,
      },
      take: 5,
    })
  }

  async findByIds(ids: number[]) {
    return this.prisma.user.findMany({
      where: {
        mId: {
          in: ids,
        }
      },
      select: {
        mId: true,
        mName: true,
        mUsername: true,
        mAvatar: true,
      }
    });
  }

  _compute_UserDob(user: any) {
    user.mDob = user.mDob.toISOString();
  }

  _compute_UserBannedTime(user: any) {
    user.isBanned = removeTimeZone(user.mBannedTime) > new Date();
    delete user.mBannedTime;
  }

  _compute_UserPremiumTime(user: any) {
    user.isPremium = removeTimeZone(user.mPremiumTime) > new Date();
    delete user.mPremiumTime;
  }

  _compute_UserAvatar(user: any) {
    user.mAvatar = `${this.configService.getOrThrow('IMAGE_STORAGE_HOST')}/${user.mAvatar}`;
  }

  _compute_UserCover(user: any) {
    user.mCover = `${this.configService.getOrThrow('IMAGE_STORAGE_HOST')}/${user.mCover}`;
  }

  _compute_User(user: any) {
    this._compute_UserBannedTime(user);
    this._compute_UserPremiumTime(user);
  }

  _compute_MinUser(user: any) {
    this._compute_UserAvatar(user);
  }

  _batchCompute_MinUser(users: any[]) {
    users.forEach(user => this._compute_MinUser(user));
  }
}
