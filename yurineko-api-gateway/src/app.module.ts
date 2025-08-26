import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { NotificationModule } from './notification/notification.module';
import { UserPreferenceModule } from './user-preference/user-preference.module';
import { StorageModule } from './storage/storage.module';
import { PushModule } from './push/push.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    CommentModule,
    UserPreferenceModule,
    NotificationModule, StorageModule, PushModule
  ]
})
export class AppModule { }
