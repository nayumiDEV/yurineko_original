/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface AuthUserData {
  mId: number;
  mName: string;
  mRole: number;
  mTeamId: number;
  isBanned: boolean;
  isPremium: boolean;
}

export interface FindByNameUserData {
  mId: number;
  mName: string;
  mAvatar: string;
}

export interface FindByIdForAuthRequest {
  mId: number;
}

export interface FindByIdForAuthResponse {
  status: number;
  error: string[];
  data: AuthUserData | undefined;
}

export interface FindByIdsForMentionUserData {
  mId: number;
  mName: string;
  mUsername: string;
}

export interface FindByIdsForMentionRequest {
  mIds: number[];
}

export interface FindByIdsForMentionResponse {
  status: number;
  error: string[];
  data: FindByIdsForMentionUserData[];
}

export interface FindByNameRequest {
  mName: string;
}

export interface FindByNameResponse {
  status: number;
  error: string[];
  data: FindByNameUserData[];
}

export interface FindByIdsRequest {
  mIds: number[];
}

export interface FindByIdsData {
  mId: number;
  mName: string;
  mUsername: string;
  avatar: string;
}

export interface FindByIdsResponse {
  status: number;
  error: string[];
  data: FindByIdsData[];
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  findByIdForAuth(request: FindByIdForAuthRequest): Observable<FindByIdForAuthResponse>;

  findByIdsForMention(request: FindByIdsForMentionRequest): Observable<FindByIdsForMentionResponse>;

  findByName(request: FindByNameRequest): Observable<FindByNameResponse>;

  findByIds(request: FindByIdsRequest): Observable<FindByIdsResponse>;
}

export interface UserServiceController {
  findByIdForAuth(
    request: FindByIdForAuthRequest,
  ): Promise<FindByIdForAuthResponse> | Observable<FindByIdForAuthResponse> | FindByIdForAuthResponse;

  findByIdsForMention(
    request: FindByIdsForMentionRequest,
  ): Promise<FindByIdsForMentionResponse> | Observable<FindByIdsForMentionResponse> | FindByIdsForMentionResponse;

  findByName(
    request: FindByNameRequest,
  ): Promise<FindByNameResponse> | Observable<FindByNameResponse> | FindByNameResponse;

  findByIds(request: FindByIdsRequest): Promise<FindByIdsResponse> | Observable<FindByIdsResponse> | FindByIdsResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findByIdForAuth", "findByIdsForMention", "findByName", "findByIds"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
