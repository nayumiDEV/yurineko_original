import { IsNotEmpty, IsInt, IsPositive } from "class-validator";
import { FindByIdForAuthRequest } from "../user.pb";

export class FindByIdForAuthRequestDto implements FindByIdForAuthRequest {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  mId: number;
}