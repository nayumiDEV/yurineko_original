import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto';
import { nanoid } from 'nanoid';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async createNotificationStacking(dto: CreateNotificationDto) {
    return this.prisma.$transaction(async (tx) => {
      // Stacking notification
      const eventCounterId = this.makeEventCounterId(dto.mType, dto.mObjectId);
      // Create/increase the event counter
      const existsEvent = await tx.eventCounter.upsert({
        where: {
          mId: eventCounterId,
        },
        update: {
          mCounter: {
            increment: 1,
          },
        },
        create: {
          mId: eventCounterId,
        },
        select: {
          mCounter: true,
        },
      });

      dto.mTitle = dto.mTitle.replace(
        '$',
        existsEvent.mCounter > 0
          ? ` và <strong>${existsEvent.mCounter} người khác</strong>`
          : '',
      );

      const payload = dto.receiptentId.map((userId) => ({
        mUserId: userId,
        mId: this.generateNotificationId(),
        mTitle: dto.mTitle,
        mBody: dto.mBody,
        mType: dto.mType,
        mUrl: dto.mUrl,
        mIcon: dto.mIcon,
        mImage: dto.mImage,
        mObjectId: dto.mObjectId,
      }));

      if (existsEvent.mCounter) {
        const last24Hours = new Date(
          new Date().getTime() - 1000 * 60 * 60 * 24,
        );

        const userViewedNotification = await tx.notification.findMany({
          where: {
            mType: dto.mType,
            mObjectId: dto.mObjectId,
            mCreatedAt: {
              gte: last24Hours,
            },
            mIsView: true,
          },
          select: {
            mUserId: true,
          },
        });

        if (userViewedNotification.length) {
          await tx.$executeRaw`
          INSERT INTO user_notification_counter
          VALUES ${Prisma.join(
            userViewedNotification.map((item) => Prisma.sql`(${item.mUserId})`),
          )} 
          ON CONFLICT (m_user_id) DO UPDATE SET m_counter = user_notification_counter.m_counter + 1;`;
        }

        await tx.notification.updateMany({
          where: {
            mType: dto.mType,
            mObjectId: dto.mObjectId,
            mCreatedAt: {
              gte: last24Hours,
            },
          },
          data: {
            mId: this.generateNotificationId(),
            mTitle: dto.mTitle,
            mIsRead: false,
            mIsView: false,
          },
        });
        return;
      }

      await tx.notification.createMany({
        data: payload,
      });

      if (dto.receiptentId.length) {
        await tx.$executeRaw`
        INSERT INTO 
        user_notification_counter
        VALUES 
        ${Prisma.join(
          dto.receiptentId.map((userId) => Prisma.sql`(${userId})`),
        )} 
        ON CONFLICT (m_user_id) 
        DO UPDATE SET m_counter = user_notification_counter.m_counter + 1;`;
      }
    });
  }

  async createNotification(dto: CreateNotificationDto) {
    const payload = dto.receiptentId.map((userId) => ({
      mUserId: userId,
      mId: this.generateNotificationId(),
      mTitle: dto.mTitle,
      mBody: dto.mBody,
      mType: dto.mType,
      mUrl: dto.mUrl,
      mIcon: dto.mIcon,
      mImage: dto.mImage,
      mObjectId: dto.mObjectId,
    }));

    return this.prisma.$transaction([
      this.prisma.notification.createMany({
        data: payload,
      }),
      this.prisma.$executeRaw`
        INSERT INTO 
        user_notification_counter
        VALUES 
        ${Prisma.join(
          dto.receiptentId.map((userId) => Prisma.sql`(${userId})`),
        )} 
        ON CONFLICT (m_user_id) 
        DO UPDATE SET m_counter = user_notification_counter.m_counter + 1;`,
    ]);
  }

  async getNotification(userId: number, cursor?: string) {
    return this.prisma.$transaction([
      this.prisma.notification.findMany({
        where: {
          mUserId: userId,
        },
        orderBy: {
          mId: 'desc',
        },
        take: 10,
        ...(cursor && {
          cursor: {
            mUserId_mId: {
              mUserId: userId,
              mId: cursor,
            },
          },
        }),
        skip: cursor ? 1 : 0,
      }),
      this.prisma.userNotificationCounter.findUnique({
        where: {
          mUserId: userId,
        },
      }),
    ]);
  }

  async viewAllNotification(userId: number) {
    return this.prisma.$transaction([
      this.prisma.userNotificationCounter.update({
        where: {
          mUserId: userId,
        },
        data: {
          mCounter: 0,
        },
      }),
      this.prisma.notification.updateMany({
        where: {
          mUserId: userId,
          mIsView: false,
        },
        data: {
          mIsView: true,
        },
      }),
    ]);
  }

  async readNotification(userId: number, notificationId: string) {
    return this.prisma.notification.update({
      where: {
        mUserId_mId: {
          mUserId: userId,
          mId: notificationId,
        },
      },
      data: {
        mIsRead: true,
      },
    });
  }

  async readAllNotifications(userId: number) {
    return this.prisma.notification.updateMany({
      where: {
        mUserId: userId,
        mIsRead: false,
      },
      data: {
        mIsRead: true,
      },
    });
  }

  async initNotificationCounter(userId: number) {
    return this.prisma.userNotificationCounter.create({
      data: {
        mUserId: userId,
        mCounter: 0,
      },
    });
  }

  generateNotificationId() {
    return `${Date.now()}_${nanoid()}`;
  }

  makeEventCounterId(type: string, objectId: number) {
    return `${type}:${objectId}`;
  }
}
