/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "storage";

export interface CreateSignedUrlRequest {
  mKey: string;
  mMime: string;
  mSize: number;
}

export interface CreateSignedUrlResponseData {
  mUrl: string;
  mKey: string;
}

export interface CreateSignedUrlResponse {
  status: number;
  error: string[];
  data: CreateSignedUrlResponseData | undefined;
}

export interface CheckFileExistsRequest {
  mKey: string;
}

export interface CheckFileExistsResponseData {
  fileExists: boolean;
}

export interface CheckFileExistsResponse {
  status: number;
  error: string[];
  data: CheckFileExistsResponseData | undefined;
}

export interface InsertFileEntryRequestData {
  mKey: string;
}

export interface InsertFileEntryRequest {
  mRelatedType: string;
  mRelatedId: number;
  mField: string;
  data: InsertFileEntryRequestData[];
}

export interface InsertFileEntryResponse {
  status: number;
  error: string[];
}

export interface GetFileEntryRequest {
  mRelatedType: string;
  mRelatedId: number;
}

export interface GetFileEntryResponseData {
  mField: string;
  mUrl: string;
}

export interface GetFileEntryResponse {
  status: number;
  error: string[];
  data: GetFileEntryResponseData[];
}

export interface DeleteFileEntryRequest {
  mRelatedType: string;
  mRelatedId: number;
}

export interface DeleteFileEntryResponse {
  status: number;
  error: string[];
}

export const STORAGE_PACKAGE_NAME = "storage";

export interface StorageServiceClient {
  createSignedUrl(request: CreateSignedUrlRequest): Observable<CreateSignedUrlResponse>;

  checkFileExists(request: CheckFileExistsRequest): Observable<CheckFileExistsResponse>;

  insertFileEntry(request: InsertFileEntryRequest): Observable<InsertFileEntryResponse>;

  getFileEntry(request: GetFileEntryRequest): Observable<GetFileEntryResponse>;

  /** rpc UpdateFileEntry(UpdateFileEntryRequest) returns (UpdateFileEntryResponse) {} */

  deleteFileEntry(request: DeleteFileEntryRequest): Observable<DeleteFileEntryResponse>;
}

export interface StorageServiceController {
  createSignedUrl(
    request: CreateSignedUrlRequest,
  ): Promise<CreateSignedUrlResponse> | Observable<CreateSignedUrlResponse> | CreateSignedUrlResponse;

  checkFileExists(
    request: CheckFileExistsRequest,
  ): Promise<CheckFileExistsResponse> | Observable<CheckFileExistsResponse> | CheckFileExistsResponse;

  insertFileEntry(
    request: InsertFileEntryRequest,
  ): Promise<InsertFileEntryResponse> | Observable<InsertFileEntryResponse> | InsertFileEntryResponse;

  getFileEntry(
    request: GetFileEntryRequest,
  ): Promise<GetFileEntryResponse> | Observable<GetFileEntryResponse> | GetFileEntryResponse;

  /** rpc UpdateFileEntry(UpdateFileEntryRequest) returns (UpdateFileEntryResponse) {} */

  deleteFileEntry(
    request: DeleteFileEntryRequest,
  ): Promise<DeleteFileEntryResponse> | Observable<DeleteFileEntryResponse> | DeleteFileEntryResponse;
}

export function StorageServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createSignedUrl",
      "checkFileExists",
      "insertFileEntry",
      "getFileEntry",
      "deleteFileEntry",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("StorageService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("StorageService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const STORAGE_SERVICE_NAME = "StorageService";
