import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotificationServiceClient, NOTIFICATION_SERVICE_NAME } from './notification.pb';

@Injectable()
export class NotificationService implements OnModuleInit {
  private svc: NotificationServiceClient;

  @Inject(NOTIFICATION_SERVICE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit() {
    this.svc = this.client.getService<NotificationServiceClient>(NOTIFICATION_SERVICE_NAME);
  }

  public async getNotification(userId: number, cursor: string) {
    const response = await firstValueFrom(this.svc.getNotification({
      mUserId: userId,
      cursor
    }))

    return response.data;
  }

  public async readNotification(userId: number, notificationId: string) {
    return firstValueFrom(this.svc.readNotification({
      mUserId: userId,
      mNotificationId: notificationId
    }))
  }

  public async readAllNotification(userId: number) {
    return firstValueFrom(this.svc.readAllNotification({
      mUserId: userId
    }))
  }

  public async viewAllNotification(userId: number) {
    return firstValueFrom(this.svc.viewAllNotification({
      mUserId: userId
    }))
  }
}
