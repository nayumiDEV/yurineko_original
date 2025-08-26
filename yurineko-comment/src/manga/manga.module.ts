import { Module } from '@nestjs/common';
import { MangaService } from './manga.service';

@Module({
  providers: [MangaService],
  exports: [MangaService],
})
export class MangaModule {}
