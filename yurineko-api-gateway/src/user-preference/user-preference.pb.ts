/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user_preference";

export interface InitUserPreferenceRequest {
  mUserId: number;
}

export interface InitUserPreferenceResponse {
  status: number;
  error: string[];
}

export interface UserNotificationPreference {
  generalMessage: boolean;
  mangaFollowingNewChapter: boolean;
  teamFollowingNewManga: boolean;
  teamMangaNewComment: boolean;
  commentReply: boolean;
  commentReaction: boolean;
  commentMention: boolean;
  teamNewReport: boolean;
}

export interface UserPreference {
  notification: UserNotificationPreference | undefined;
}

export interface GetUserPreferenceRequest {
  mUserId: number;
}

export interface GetUserPreferenceResponse {
  status: number;
  error: string[];
  data: UserPreference | undefined;
}

export interface SetUserPreferenceRequest {
  mUserId: number;
  mUserReference: UserPreference | undefined;
}

export interface SetUserPreferenceResponse {
  status: number;
  error: string[];
}

export interface BatchGetUserPreferenceRequest {
  mUserIds: number[];
}

export interface BatchGetUserPreferenceResponse {
  status: number;
  error: string[];
  data: { [key: number]: UserPreference };
}

export interface BatchGetUserPreferenceResponse_DataEntry {
  key: number;
  value: UserPreference | undefined;
}

export const USER_PREFERENCE_PACKAGE_NAME = "user_preference";

export interface UserPreferenceServiceClient {
  initUserPreference(request: InitUserPreferenceRequest): Observable<InitUserPreferenceResponse>;

  getUserPreference(request: GetUserPreferenceRequest): Observable<GetUserPreferenceResponse>;

  batchGetUserPreference(request: BatchGetUserPreferenceRequest): Observable<BatchGetUserPreferenceResponse>;

  setUserPreference(request: SetUserPreferenceRequest): Observable<SetUserPreferenceResponse>;
}

export interface UserPreferenceServiceController {
  initUserPreference(
    request: InitUserPreferenceRequest,
  ): Promise<InitUserPreferenceResponse> | Observable<InitUserPreferenceResponse> | InitUserPreferenceResponse;

  getUserPreference(
    request: GetUserPreferenceRequest,
  ): Promise<GetUserPreferenceResponse> | Observable<GetUserPreferenceResponse> | GetUserPreferenceResponse;

  batchGetUserPreference(
    request: BatchGetUserPreferenceRequest,
  ):
    | Promise<BatchGetUserPreferenceResponse>
    | Observable<BatchGetUserPreferenceResponse>
    | BatchGetUserPreferenceResponse;

  setUserPreference(
    request: SetUserPreferenceRequest,
  ): Promise<SetUserPreferenceResponse> | Observable<SetUserPreferenceResponse> | SetUserPreferenceResponse;
}

export function UserPreferenceServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "initUserPreference",
      "getUserPreference",
      "batchGetUserPreference",
      "setUserPreference",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserPreferenceService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserPreferenceService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_PREFERENCE_SERVICE_NAME = "UserPreferenceService";
