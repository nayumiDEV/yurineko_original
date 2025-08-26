import { ReadNotificationRequest } from '../notification.pb';

export class ReadNotificationDto implements ReadNotificationRequest {
  mUserId: number;
  mNotificationId: string;
}
