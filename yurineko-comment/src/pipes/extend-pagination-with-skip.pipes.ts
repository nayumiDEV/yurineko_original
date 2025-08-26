import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { PaginationDto } from 'src/comment/dto/pagination.dto';

@Injectable()
export class ExtendsPaginationWithSkipPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value instanceof PaginationDto) {
      value.skip = (value.page - 1) * value.limit;
    }

    return value;
  }
}
