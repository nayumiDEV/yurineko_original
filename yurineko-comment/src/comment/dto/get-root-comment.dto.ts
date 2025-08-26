import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { IsNullable } from 'src/decorators';
import { PaginationDto } from './pagination.dto';

export class GetRootCommentDto extends PaginationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  mangaId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @IsNullable()
  @Type(() => Number)
  chapterId: number = null;
}
