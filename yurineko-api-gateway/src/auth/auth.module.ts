import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME } from './auth.pb';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Global()
@Module({
  imports: [
    ClientsModule.register([{
      name: AUTH_SERVICE_NAME,
      transport: Transport.GRPC,
      options: {
        url: '103.48.194.108:50051',
        package: AUTH_PACKAGE_NAME,
        protoPath: 'node_modules/yurineko-microservice-proto/proto/auth.proto',
      }
    }])
  ],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule { }
