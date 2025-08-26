import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  NotificationIcon,
  NotificationService,
  NotificationType,
} from '@yurineko-service/notification-client';
import { CreateCommentDto } from './dto';

const mapReactionToNotificationIcon: Record<string, NotificationIcon> = {
  like: NotificationIcon.REACTION_LIKE,
  love: NotificationIcon.REACTION_LOVE,
  haha: NotificationIcon.REACTION_HAHA,
  wow: NotificationIcon.REACTION_WOW,
  sad: NotificationIcon.REACTION_SAD,
  angry: NotificationIcon.REACTION_ANGRY,
  what: NotificationIcon.REACTION_WHAT,
};

interface IUrlMetadata {
  url: string;
  name: string;
}

@Injectable()
export class NotificationBll {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async sendNewCommentNotification(
    user: JwtPayload,
    dto: CreateCommentDto,
    mentions: number[],
    newComment: any,
  ) {
    const parent = dto.parentId
      ? await this.getCommentInfo(dto.parentId)
      : undefined;
    const manga = await this.getMangaInfo(newComment.mangaId);
    const chapter = newComment.chapterId
      ? await this.getChapterInfo(newComment.chapterId)
      : undefined;
    const mangaTeamMember = manga.mangaTeam.flatMap((x) =>
      x.team.user.map((u) => u.id),
    );

    const metadata: IUrlMetadata = {
      url: this.generateUrl(
        newComment.id,
        newComment.mangaId,
        newComment.chapterId,
      ),
      name: this.generateUrlName(manga.originalName, chapter?.name),
    };

    const promise = [];
    if (parent) {
      /**
       * Remove event for user who got mentioned in his/her comment
       */
      const mentionIndex = mentions.indexOf(parent.userId);
      if (mentionIndex > -1) mentions.splice(mentionIndex, 1);

      /**
       * Remove event for user who mention himself/herself
       */
      const selfMentionIndex = mentions.indexOf(user.id);
      if (selfMentionIndex > -1) mentions.splice(selfMentionIndex, 1);

      promise.push(this.replyNotification(user, dto, parent.userId, metadata));
    }

    if (mentions.length) {
      /**
       * Remove event for team manga member if they are mentioned
       */
      mentions.forEach((x) => {
        const mentionIndex = mangaTeamMember.indexOf(x);
        if (mentionIndex > -1) mangaTeamMember.splice(mentionIndex, 1);
      });
      promise.push(
        this.mentionNotification(user, newComment, mentions, metadata),
      );
    }

    if (!parent) {
      promise.push(
        this.teamMangaNotification(user, newComment, mangaTeamMember, metadata),
      );
    }

    return Promise.all(promise);
  }

  async sendReactionNotification(
    user: JwtPayload,
    commentId: number,
    reaction: string,
  ) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        userId: true,
        mangaId: true,
        chapterId: true,
        manga: {
          select: {
            originalName: true,
          },
        },
        chapter: {
          select: {
            name: true,
          },
        },
      },
    });

    // If user react to his/her comment, don't send notification
    if (comment.userId === user.id) return;

    const metadata: IUrlMetadata = {
      url: this.generateUrl(commentId, comment.mangaId, comment.chapterId),
      name: this.generateUrlName(
        comment.manga.originalName,
        comment.chapter?.name,
      ),
    };

    return this.notificationService.sendNotification({
      receiptentId: [comment.userId],
      mTitle: `<strong>${user.name}</strong>$ đã bày tỏ cảm xúc về bình luận của bạn ở <strong>${metadata.name}</strong>`,
      mBody: reaction,
      mType: NotificationType.COMMENT_REACTION,
      mUrl: metadata.url,
      mIcon: mapReactionToNotificationIcon[reaction],
      mSenderId: user.id,
      mObjectId: commentId,
      mImage: user.avatar,
    });
  }

  teamMangaNotification(
    user: JwtPayload,
    dto: any,
    mangaTeamMember: number[],
    metadata: IUrlMetadata,
  ) {
    return this.notificationService.sendNotification({
      receiptentId: mangaTeamMember,
      mTitle: `<strong>${user.name}</strong>$ đã bình luận ở <strong>${metadata.name}</strong>`,
      mBody:
        dto.content.slice(0, 100) + (dto.content.length > 100 ? '...' : ''),
      mType: NotificationType.TEAM_MANGA_NEW_COMMENT,
      mUrl: metadata.url,
      mIcon: NotificationIcon.COMMENT,
      mSenderId: user.id,
      mObjectId: dto.chapterId ?? dto.mangaId,
      mImage: user.avatar,
    });
  }

  replyNotification(
    user: JwtPayload,
    dto: CreateCommentDto,
    replyUserId: number,
    metadata: IUrlMetadata,
  ) {
    return this.notificationService.sendNotification({
      receiptentId: [replyUserId],
      mSenderId: user.id,
      mType: NotificationType.COMMENT_REPLY,
      mIcon: NotificationIcon.COMMENT,
      mTitle: `<strong>${user.name}</strong>$ đã trả lời bình luận của bạn ở <strong>${metadata.name}</strong>`,
      mBody:
        dto.content.slice(0, 100) + (dto.content.length > 100 ? '...' : ''),
      mUrl: metadata.url,
      mObjectId: dto.parentId,
      mImage: user.avatar,
    });
  }

  mentionNotification(
    user: JwtPayload,
    dto: any,
    mentions: number[],
    metadata: IUrlMetadata,
  ) {
    return this.notificationService.sendNotification({
      receiptentId: mentions,
      mTitle: `<strong>${user.name}</strong> đã nhắc đến bạn trong một bình luận ở <strong>${metadata.name}</strong>`,
      mBody:
        dto.content.slice(0, 100) + (dto.content.length > 100 ? '...' : ''),
      mType: NotificationType.COMMENT_MENTION,
      mUrl: metadata.url,
      mIcon: NotificationIcon.COMMENT,
      mSenderId: user.id,
      mObjectId: dto.chapterId ?? dto.mangaId,
      mImage: user.avatar,
    });
  }

  getCommentInfo(commentId: number) {
    return this.prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        userId: true,
      },
    });
  }

  getMangaInfo(mangaId: number) {
    return this.prisma.manga.findUnique({
      where: { id: mangaId },
      select: {
        originalName: true,
        mangaTeam: {
          select: {
            team: {
              select: {
                user: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  getChapterInfo(chapterId: number) {
    return this.prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        name: true,
      },
    });
  }

  generateUrl(commentId: number, mangaId: number, chapterId?: number) {
    return (
      this.configService.getOrThrow('HOST') +
      (chapterId ? `/read/${mangaId}/${chapterId}` : `/manga/${mangaId}`) +
      `?highlightComment=${commentId}`
    );
  }

  generateUrlName(mangaName: string, chapterName?: string) {
    return chapterName ? `${mangaName} - ${chapterName}` : mangaName;
  }
}
