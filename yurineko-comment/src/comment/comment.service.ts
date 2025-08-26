import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'src/auth/guards/role.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { dbNow } from 'src/prisma/middlewares';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateReactionDto, GetChildCommentDto, ReactionType } from './dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { EditCommentDto, EditCommentStatus } from './dto/edit-comment.dto';
import {
  GetReactionCountDto,
  ReactionCountTypeAll,
} from './dto/get-reaction-count.dto';
import { GetRootCommentDto } from './dto/get-root-comment.dto';
import { GetHightlightedCommentDto } from './dto/get-hightlight-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async create(
    user: JwtPayload,
    createCommentDto: CreateCommentDto & {
      path?: string;
      mentionUser: number[];
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const comment = await tx.comment.create({
        data: {
          userId: user.id,
          ...createCommentDto,
          mentionUser: JSON.stringify(createCommentDto.mentionUser),
          path: createCommentDto.path || '/',
          createdAt: dbNow(),
        },
        select: {
          id: true,
          path: true,
        },
      });

      if (createCommentDto.parentId) {
        await tx.comment.update({
          where: {
            id: createCommentDto.parentId,
          },
          data: {
            replyCount: {
              increment: 1,
            },
          },
        });
      }

      return await tx.comment.update({
        where: {
          id: comment.id,
        },
        data: {
          path: `${comment.path}${comment.id}/`,
        },
        select: {
          id: true,
          content: true,
          image: true,
          likeCount: true,
          createdAt: true,
          parentId: true,
          isHidden: true,
          replyCount: true,
          isEdited: true,
          mangaId: true,
          chapterId: true,
          mentionUser: true,
          reactionInfo: {
            where: {
              userId: user.id,
            },
            select: {
              type: true,
            },
          },
          reactionCount: {
            select: {
              type: true,
              reactionCount: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
              role: true,
              bannedTime: true,
              premiumTime: true,
              team: {
                select: {
                  id: true,
                  name: true,
                  url: true,
                },
              },
            },
          },
        },
      });
    });
  }

  async edit(user: JwtPayload, id: number, editCommentDto: EditCommentDto) {
    const mentionUser = JSON.stringify(
      this._compute_MentionedUserIds(editCommentDto.content),
    );
    return this.prisma.$transaction(async (tx) => {
      const oldComment = await tx.comment.findUnique({
        where: {
          id,
        },
      });

      let editCommentStatus: EditCommentStatus;
      /**
       * Đã có ảnh trước đó
       */
      if (oldComment.image) {
        /**
         * Xóa ảnh cũ
         */
        if (editCommentDto.image === null) {
          editCommentStatus = EditCommentStatus.ATTACHMENT_DELETED;
          /**
           * Không thay đổi
           */
        } else if (editCommentDto.image === undefined) {
          editCommentStatus = EditCommentStatus.HAVE_ATTACHMENT;
          /**
           * Thay đổi ảnh
           */
        } else {
          editCommentStatus = EditCommentStatus.ATTACHMENT_CHANGED;
        }
        /**
         * Chưa có ảnh nhưng có ảnh mới
         */
      } else if (editCommentDto.image) {
        editCommentStatus = EditCommentStatus.ATTACHMENT_ADDED;
      }

      let editCommentImage = oldComment.image;
      if (editCommentDto.image === null) {
        editCommentImage = null;
      } else if (editCommentDto.image) {
        editCommentImage = editCommentDto.image;
      }

      /**
       * Comment lần đầu bị chỉnh sửa
       * Sẽ được tạo version đầu tiên để show list
       */
      if (oldComment.isEdited === false) {
        await tx.commentEditHistory.create({
          data: {
            commentId: id,
            createdAt: new Date(oldComment.createdAt.getTime() + 7 * 3600000),
            content: oldComment.content,
            status: oldComment.image
              ? EditCommentStatus.HAVE_ATTACHMENT
              : undefined,
            image: oldComment.image,
            mentionUser: oldComment.mentionUser,
          },
        });
      }

      const editedComment = await tx.comment.update({
        where: {
          id,
        },
        data: {
          content: editCommentDto.content ?? undefined,
          isEdited: true,
          image: editCommentImage,
          mentionUser: mentionUser,
        },
        select: {
          id: true,
          content: true,
          image: true,
          likeCount: true,
          createdAt: true,
          parentId: true,
          isHidden: true,
          isEdited: true,
          replyCount: true,
          mangaId: true,
          mentionUser: true,
          reactionInfo: {
            where: {
              userId: user.id,
            },
            select: {
              type: true,
            },
          },
          reactionCount: {
            select: {
              type: true,
              reactionCount: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
              role: true,
              bannedTime: true,
              premiumTime: true,
              team: {
                select: {
                  id: true,
                  name: true,
                  url: true,
                },
              },
            },
          },
        },
      });

      /**
       * Tạo version mới
       */
      await tx.$executeRaw`INSERT INTO comment_edit_history (commentId, content, status, image, mentionUser) VALUES (${id}, ${editCommentDto.content}, ${editCommentStatus}, ${editCommentImage}, ${mentionUser})`;

      return editedComment;
    });
  }

  async toggleCommentReaction(
    user: JwtPayload,
    commentId: number,
    createReactionDto: CreateReactionDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const currentReaction = await tx.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId: user.id,
            commentId,
          },
        },
        select: {
          type: true,
        },
      });

      if (currentReaction) {
        await tx.commentLike.delete({
          where: {
            userId_commentId: {
              userId: user.id,
              commentId,
            },
          },
        });

        await tx.commentReactionCount.update({
          where: {
            commentId_type: {
              commentId,
              type: currentReaction.type,
            },
          },
          data: {
            reactionCount: {
              decrement: 1,
            },
          },
        });

        const changes = await tx.comment.update({
          where: {
            id: commentId,
          },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
          select: {
            likeCount: true,
            reactionCount: {
              select: {
                reactionCount: true,
                type: true,
              },
            },
          },
        });

        if (
          changes.likeCount < 0 ||
          changes.reactionCount.some((item) => item.reactionCount < 0)
        ) {
          throw new Error('Số like nhỏ hơn 0! commentId: ' + commentId);
        }

        return false;
      } else {
        await tx.commentLike.create({
          data: {
            userId: user.id,
            commentId,
            ...createReactionDto,
            createAt: dbNow(),
          },
        });

        await tx.commentReactionCount.upsert({
          where: {
            commentId_type: {
              commentId,
              type: createReactionDto.type,
            },
          },
          create: {
            commentId,
            ...createReactionDto,
            reactionCount: 1,
          },
          update: {
            reactionCount: {
              increment: 1,
            },
          },
        });

        await tx.comment.update({
          where: {
            id: commentId,
          },
          data: {
            likeCount: {
              increment: 1,
            },
          },
        });

        return true;
      }
    });
  }

  async getModificationHistory(id: number) {
    return this.prisma.commentEditHistory.findMany({
      where: {
        commentId: id,
      },
      select: {
        commentId: true,
        content: true,
        status: true,
        createdAt: true,
        mentionUser: true,
        comment: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                role: true,
                bannedTime: true,
                premiumTime: true,
                team: {
                  select: {
                    id: true,
                    name: true,
                    url: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findHighlightedComment(
    query: GetHightlightedCommentDto,
    user: JwtPayload,
  ) {
    const highlightedComment = await this.prisma.comment.findFirst({
      where: {
        id: query.commentId,
        isHidden: false,
      },
      select: {
        path: true,
      },
    });

    if (!highlightedComment) {
      throw new NotFoundException(
        'Comment bạn đang truy cập không tồn tại hoặc đã bị xóa!',
      );
    }

    return this.prisma.comment.findMany({
      where: {
        id: {
          in: highlightedComment.path
            .split('/')
            .filter((item) => item !== '')
            .map((item) => Number(item)),
        },
      },
      select: {
        id: true,
        content: true,
        image: true,
        likeCount: true,
        createdAt: true,
        parentId: true,
        isEdited: true,
        isHidden: true,
        replyCount: true,
        mangaId: true,
        mentionUser: true,
        reactionInfo: {
          where: {
            userId: user.id,
          },
          select: {
            type: true,
          },
        },
        reactionCount: {
          select: {
            type: true,
            reactionCount: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            role: true,
            bannedTime: true,
            premiumTime: true,
            team: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
          },
        },
      },
      orderBy: [{ id: 'asc' }],
    });
  }

  async findRoot(
    query: GetRootCommentDto,
    user?: JwtPayload,
    showDeleted = false,
  ) {
    const { mangaId, chapterId, skip, limit } = query;
    return Promise.all([
      this.prisma.comment.findMany({
        where: {
          mangaId,
          chapterId,
          parentId: null,
          isHidden: showDeleted ? undefined : false,
        },
        skip,
        take: limit,
        orderBy: [
          {
            pinCreateAt: {
              sort: 'desc',
              nulls: 'last',
            },
          },
          { id: 'desc' },
        ],
        select: {
          id: true,
          content: true,
          image: true,
          likeCount: true,
          createdAt: true,
          parentId: true,
          isEdited: true,
          isHidden: true,
          replyCount: true,
          mentionUser: true,
          reactionInfo: {
            where: {
              userId: user?.id,
            },
            select: {
              type: true,
            },
          },
          reactionCount: {
            select: {
              type: true,
              reactionCount: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
              role: true,
              bannedTime: true,
              premiumTime: true,
              team: {
                select: {
                  id: true,
                  name: true,
                  url: true,
                },
              },
            },
          },
          pinUser: {
            select: {
              id: true,
              name: true,
              username: true,
              role: true,
              team: {
                select: {
                  id: true,
                  name: true,
                  url: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.comment.count({
        where: {
          mangaId,
          chapterId,
          parentId: null,
          isHidden: showDeleted ? undefined : false,
        },
      }),
    ]);
  }

  async findChild(
    id: number,
    query: GetChildCommentDto,
    user?: JwtPayload,
    showDeleted = false,
  ) {
    const { take, cursor } = query;

    return this.prisma.comment.findMany({
      where: {
        parentId: id,
        isHidden: showDeleted ? undefined : false,
      },
      ...(cursor && { cursor: { id: cursor } }),
      skip: cursor ? 1 : 0,
      take,
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        content: true,
        isEdited: true,
        image: true,
        likeCount: true,
        createdAt: true,
        parentId: true,
        isHidden: true,
        replyCount: true,
        mangaId: true,
        mentionUser: true,
        reactionInfo: {
          where: {
            userId: user?.id,
          },
          select: {
            type: true,
          },
        },
        reactionCount: {
          select: {
            type: true,
            reactionCount: true,
          },
          orderBy: {
            reactionCount: 'desc',
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            role: true,
            bannedTime: true,
            premiumTime: true,
            team: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
          },
        },
      },
    });
  }

  async getCommentReactionDetail(id: number, query: GetReactionCountDto) {
    return this.prisma.commentLike.findMany({
      where: {
        commentId: id,
        type: query.type === ReactionCountTypeAll.ALL ? undefined : query.type,
      },
      select: {
        type: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            role: true,
            bannedTime: true,
            team: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
          },
        },
      },
      skip: query.skip,
      take: query.limit,
    });
  }

  async pinComment(id: number, user: JwtPayload) {
    return this.prisma.$transaction(async (tx) => {
      const comment = await tx.comment.findUnique({
        where: {
          id,
        },
        select: {
          pinCreator: true,
          parentId: true,
        },
      });

      if (!comment) {
        throw new NotFoundException('Comment không tồn tại');
      }

      if (comment.parentId !== null) {
        throw new BadRequestException('Không thể ghim comment con');
      }

      if (comment.pinCreator) {
        await tx.comment.update({
          where: {
            id,
          },
          data: {
            pinCreator: null,
            pinCreateAt: null,
          },
        });
      } else {
        await tx.comment.update({
          where: {
            id,
          },
          data: {
            pinCreator: user.id,
            pinCreateAt: new Date(),
          },
        });
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.comment.findUnique({
      where: {
        id,
      },
      include: {
        manga: {
          select: {
            mangaTeam: {
              select: {
                teamId: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Đánh dấu comment là đã xóa, user/uploader không có quyền ở truyện sẽ không thấy được comment/con của comment này
   * @param id comment id
   * @returns
   */
  async softRemove(id: number) {
    return this.prisma.comment.updateMany({
      where: {
        path: {
          contains: `/${id}/`,
        },
      },
      data: {
        isHidden: true,
      },
    });
  }

  /**
   * Xóa thực sự trong database
   * @param id comment id
   * @returns
   */
  async hardRemove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const deletedComment = await tx.comment.delete({
        where: {
          id,
        },
      });
      if (deletedComment.parentId !== null) {
        await tx.comment.update({
          where: {
            id: deletedComment.parentId,
          },
          data: {
            replyCount: {
              decrement: 1,
            },
          },
        });
      }
    });
  }

  async _compute_MentionUser(comment: any) {
    comment.mentionUser = await this.userService.findByIdsForMention(
      JSON.parse(comment.mentionUser),
    );
  }

  _compute_MentionedUserIds(content: string): number[] {
    const regex = /<@#(\d+)>/g;
    const mentionBlockMatch = content.matchAll(regex);
    return Array.from(mentionBlockMatch).map((mentionBlock) => {
      return parseInt(mentionBlock[1]);
    });
  }

  _compute_PremiumTimeUser(user: any) {
    if (user.premiumTime) {
      delete user.premiumTime;
      user.isPremium = user.premiumTime > new Date();
    }
    return user;
  }

  _compute_BannedTimeUser(user: any) {
    if (user.bannedTime) {
      user.isBanned = user.bannedTime > new Date();
      delete user.bannedTime;
    }
  }

  _compute_UserAvatar(user: any) {
    if (user.avatar) {
      user.avatar = `${this.configService.getOrThrow('IMAGE_STORAGE_HOST')}/${
        user.avatar
      }`;
    }
  }

  _compute_CommentImageUrl(comment: any) {
    if (comment.image) {
      comment.image = `${this.configService.getOrThrow('IMAGE_STORAGE_HOST')}/${
        comment.image
      }`;
    }
  }

  _compute_CommentPermission(comment: any, user: JwtPayload, mangaInfo: any) {
    const permission = {
      edit: false,
      pin: false,
      delete: false,
      ban: false,
    };

    if (user && comment.user.id === user.id) {
      permission.edit = true;
      permission.delete = true;
    }

    if (
      user &&
      (user.role === UserRole.ADMIN ||
        (user.role === UserRole.UPLOADER &&
          mangaInfo?.mangaTeam?.some((team) => team.teamId === user.teamId)))
    ) {
      permission.pin = true;
      permission.delete = true;
      permission.ban = user.role === UserRole.ADMIN;
    }

    comment.permission = permission;
  }

  _compute_IsLikedComment(comment: any) {
    if (comment.reactionInfo.length > 0) {
      comment.reactionInfo = comment.reactionInfo[0];
    } else {
      comment.reactionInfo = {
        type: 'none',
      };
    }
  }

  async _computeField_Comment(comment: any, user: JwtPayload, manga: any) {
    if (comment.mangaId) {
      delete comment.mangaId;
    }

    if (comment.chapterId) {
      delete comment.chapterId;
    }

    this._compute_CommentImageUrl(comment);

    if (comment.user) {
      this._compute_PremiumTimeUser(comment.user);
      this._compute_BannedTimeUser(comment.user);
      this._compute_UserAvatar(comment.user);
    }

    if (comment.pinUser) {
      this._compute_BannedTimeUser(comment.pinUser);
      this._compute_PremiumTimeUser(comment.pinUser);
    }

    await this._compute_MentionUser(comment);
    this._compute_CommentPermission(comment, user, manga);
    this._compute_IsLikedComment(comment);
  }

  async _batchComputeField_Comment(
    comments: any[],
    user: JwtPayload,
    manga: any,
  ) {
    return Promise.all(
      comments.map((comment) =>
        this._computeField_Comment(comment, user, manga),
      ),
    );
  }

  _batchComputeField_CommentReaction(reactions: any[]) {
    reactions.forEach((reaction) => {
      if (reaction.user) {
        this._compute_BannedTimeUser(reaction.user);
        this._compute_UserAvatar(reaction.user);
      }
    });
  }

  async _batchComputeField_CommentHistory(histories: any[]) {
    return Promise.all(
      histories.map(async (history) => {
        history.user = history.comment.user;
        delete history.comment;
        await this._compute_MentionUser(history);
        this._compute_PremiumTimeUser(history.user);
        this._compute_BannedTimeUser(history.user);
        this._compute_UserAvatar(history.user);
      }),
    );
  }
}
