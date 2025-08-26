import { IsNotEmpty, IsString } from "class-validator";
import { ValidateRequest } from "../auth.pb";

export class VaidateRequestDto implements ValidateRequest {
  @IsNotEmpty()
  @IsString()
  token: string;
}