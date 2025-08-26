import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from './user.pb';

@Module({
  imports: [
    ClientsModule.register([{
      name: USER_SERVICE_NAME,
      transport: Transport.GRPC,
      options: {
        url: '103.48.194.108:50052',
        package: USER_PACKAGE_NAME,
        protoPath: 'node_modules/yurineko-microservice-proto/proto/user.proto',
      }
    }]),
  ],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
