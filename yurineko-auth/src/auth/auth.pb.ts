/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

export interface ValidateRequest {
  token: string;
}

export interface ValidateResponse {
  status: number;
  error: string[];
  data: ValidateResponse_ValidateData | undefined;
}

export interface ValidateResponse_ValidateData {
  mUserId: number;
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthServiceClient {
  /**
   * rpc Login (LoginRequest) returns (LoginResponse) {}
   * rpc Register (RegisterRequest) returns (RegisterResponse) {}
   */

  validate(request: ValidateRequest): Observable<ValidateResponse>;
}

export interface AuthServiceController {
  /**
   * rpc Login (LoginRequest) returns (LoginResponse) {}
   * rpc Register (RegisterRequest) returns (RegisterResponse) {}
   */

  validate(request: ValidateRequest): Promise<ValidateResponse> | Observable<ValidateResponse> | ValidateResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["validate"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
