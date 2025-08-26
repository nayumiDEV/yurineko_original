import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateSignedUrlRequest, STORAGE_SERVICE_NAME, StorageServiceClient } from './storage.pb';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StorageService implements OnModuleInit {
  private svc: StorageServiceClient;

  @Inject(STORAGE_SERVICE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit() {
    this.svc = this.client.getService<StorageServiceClient>(STORAGE_SERVICE_NAME);
  }

  async createSignedUrl(payload: CreateSignedUrlRequest) {
    const { data } = await firstValueFrom(this.svc.createSignedUrl(payload));
    return data;
  }
}
