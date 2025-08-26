import { Controller, HttpStatus } from '@nestjs/common';
import { AddMemberRequest, AddMemberResponse, CreateTeamRequest, CreateTeamResponse, EditMemberPermissionRequest, EditMemberPermissionResponse, FollowTeamRequest, FollowTeamResponse, GetTeamByMemberIdRequest, GetTeamByMemberIdResponse, GetTeamByRelatedMorphRequest, GetTeamByRelatedMorphResponse, GetTeamSubscribersRequest, GetTeamSubscribersResponse, RemoveMemberRequest, RemoveMemberResponse, SubscribeTeamRequest, SubscribeTeamResponse, TEAM_SERVICE_NAME, TeamGetByIdsRequest, TeamGetByIdsResponse, TeamGetMemberPermissionRequest, TeamGetMemberPermissionResponse, TeamServiceController, UpdateTeamRequest, UpdateTeamResponse, } from './team.pb';
import { TeamService } from './team.service';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { UpdateTeamRelatedMorphDto } from './dto';

@Controller('team')
export class TeamController implements TeamServiceController {
  constructor(
    private readonly teamService: TeamService,
  ) { }

  @GrpcMethod(TEAM_SERVICE_NAME, 'createTeam')
  async createTeam(request: CreateTeamRequest): Promise<CreateTeamResponse> {
    const team = await this.teamService.createTeam(request);
    return {
      status: HttpStatus.CREATED,
      error: [],
      mId: team.mId
    };
  }

  @GrpcMethod(TEAM_SERVICE_NAME, 'followTeam')
  async followTeam(request: FollowTeamRequest): Promise<FollowTeamResponse> {
    await this.teamService.toggleFollowTeam(request.mTeamId, request.mUserId);
    return {
      status: HttpStatus.OK,
      error: [],
    };
  }

  @GrpcMethod(TEAM_SERVICE_NAME, 'subscribeTeam')
  async subscribeTeam(request: SubscribeTeamRequest): Promise<SubscribeTeamResponse> {
    await this.teamService.toggleSubscribeTeam(request.mTeamId, request.mUserId);
    return {
      status: HttpStatus.OK,
      error: [],
    };
  }

  @GrpcMethod(TEAM_SERVICE_NAME, 'getTeamByMemberId')
  async getTeamByMemberId(request: GetTeamByMemberIdRequest): Promise<GetTeamByMemberIdResponse> {
    const teamMember = await this.teamService.getTeamByMemberId(request.mMemberId);
    return {
      status: HttpStatus.OK,
      error: [],
      data: teamMember.team,
    };
  }

  @GrpcMethod(TEAM_SERVICE_NAME, 'getTeamSubscribers')
  async getTeamSubscribers(request: GetTeamSubscribersRequest): Promise<GetTeamSubscribersResponse> {
    const subscribers = await this.teamService.getTeamSubscriberIds(request.mTeamId);
    return {
      status: HttpStatus.OK,
      error: [],
      data: subscribers.map(subscriber => subscriber.mUserId),
    }
  }

  @MessagePattern({ cmd: 'UpdateTeamRelatedMorph' })
  async updateTeamRelatedMorph(@Payload() payload: UpdateTeamRelatedMorphDto) {
    await this.teamService.updateTeamRelatedMorph(payload.mTeamId, payload.mRelatedType, payload.mRelatedId);
  }

  @GrpcMethod(TEAM_SERVICE_NAME, 'getTeamByRelatedMorph')
  async getTeamByRelatedMorph(request: GetTeamByRelatedMorphRequest): Promise<GetTeamByRelatedMorphResponse> {
    const team = await this.teamService.getTeamByRelatedMorph(request.mRelatedType, request.mRelatedId);
    return {
      status: HttpStatus.OK,
      error: [],
      data: team.team,
    }
  }

  @GrpcMethod(TEAM_SERVICE_NAME, 'updateTeam')
  async updateTeam(request: UpdateTeamRequest): Promise<UpdateTeamResponse> {
    await this.teamService.updateTeam(request.mId, request.data);
    return {
      status: HttpStatus.OK,
      error: [],
    };
  }

  @GrpcMethod(TEAM_SERVICE_NAME, 'addMember')
  async addMember(request: AddMemberRequest): Promise<AddMemberResponse> {
    await this.teamService.addMemberToTeam(request.mTeamId, request.mUserId);
    return {
      status: HttpStatus.OK,
      error: [],
    };
  }

  @GrpcMethod(TEAM_SERVICE_NAME, 'removeMember')
  async removeMember(request: RemoveMemberRequest): Promise<RemoveMemberResponse> {
    await this.teamService.removeMemberFromTeam(request.mTeamId, request.mUserId);
    return {
      status: HttpStatus.OK,
      error: [],
    };
  }

  @GrpcMethod(TEAM_SERVICE_NAME, 'editMemberPermission')
  async editMemberPermission(request: EditMemberPermissionRequest): Promise<EditMemberPermissionResponse> {
    await this.teamService.editMemberPermission(request.mTeamId, request.mUserId, request.permission);
    return {
      status: HttpStatus.OK,
      error: [],
    };
  }

  @GrpcMethod(TEAM_SERVICE_NAME, 'getByIds')
  async getByIds(request: TeamGetByIdsRequest): Promise<TeamGetByIdsResponse> {
    const teams = await this.teamService.findByIds(request.mIds);
    return {
      status: HttpStatus.OK,
      error: [],
      data: teams,
    };
  }

  @GrpcMethod(TEAM_SERVICE_NAME, 'getTeamMemberPermission')
  async getTeamMemberPermission(request: TeamGetMemberPermissionRequest): Promise<TeamGetMemberPermissionResponse> {
    const permission = await this.teamService.getMemberPermission(request.mTeamId, request.mUserId);
    return {
      status: HttpStatus.OK,
      error: [],
      data: permission,
    };
  }
}