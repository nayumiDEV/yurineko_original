import { Taxonomy as PrismaTaxonomy } from "@prisma/client";
import { Field, ObjectType, Directive, ID, GraphQLISODateTime } from "@nestjs/graphql";

@ObjectType()
@Directive('@key(fields: "mId")')
export class Taxonomy implements PrismaTaxonomy {
  @Field(type => ID)
  mId: number
  @Field(type => String)
  mType: string
  @Field(type => String)
  mName: string
  @Field(type => String)
  mSlug: string
  @Field(type => String)
  mDescription: string
  @Field(type => GraphQLISODateTime)
  mCreatedAt: Date
  @Field(type => GraphQLISODateTime)
  mModifiedAt: Date
}