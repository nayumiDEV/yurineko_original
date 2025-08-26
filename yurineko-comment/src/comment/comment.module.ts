import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MangaModule } from 'src/manga/manga.module';
import { UserModule } from 'src/user/user.module';
import { NotificationBll } from './notification.bll';
import { NotificationModule } from '@yurineko-service/notification-client';

@Module({
  imports: [
    MangaModule,
    UserModule,
    NotificationModule.register({
      urls: [process.env.RABBITMQ_URL],
      queue: process.env.NOTIFICATION_RABBITMQ_QUEUE_NAME,
    }),
  ],
  controllers: [CommentController],
  providers: [CommentService, NotificationBll],
})
export class CommentModule {}
