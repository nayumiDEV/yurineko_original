import { Module } from '@nestjs/common';
import { PushService } from './push.service';
import { PushController } from './push.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PUSH_PACKAGE_NAME, PUSH_SERVICE_NAME } from './push.pb';

@Module({
  imports: [
    ClientsModule.register([{
      name: PUSH_SERVICE_NAME,
      transport: Transport.GRPC,
      options: {
        url: '103.48.194.108:50056',
        package: PUSH_PACKAGE_NAME,
        protoPath: 'node_modules/yurineko-microservice-proto/proto/push.proto',
      }
    }])
  ],
  controllers: [PushController],
  providers: [PushService]
})
export class PushModule { }
