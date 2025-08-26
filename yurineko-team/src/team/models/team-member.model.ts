import { Directive, Field, ID, ObjectType } from "@nestjs/graphql";
import { Prisma } from "@prisma/client";
import GraphQLJSON from "graphql-type-json";
import { FindUserData as FindUserByIdsData } from "src/user/user.pb";

export class TeamMemberPermission {
  pCanCreateManga: boolean;
  pCanEditManga: boolean;
  pCanDeleteManga: boolean;
  pCanCreateChapter: boolean;
  pCanEditChapter: boolean;
  pCanDeleteChapter: boolean;
  pCanManageTeam: boolean;
}

@ObjectType()
export class TeamMemberInfo implements FindUserByIdsData {
  mId: number;
  @Field(type => String)
  mName: string;
  @Field(type => String)
  mUsername: string;
  @Field(type => String)
  mAvatar: string;
}

@ObjectType()
@Directive('@key(fields: "mTeamId mMemberId")')
export class TeamMember {
  @Field(type => ID)
  mMemberId: number;

  mTeamId: number;
}