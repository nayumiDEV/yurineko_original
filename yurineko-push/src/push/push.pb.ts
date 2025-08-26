/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "push";

export interface AddPushEndpointRequest {
  mUserId: number;
  mData: string;
}

export interface AddPushEndpointResponse {
  status: number;
  error: string[];
}

export const PUSH_PACKAGE_NAME = "push";

export interface PushServiceClient {
  addPushEndpoint(request: AddPushEndpointRequest): Observable<AddPushEndpointResponse>;
}

export interface PushServiceController {
  addPushEndpoint(
    request: AddPushEndpointRequest,
  ): Promise<AddPushEndpointResponse> | Observable<AddPushEndpointResponse> | AddPushEndpointResponse;
}

export function PushServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["addPushEndpoint"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("PushService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("PushService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PUSH_SERVICE_NAME = "PushService";
