import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { UserPreferenceModule } from 'src/user-preference/user-preference.module';
import { PushModule } from 'src/push/push.module';

@Module({
  imports: [UserPreferenceModule, PushModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
