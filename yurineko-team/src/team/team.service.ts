import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeamRequest, TeamMemberPermission, UpdateTeamRequestData } from './team.pb';
import slugify from 'slugify';
import * as crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) { }

  async createTeam(data: CreateTeamRequest) {
    const randomSuffix = crypto.randomBytes(2).toString('hex');
    const slug = slugify(data.mName, {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true,
    }) + '-' + randomSuffix;

    return this.prisma.team.create({
      data: {
        mName: data.mName,
        mSlug: slug,
      },
      select: {
        mId: true,
      }
    })
  }

  async updateTeamRelatedMorph(mTeamId: number, mRelatedType: string, mRelatedId: number) {
    return this.prisma.teamRelatedMorph.upsert({
      where: {
        mRelatedType_mRelatedId: {
          mRelatedType,
          mRelatedId,
        }
      },
      update: {
        mTeamId,
      },
      create: {
        mTeamId,
        mRelatedType,
        mRelatedId
      }
    })
  }

  async findAll() {
    return this.prisma.team.findMany();
  }

  async findBySlug(mSlug: string) {
    return this.prisma.team.findUnique({
      where: {
        mSlug,
      }
    })
  }

  async findById(mId: number) {
    return this.prisma.team.findUnique({
      where: {
        mId,
      }
    })
  }

  async findByIds(mIds: number[]) {
    return this.prisma.team.findMany({
      where: {
        mId: {
          in: mIds,
        }
      }
    })
  }

  async updateTeam(mTeamId: number, data: UpdateTeamRequestData) {
    return this.prisma.team.update({
      where: {
        mId: mTeamId,
      },
      data: {
        ...data,
        mSocialLinks: data.mSocialLinks as unknown as Prisma.JsonArray,
      }
    })
  }

  async getTeamMembers(mTeamId: number) {
    const memberIds = await this.prisma.teamMember.findMany({
      where: {
        mTeamId,
      },
      select: {
        mMemberId: true,
      }
    });

    const users = await this.userService.getUserByIds(memberIds.map(m => m.mMemberId))
    return users;
  }

  async addMemberToTeam(mTeamId: number, mMemberId: number) {
    return this.prisma.teamMember.create({
      data: {
        mTeamId,
        mMemberId,
      },

    })
  }

  async removeMemberFromTeam(mTeamId: number, mMemberId: number) {
    return this.prisma.teamMember.delete({
      where: {
        mTeamId_mMemberId: {
          mTeamId,
          mMemberId
        }
      }
    })
  }

  async editMemberPermission(teamId: number, memberId: number, data: TeamMemberPermission) {
    return this.prisma.teamMember.update({
      where: {
        mTeamId_mMemberId: {
          mTeamId: teamId,
          mMemberId: memberId,
        }
      },
      data: {
        ...data,
      }
    })
  }

  async getUserFollowState(mTeamId: number, mUserId: number) {
    return this.prisma.teamFollow.findUnique({
      where: {
        mUserId_mTeamId: {
          mTeamId,
          mUserId
        }
      }
    })
  }

  async toggleFollowTeam(mTeamId: number, mUserId: number) {
    return this.prisma.$transaction(tx => {
      const followStatus = tx.teamFollow.findUnique({
        where: {
          mUserId_mTeamId: {
            mTeamId,
            mUserId
          }
        }
      })

      if (followStatus) {
        return tx.teamFollow.delete({
          where: {
            mUserId_mTeamId: {
              mTeamId,
              mUserId
            }
          }
        })
      }

      return tx.teamFollow.create({
        data: {
          mTeamId,
          mUserId,
        }
      })
    })
  }

  async getUserSubscribeState(mTeamId: number, mUserId: number) {
    return this.prisma.teamSubscriber.findUnique({
      where: {
        mTeamId_mUserId: {
          mTeamId,
          mUserId
        }
      }
    })
  }

  async toggleSubscribeTeam(mTeamId: number, mUserId: number) {
    return this.prisma.$transaction(tx => {
      const subscribeStatus = tx.teamSubscriber.findUnique({
        where: {
          mTeamId_mUserId: {
            mTeamId,
            mUserId
          }
        }
      })

      if (subscribeStatus) {
        return tx.teamSubscriber.delete({
          where: {
            mTeamId_mUserId: {
              mTeamId,
              mUserId
            }
          }
        })
      }

      return tx.teamSubscriber.create({
        data: {
          mTeamId,
          mUserId,
        }
      })
    })
  }

  async getTeamMemberIds(mTeamId: number) {
    return this.prisma.teamMember.findMany({
      where: {
        mTeamId,
      },
      select: {
        mMemberId: true,
        mTeamId: true,
      }
    })
  }

  async getMemberPermission(teamId: number, memberId: number) {
    return this.prisma.teamMember.findUnique({
      where: {
        mTeamId_mMemberId: {
          mTeamId: teamId,
          mMemberId: memberId,
        }
      },
      select: {
        pCanManageTeam: true,
        pCanCreateManga: true,
        pCanCreateChapter: true,
        pCanEditManga: true,
        pCanEditChapter: true,
        pCanDeleteManga: true,
        pCanDeleteChapter: true,
      }
    })
  }


  async getManyMembersPermission(teamId: number, memberIds: number[]) {
    return this.prisma.teamMember.findMany({
      where: {
        mTeamId: teamId,
        mMemberId: {
          in: memberIds,
        }
      }
    })
  }

  async getTeamSubscriberIds(mTeamId: number) {
    return this.prisma.teamSubscriber.findMany({
      where: {
        mTeamId,
      },
      select: {
        mUserId: true,
      }
    })
  }

  async getTeamByMemberId(mMemberId: number) {
    return this.prisma.teamMember.findUnique({
      where: {
        mMemberId
      },
      select: {
        team: true,
      }
    })
  }

  async getTeamByRelatedMorph(mRelatedType: string, mRelatedId: number) {
    return this.prisma.teamRelatedMorph.findFirst({
      where: {
        mRelatedType,
        mRelatedId,
      },
      select: {
        team: true,
      }
    })
  }
}
