import { IsNotEmpty, IsString } from "class-validator";
import { FindByNameRequest } from "../user.pb";

export class FindByNameRequestDto implements FindByNameRequest {
  @IsNotEmpty()
  @IsString()
  mName: string;
}