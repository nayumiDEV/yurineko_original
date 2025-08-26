/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "notification";

export interface GetNotificationRequest {
  mUserId: number;
  cursor: string;
}

export interface Notification {
  mId: string;
  mTitle: string;
  mBody: string;
  mImage: string;
  mUrl: string;
  mIcon: string;
  mCreatedAt: string;
  mIsRead: boolean;
}

export interface GetNotificationResponseData {
  notification: Notification[];
  countMissed: number;
}

export interface GetNotificationResponse {
  status: number;
  error: string[];
  data: GetNotificationResponseData | undefined;
}

export interface ReadNotificationRequest {
  mUserId: number;
  mNotificationId: string;
}

export interface ReadNotificationResponse {
  status: number;
  error: string[];
}

export interface ViewNotificationRequest {
  mUserId: number;
}

export interface ViewNotificationResponse {
  status: number;
  error: string[];
}

export interface ReadAllNotificationRequest {
  mUserId: number;
}

export interface ReadAllNotificationResponse {
  status: number;
  error: string[];
}

export const NOTIFICATION_PACKAGE_NAME = "notification";

export interface NotificationServiceClient {
  getNotification(request: GetNotificationRequest): Observable<GetNotificationResponse>;

  readNotification(request: ReadNotificationRequest): Observable<ReadNotificationResponse>;

  readAllNotification(request: ReadAllNotificationRequest): Observable<ReadAllNotificationResponse>;

  viewAllNotification(request: ViewNotificationRequest): Observable<ViewNotificationResponse>;
}

export interface NotificationServiceController {
  getNotification(
    request: GetNotificationRequest,
  ): Promise<GetNotificationResponse> | Observable<GetNotificationResponse> | GetNotificationResponse;

  readNotification(
    request: ReadNotificationRequest,
  ): Promise<ReadNotificationResponse> | Observable<ReadNotificationResponse> | ReadNotificationResponse;

  readAllNotification(
    request: ReadAllNotificationRequest,
  ): Promise<ReadAllNotificationResponse> | Observable<ReadAllNotificationResponse> | ReadAllNotificationResponse;

  viewAllNotification(
    request: ViewNotificationRequest,
  ): Promise<ViewNotificationResponse> | Observable<ViewNotificationResponse> | ViewNotificationResponse;
}

export function NotificationServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getNotification", "readNotification", "readAllNotification", "viewAllNotification"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("NotificationService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("NotificationService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const NOTIFICATION_SERVICE_NAME = "NotificationService";
