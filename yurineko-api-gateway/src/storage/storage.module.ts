import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { STORAGE_PACKAGE_NAME, STORAGE_SERVICE_NAME } from './storage.pb';

@Module({
  imports: [
    ClientsModule.register([{
      name: STORAGE_SERVICE_NAME,
      transport: Transport.GRPC,
      options: {
        url: '103.48.194.108:50057',
        package: STORAGE_PACKAGE_NAME,
        protoPath: 'node_modules/yurineko-microservice-proto/proto/storage.proto',
      }
    }])
  ],
  controllers: [StorageController],
  providers: [StorageService]
})
export class StorageModule {}
