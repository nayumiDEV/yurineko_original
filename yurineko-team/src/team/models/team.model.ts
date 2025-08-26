import { Directive, Field, GraphQLISODateTime, ID, ObjectType } from "@nestjs/graphql";
import { Prisma, Team as PrismaTeam } from "@prisma/client";
import GraphQLJSON from "graphql-type-json";

@ObjectType()
@Directive('@key(fields: "mId")')
export class Team implements PrismaTeam {
  @Field(type => ID)
  mId: number;
  @Field(type => String)
  mName: string;
  @Field(type => String)
  mDescription: string;
  @Field(type => String, { nullable: true })
  mAvatar: string | null;
  @Field(type => String, { nullable: true })
  mCover: string | null;
  @Field(type => Boolean)
  mIsActive: boolean;
  @Field(type => String)
  mSlug: string;
  @Field(type => GraphQLJSON, { nullable: true })
  mSocialLinks: Prisma.JsonValue | null;
  @Field(type => GraphQLISODateTime)
  mCreatedAt: Date;
  @Field(type => GraphQLISODateTime, { nullable: true })
  mModifiedAt: Date | null;
  @Field(type => Number)
  mFollowCount: number;
} 