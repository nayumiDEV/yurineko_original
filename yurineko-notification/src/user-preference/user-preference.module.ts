import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  USER_PREFERENCE_PACKAGE_NAME,
  USER_PREFERENCE_SERVICE_NAME,
} from './user-preference.pb';
import { UserPreferenceService } from './user-preference.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_PREFERENCE_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '103.48.194.108:50053',
          package: USER_PREFERENCE_PACKAGE_NAME,
          protoPath:
            'node_modules/yurineko-microservice-proto/proto/user-preference.proto',
        },
      },
    ]),
  ],
  providers: [UserPreferenceService],
  exports: [UserPreferenceService],
})
export class UserPreferenceModule {}
