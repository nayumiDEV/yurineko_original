import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MangaService {
  constructor(private readonly prisma: PrismaService) {}

  async getMangaById(id: number) {
    return this.prisma.manga.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        mangaTeam: {
          select: {
            teamId: true,
          },
        },
      },
    });
  }
}
