import { CacheModule, Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register(),
    NotificationModule,
    PrismaModule,
  ],
})
export class AppModule {}
