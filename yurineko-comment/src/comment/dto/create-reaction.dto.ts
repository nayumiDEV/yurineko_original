import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  HAHA = 'haha',
  WOW = 'wow',
  SAD = 'sad',
  ANGRY = 'angry',
  WHAT = 'what',
}

export class CreateReactionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ReactionType)
  type: ReactionType = ReactionType.LIKE;
}
