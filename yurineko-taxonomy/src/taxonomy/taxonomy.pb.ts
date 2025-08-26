/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "taxonomy";

export interface TaxonomyData {
  mName: string;
  mSlug: string;
  mDescription: string;
}

export interface TaxonomyCreateRequest {
  mType: string;
  mName: string;
  mSlug: string;
  mDescription: string;
}

export interface TaxonomyCreateResponse {
  status: number;
  error: string[];
  mId: number;
}

export interface TaxonomyUpdateRequest {
  mId: number;
  data: TaxonomyData | undefined;
}

export interface TaxonomyUpdateResponse {
  status: number;
  error: string[];
}

export interface TaxonomyDeleteRequest {
  mId: number;
}

export interface TaxonomyDeleteResponse {
  status: number;
  error: string[];
}

export interface TaxonomyGetByIdsRequest {
  mIds: number[];
}

export interface GetByIdsTaxonomyData {
  mId: number;
  mSlug: string;
  mName: string;
  mType: string;
}

export interface TaxonomyGetByIdsResponse {
  status: number;
  error: string[];
  data: GetByIdsTaxonomyData[];
}

export const TAXONOMY_PACKAGE_NAME = "taxonomy";

export interface TaxonomyServiceClient {
  create(request: TaxonomyCreateRequest): Observable<TaxonomyCreateResponse>;

  update(request: TaxonomyUpdateRequest): Observable<TaxonomyUpdateResponse>;

  delete(request: TaxonomyDeleteRequest): Observable<TaxonomyDeleteResponse>;

  getByIds(request: TaxonomyGetByIdsRequest): Observable<TaxonomyGetByIdsResponse>;
}

export interface TaxonomyServiceController {
  create(
    request: TaxonomyCreateRequest,
  ): Promise<TaxonomyCreateResponse> | Observable<TaxonomyCreateResponse> | TaxonomyCreateResponse;

  update(
    request: TaxonomyUpdateRequest,
  ): Promise<TaxonomyUpdateResponse> | Observable<TaxonomyUpdateResponse> | TaxonomyUpdateResponse;

  delete(
    request: TaxonomyDeleteRequest,
  ): Promise<TaxonomyDeleteResponse> | Observable<TaxonomyDeleteResponse> | TaxonomyDeleteResponse;

  getByIds(
    request: TaxonomyGetByIdsRequest,
  ): Promise<TaxonomyGetByIdsResponse> | Observable<TaxonomyGetByIdsResponse> | TaxonomyGetByIdsResponse;
}

export function TaxonomyServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["create", "update", "delete", "getByIds"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("TaxonomyService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("TaxonomyService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const TAXONOMY_SERVICE_NAME = "TaxonomyService";
