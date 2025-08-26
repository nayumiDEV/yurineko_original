import { Controller, HttpStatus } from '@nestjs/common';
import {
  Ctx,
  GrpcMethod,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PushService } from 'src/push/push.service';
import { UserPreference } from 'src/user-preference/user-preference.pb';
import { UserPreferenceService } from 'src/user-preference/user-preference.service';
import { CreateNotificationDto, NotificationType } from './dto';
import {
  GetNotificationRequest,
  GetNotificationResponse,
  NotificationServiceController,
  NOTIFICATION_SERVICE_NAME,
  ReadAllNotificationRequest,
  ReadAllNotificationResponse,
  ReadNotificationRequest,
  ReadNotificationResponse,
  ViewNotificationRequest,
  ViewNotificationResponse,
} from './notification.pb';
import { NotificationService } from './notification.service';

const notificationDecideToSendLogic = {
  [NotificationType.GENERAL_MESSAGE]: (userPreference: UserPreference) =>
    !userPreference || userPreference.notification.generalMessage,
  [NotificationType.COMMENT_REPLY]: (userPreference: UserPreference) =>
    !userPreference || userPreference.notification.commentReply,
  [NotificationType.COMMENT_REACTION]: (userPreference: UserPreference) =>
    !userPreference || userPreference.notification.commentReaction,
  [NotificationType.COMMENT_MENTION]: (userPreference: UserPreference) =>
    !userPreference || userPreference.notification.commentMention,
  [NotificationType.MANGA_FOLLOWING_NEW_CHAPTER]: (
    userPreference: UserPreference,
  ) => !userPreference || userPreference.notification.mangaFollowingNewChapter,
  [NotificationType.TEAM_FOLLOWING_MANGA_PUBLISH]: (
    userPreference: UserPreference,
  ) => !userPreference || userPreference.notification.teamFollowingNewManga,
  [NotificationType.TEAM_MANGA_NEW_COMMENT]: (userPreference: UserPreference) =>
    !userPreference || userPreference.notification.teamMangaNewComment,
};

@Controller()
export class NotificationController implements NotificationServiceController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly userPreferenceService: UserPreferenceService,
    private readonly pushService: PushService,
  ) {}

  @MessagePattern({ cmd: 'create-notification' })
  async createNotification(
    @Payload() createNotificationDto: CreateNotificationDto,
    @Ctx() context: RmqContext,
  ) {
    const userPreferences = await this.userPreferenceService.getPreferences(
      createNotificationDto.receiptentId,
    );

    createNotificationDto.receiptentId = this.decideToSendNotification(
      createNotificationDto.mType,
      userPreferences,
      createNotificationDto.receiptentId,
    );

    if (createNotificationDto.receiptentId.length === 0) {
      return;
    }

    switch (createNotificationDto.mType) {
      case NotificationType.COMMENT_REPLY:
      case NotificationType.COMMENT_REACTION:
      case NotificationType.TEAM_MANGA_NEW_COMMENT:
        await this.notificationService.createNotificationStacking(
          createNotificationDto,
        );
        break;
      case NotificationType.COMMENT_MENTION:
      case NotificationType.GENERAL_MESSAGE:
      case NotificationType.MANGA_FOLLOWING_NEW_CHAPTER:
      case NotificationType.TEAM_FOLLOWING_MANGA_PUBLISH:
        await this.notificationService.createNotification(
          createNotificationDto,
        );
        break;
    }

    Promise.all(createNotificationDto.receiptentId.map(receiptentId => this.pushService.sendPushNotification({
        mUserId: receiptentId,
        data: {
          title: createNotificationDto.mTitle,
          body: createNotificationDto.mBody,
          url: createNotificationDto.mUrl,
          thumbnail: createNotificationDto.mImage,
        },
      })));
  }

  @GrpcMethod(NOTIFICATION_SERVICE_NAME, 'GetNotification')
  async getNotification(
    request: GetNotificationRequest,
  ): Promise<GetNotificationResponse> {
    const [notification, countMissed] =
      await this.notificationService.getNotification(
        request.mUserId,
        request.cursor,
      );

    if (!countMissed) {
      await this.notificationService.initNotificationCounter(request.mUserId);
    }

    return {
      status: HttpStatus.OK,
      error: [],
      data: {
        countMissed: countMissed?.mCounter ?? 0,
        notification: notification.map((notification) => ({
          mId: notification.mId,
          mTitle: notification.mTitle,
          mBody: notification.mBody,
          mIcon: notification.mIcon,
          mImage: notification.mImage,
          mUrl: notification.mUrl,
          mCreatedAt: notification.mCreatedAt.toISOString(),
          mIsRead: notification.mIsRead,
        })),
      },
    };
  }

  @GrpcMethod(NOTIFICATION_SERVICE_NAME, 'ReadNotification')
  async readNotification(
    request: ReadNotificationRequest,
  ): Promise<ReadNotificationResponse> {
    await this.notificationService.readNotification(
      request.mUserId,
      request.mNotificationId,
    );
    return {
      status: HttpStatus.OK,
      error: [],
    };
  }

  @GrpcMethod(NOTIFICATION_SERVICE_NAME, 'ReadAllNotification')
  async readAllNotification(
    request: ReadAllNotificationRequest,
  ): Promise<ReadAllNotificationResponse> {
    await this.notificationService.readAllNotifications(request.mUserId);
    return {
      status: HttpStatus.OK,
      error: [],
    };
  }

  @GrpcMethod(NOTIFICATION_SERVICE_NAME, 'ViewAllNotification')
  async viewAllNotification(
    request: ViewNotificationRequest,
  ): Promise<ViewNotificationResponse> {
    await this.notificationService.viewAllNotification(request.mUserId);
    return {
      status: HttpStatus.OK,
      error: [],
    };
  }

  private decideToSendNotification(
    notificationType: NotificationType,
    userPreferences: { [key: number]: UserPreference },
    receiptentIds: number[],
  ): number[] {
    if (!userPreferences) return receiptentIds;

    const results: number[] = [];
    for (const receiptentId of receiptentIds) {
      if (
        notificationDecideToSendLogic[notificationType](
          userPreferences[receiptentId],
        )
      ) {
        results.push(receiptentId);
      }
    }
    return results;
  }
}
