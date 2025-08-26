import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ReactionType } from './create-reaction.dto';
import { PaginationDto } from './pagination.dto';

export enum ReactionCountTypeAll {
  ALL = 'all',
}

type ReactionCountType = ReactionType | ReactionCountTypeAll;

export class GetReactionCountDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  type: ReactionCountType = ReactionCountTypeAll.ALL;
}
