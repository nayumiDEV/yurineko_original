import { GetNotificationRequest } from '../notification.pb';

export class GetNotificationDto implements GetNotificationRequest {
  mUserId: number;
  cursor: string;
}
