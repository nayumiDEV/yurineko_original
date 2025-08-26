import { Injectable } from '@nestjs/common';
import { TaxonomyCreateRequest, TaxonomyUpdateRequest } from './taxonomy.pb';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaxonomyService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async findById(mId: number) {
    return this.prisma.taxonomy.findUnique({
      where: {
        mId
      }
    })
  }

  async findByIds(mIds: number[]) {
    return this.prisma.taxonomy.findMany({
      where: {
        mId: {
          in: mIds
        }
      }
    })
  }

  async findBySlug(mSlug: string) {
    return this.prisma.taxonomy.findUnique({
      where: {
        mSlug
      }
    })
  }

  async findByName(mType: string, mName: string = '') {
    return this.prisma.taxonomy.findMany({
      where: {
        mType,
        mName: {
          startsWith: mName
        }
      }
    })
  }

  async create(data: TaxonomyCreateRequest) {
    return this.prisma.taxonomy.create({
      data,
      select: {
        mId: true,
      }
    })
  }

  async update(data: TaxonomyUpdateRequest) {
    return this.prisma.taxonomy.update({
      where: {
        mId: data.mId
      },
      data: data.data
    })
  }

  async delete(mId: number) {
    return this.prisma.taxonomy.delete({
      where: {
        mId
      }
    })
  }
}
