import { CACHE_MANAGER, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as webpush from 'web-push';
import { UserPush, UserPushDocument } from './schemas';
import { Model } from 'mongoose';
import { PushPayloadData } from './dto';
import { Cache } from 'cache-manager';

@Injectable()
export class PushService implements OnModuleInit {

  constructor(
    @InjectModel(UserPush.name) private readonly userPushModel: Model<UserPushDocument>,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }

  onModuleInit() {
    webpush.setVapidDetails(
      `mailto:${this.configService.getOrThrow('VAPID_EMAIL')}`,
      this.configService.getOrThrow('VAPID_PUBLIC_KEY'),
      this.configService.getOrThrow('VAPID_PRIVATE_KEY')
    );
  }

  private generateCacheKey(mUserId: number) {
    return `push-endpoint:${mUserId}`;
  }

  async addPushEndpoint(mUserId: number, mData: any) {
    await this.cacheManager.del(this.generateCacheKey(mUserId));

    return this.userPushModel.updateOne({
      mUserId,
    }, {
      $push: {
        mData
      }
    }, {
      upsert: true,
    });
  }

  async getPushEndpoint(mUserId: number) {
    const cacheKey = this.generateCacheKey(mUserId);
    const cacheData = await this.cacheManager.get<UserPushDocument>(cacheKey);

    if (cacheData) {
      return cacheData;
    }

    const data = await this.userPushModel.findOne({
      mUserId,
    }, {
      mData: 1,
      _id: 0
    });

    if (data) {
      await this.cacheManager.set(cacheKey, data);
    }

    return data;
  }

  async editPushEndpoint(mUserId: number, mData: any[]) {
    await this.cacheManager.set(this.generateCacheKey(mUserId), { mData });
    return this.userPushModel.updateOne({
      mUserId,
    }, {
      mData
    });
  }

  async push(subscription: any, payload: PushPayloadData) {
    return webpush.sendNotification(subscription, JSON.stringify(payload));
  }
}
