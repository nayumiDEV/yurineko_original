import { Args, Int, Parent, Query, ResolveField, ResolveProperty, Resolver, Root } from '@nestjs/graphql';
import { Team, TeamMember, TeamMemberInfo } from './models';
import { TeamService } from './team.service';
import { UserService } from 'src/user/user.service';
import GraphQLJSON from 'graphql-type-json';

@Resolver(of => Team)
export class TeamResolver {
  constructor(
    private readonly teamService: TeamService,
  ) { }

  @Query(returns => [Team])
  async teams() {
    return this.teamService.findAll();
  }

  @Query(returns => Team)
  async findTeamBySlug(@Args('mSlug') mSLug: string) {
    return this.teamService.findBySlug(mSLug);
  }

  @Query(returns => Team)
  async findTeamById(@Args('mId', { type: () => Int }) mId: number) {
    return this.teamService.findById(mId);
  }

  @ResolveField(returns => Boolean)
  async subscribeState(@Root() team: Team) {
    return !!(await this.teamService.getUserSubscribeState(team.mId, 1))
  }

  @ResolveField(returns => Boolean)
  async followState(@Root() team: Team) {
    return !!(await this.teamService.getUserFollowState(team.mId, 1))
  }

  @ResolveField(returns => [TeamMember])
  async members(@Parent() team: Team): Promise<TeamMember[]> {
    return await this.teamService.getTeamMemberIds(team.mId);
  }
}

@Resolver(of => TeamMember)
export class TeamMemberResolver {
  constructor(
    private readonly teamService: TeamService,
    private readonly userService: UserService,
  ) { }

  @ResolveField(returns => TeamMemberInfo)
  async user(@Root() teamMember: TeamMember) {
    return await this.userService.findUserById(teamMember.mMemberId);
  }

  @ResolveField(returns => GraphQLJSON)
  async permission(@Root() teamMember: TeamMember) {
    return await this.teamService.getMemberPermission(teamMember.mTeamId, teamMember.mMemberId);
  }
}