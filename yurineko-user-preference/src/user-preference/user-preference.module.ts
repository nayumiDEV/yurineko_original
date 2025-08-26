import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPreference, UserPreferenceSchema } from './schemas';
import { UserPreferenceController } from './user-preference.controller';
import { UserPreferenceService } from './user-preference.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ttl: parseInt(configService.getOrThrow('CACHE_TTL')),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: UserPreference.name, schema: UserPreferenceSchema }]),
  ],
  controllers: [UserPreferenceController],
  providers: [UserPreferenceService]
})
export class UserPreferenceModule { }
