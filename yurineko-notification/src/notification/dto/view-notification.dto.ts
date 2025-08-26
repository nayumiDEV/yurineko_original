import { ViewNotificationRequest } from '../notification.pb';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ViewNotificationDto implements ViewNotificationRequest {
  @IsNotEmpty()
  @IsNumber()
  mUserId: number;
}
