import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
export class GetChildCommentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  cursor: number = 0;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  take: number = 5;
}
