import { ArgumentsHost, Catch, HttpStatus } from "@nestjs/common";
import { BaseRpcExceptionFilter} from "@nestjs/microservices";
import { Prisma } from "@prisma/client";
import { of } from "rxjs";

export type ErrorCodesStatusMapping = {
  [key: string]: number;
};

export type ErrorCodesMessageMapping = {
  [key: string]: string;
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseRpcExceptionFilter {
  private errorCodesStatusMapping: ErrorCodesStatusMapping = {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
  };

  private errorCodesMessageMapping: ErrorCodesMessageMapping = {
    P2000: 'Dữ liệu vượt quá giới hạn cho phép.',
    P2002: 'Đã tồn tại bản ghi này.',
    P2025: 'Không tìm thấy bản ghi này.',
  };

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const statusCode = this.errorCodesStatusMapping[exception.code];

    const message = this.errorCodesMessageMapping[exception.code];

    return of({
      status: statusCode,
      error: [message]
    })
  }
}