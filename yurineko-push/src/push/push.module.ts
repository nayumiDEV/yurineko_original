import { CacheModule, Module } from '@nestjs/common';
import { PushService } from './push.service';
import { PushController } from './push.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPush, UserPushSchema } from './schemas';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ttl: parseInt(configService.getOrThrow('CACHE_TTL')),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{
      name: UserPush.name,
      schema: UserPushSchema
    }])
  ],
  controllers: [PushController],
  providers: [PushService]
})
export class PushModule { }
