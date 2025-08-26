import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { IsNullable } from 'src/common';

export enum NotificationType {
  GENERAL_MESSAGE = 'GENERAL_MESSAGE',
  TEAM_FOLLOWING_MANGA_PUBLISH = 'TEAM_FOLLOWING_MANGA_PUBLISH',
  MANGA_FOLLOWING_NEW_CHAPTER = 'MANGA_FOLLOWING_NEW_CHAPTER',
  TEAM_MANGA_NEW_COMMENT = 'TEAM_MANGA_NEW_COMMENT',
  COMMENT_REPLY = 'COMMENT_REPLY',
  COMMENT_REACTION = 'COMMENT_REACTION',
  COMMENT_MENTION = 'COMMENT_MENTION',
}

export enum NotificationIcon {
  COMMENT = 'comment',
  REACTION_LIKE = 'reaction-like',
  REACTION_LOVE = 'reaction-love',
  REACTION_HAHA = 'reaction-haha',
  REACTION_WOW = 'reaction-wow',
  REACTION_SAD = 'reaction-sad',
  REACTION_ANGRY = 'reaction-angry',
  REACTION_WHAT = 'reaction-what',
  MANGA_FOLLOWING_NEW_CHAPTER = 'follow-new-chapter',
  TEAM_FOLLOWING_MANGA_PUBLISH = 'follow-new-manga',
}

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsArray()
  receiptentId: number[];

  @IsNotEmpty()
  @IsString()
  mTitle: string;

  @IsNotEmpty()
  @IsString()
  mBody: string;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  mType: NotificationType;

  @IsNotEmpty()
  @IsString()
  mUrl: string;

  @IsNotEmpty()
  @IsEnum(NotificationIcon)
  mIcon: NotificationIcon;

  @IsNotEmpty()
  @IsString()
  mImage: string;

  @IsNullable()
  @IsNumber()
  mObjectId?: number = null;

  @IsNullable()
  @IsNumber()
  mSenderId?: number = null;
}
