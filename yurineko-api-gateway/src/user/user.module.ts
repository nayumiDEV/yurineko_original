import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user.controller';
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from './user.pb';
import { UserService } from './user.service';

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
    }])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
