/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "team";

export interface CreateTeamRequest {
  mName: string;
}

export interface CreateTeamResponse {
  status: number;
  error: string[];
  mId: number;
}

/** UPLOADER SECTION */
export interface TeamMemberPermission {
  pCanCreateManga: boolean;
  pCanEditManga: boolean;
  pCanDeleteManga: boolean;
  pCanCreateChapter: boolean;
  pCanEditChapter: boolean;
  pCanDeleteChapter: boolean;
  pCanManageTeam: boolean;
}

export interface TeamMemberData {
  mId: number;
  mName: string;
  mAvatar: string;
}

export interface TeamSocialLink {
  mType: string;
  mLink: string;
}

export interface UpdateTeamRequestData {
  mName: string;
  mDescription: string;
  mSlug: string;
  mSocialLinks: TeamSocialLink[];
}

export interface UpdateTeamRequest {
  mId: number;
  data: UpdateTeamRequestData | undefined;
}

export interface UpdateTeamResponse {
  status: number;
  error: string[];
}

export interface UploaderGetTeamMemberData {
  memberData: TeamMemberData | undefined;
  permission: TeamMemberPermission | undefined;
}

export interface AddMemberRequest {
  mTeamId: number;
  mUserId: number;
}

export interface AddMemberResponse {
  status: number;
  error: string[];
}

export interface RemoveMemberRequest {
  mTeamId: number;
  mUserId: number;
}

export interface RemoveMemberResponse {
  status: number;
  error: string[];
}

export interface EditMemberPermissionRequest {
  mTeamId: number;
  mUserId: number;
  permission: TeamMemberPermission | undefined;
}

export interface EditMemberPermissionResponse {
  status: number;
  error: string[];
}

export interface FollowTeamRequest {
  mTeamId: number;
  mUserId: number;
}

export interface FollowTeamResponse {
  status: number;
  error: string[];
}

export interface SubscribeTeamRequest {
  mTeamId: number;
  mUserId: number;
}

export interface SubscribeTeamResponse {
  status: number;
  error: string[];
}

/** GET TEAM BY RELATED MORPH */
export interface GetTeamByRelatedData {
  mSlug: string;
  mName: string;
}

export interface GetTeamByRelatedMorphRequest {
  mRelatedType: string;
  mRelatedId: number;
}

export interface GetTeamByRelatedMorphResponse {
  status: number;
  error: string[];
  data: GetTeamByRelatedData | undefined;
}

export interface GetTeamByMemberIdRequest {
  mMemberId: number;
}

export interface GetTeamByMemberIdResponse {
  status: number;
  error: string[];
  data: GetTeamByRelatedData | undefined;
}

export interface GetTeamSubscribersRequest {
  mTeamId: number;
}

export interface GetTeamSubscribersResponse {
  status: number;
  error: string[];
  data: number[];
}

export interface TeamGetByIdsRequest {
  mIds: number[];
}

export interface TeamGetByIdsResponse {
  status: number;
  error: string[];
  data: GetTeamByRelatedData[];
}

export interface TeamGetMemberPermissionRequest {
  mTeamId: number;
  mUserId: number;
}

export interface TeamGetMemberPermissionResponse {
  status: number;
  error: string[];
  data: TeamMemberPermission | undefined;
}

export const TEAM_PACKAGE_NAME = "team";

export interface TeamServiceClient {
  /** ADMIN SECTION */

  createTeam(request: CreateTeamRequest): Observable<CreateTeamResponse>;

  /** UPLOADER SECTION */

  updateTeam(request: UpdateTeamRequest): Observable<UpdateTeamResponse>;

  addMember(request: AddMemberRequest): Observable<AddMemberResponse>;

  removeMember(request: RemoveMemberRequest): Observable<RemoveMemberResponse>;

  editMemberPermission(request: EditMemberPermissionRequest): Observable<EditMemberPermissionResponse>;

  /** USER SECTION */

  followTeam(request: FollowTeamRequest): Observable<FollowTeamResponse>;

  subscribeTeam(request: SubscribeTeamRequest): Observable<SubscribeTeamResponse>;

  getTeamByMemberId(request: GetTeamByMemberIdRequest): Observable<GetTeamByMemberIdResponse>;

  /** INTER-SERVICE SECTION */

  getTeamSubscribers(request: GetTeamSubscribersRequest): Observable<GetTeamSubscribersResponse>;

  getByIds(request: TeamGetByIdsRequest): Observable<TeamGetByIdsResponse>;

  getTeamByRelatedMorph(request: GetTeamByRelatedMorphRequest): Observable<GetTeamByRelatedMorphResponse>;

  getTeamMemberPermission(request: TeamGetMemberPermissionRequest): Observable<TeamGetMemberPermissionResponse>;
}

export interface TeamServiceController {
  /** ADMIN SECTION */

  createTeam(
    request: CreateTeamRequest,
  ): Promise<CreateTeamResponse> | Observable<CreateTeamResponse> | CreateTeamResponse;

  /** UPLOADER SECTION */

  updateTeam(
    request: UpdateTeamRequest,
  ): Promise<UpdateTeamResponse> | Observable<UpdateTeamResponse> | UpdateTeamResponse;

  addMember(request: AddMemberRequest): Promise<AddMemberResponse> | Observable<AddMemberResponse> | AddMemberResponse;

  removeMember(
    request: RemoveMemberRequest,
  ): Promise<RemoveMemberResponse> | Observable<RemoveMemberResponse> | RemoveMemberResponse;

  editMemberPermission(
    request: EditMemberPermissionRequest,
  ): Promise<EditMemberPermissionResponse> | Observable<EditMemberPermissionResponse> | EditMemberPermissionResponse;

  /** USER SECTION */

  followTeam(
    request: FollowTeamRequest,
  ): Promise<FollowTeamResponse> | Observable<FollowTeamResponse> | FollowTeamResponse;

  subscribeTeam(
    request: SubscribeTeamRequest,
  ): Promise<SubscribeTeamResponse> | Observable<SubscribeTeamResponse> | SubscribeTeamResponse;

  getTeamByMemberId(
    request: GetTeamByMemberIdRequest,
  ): Promise<GetTeamByMemberIdResponse> | Observable<GetTeamByMemberIdResponse> | GetTeamByMemberIdResponse;

  /** INTER-SERVICE SECTION */

  getTeamSubscribers(
    request: GetTeamSubscribersRequest,
  ): Promise<GetTeamSubscribersResponse> | Observable<GetTeamSubscribersResponse> | GetTeamSubscribersResponse;

  getByIds(
    request: TeamGetByIdsRequest,
  ): Promise<TeamGetByIdsResponse> | Observable<TeamGetByIdsResponse> | TeamGetByIdsResponse;

  getTeamByRelatedMorph(
    request: GetTeamByRelatedMorphRequest,
  ): Promise<GetTeamByRelatedMorphResponse> | Observable<GetTeamByRelatedMorphResponse> | GetTeamByRelatedMorphResponse;

  getTeamMemberPermission(
    request: TeamGetMemberPermissionRequest,
  ):
    | Promise<TeamGetMemberPermissionResponse>
    | Observable<TeamGetMemberPermissionResponse>
    | TeamGetMemberPermissionResponse;
}

export function TeamServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createTeam",
      "updateTeam",
      "addMember",
      "removeMember",
      "editMemberPermission",
      "followTeam",
      "subscribeTeam",
      "getTeamByMemberId",
      "getTeamSubscribers",
      "getByIds",
      "getTeamByRelatedMorph",
      "getTeamMemberPermission",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("TeamService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("TeamService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const TEAM_SERVICE_NAME = "TeamService";
