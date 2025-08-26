import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UserNotificationPreference as GrpcUserNotificationPreference, UserPreference as GrpcUserPreference } from "../user-preference.pb";

export type UserPreferenceDocument = HydratedDocument<UserPreference>;

@Schema({ _id: false })
export class UserNotificationPreference implements GrpcUserNotificationPreference {
  @Prop({ default: true })
  generalMessage: boolean;
  @Prop({ default: true })
  mangaFollowingNewChapter: boolean;
  @Prop({ default: true })
  teamFollowingNewManga: boolean;
  @Prop({ default: true })
  teamMangaNewComment: boolean;
  @Prop({ default: true })
  commentReply: boolean;
  @Prop({ default: true })
  commentReaction: boolean;
  @Prop({ default: true })
  commentMention: boolean;
  @Prop({ default: true })
  teamNewReport: boolean;
}

@Schema({ versionKey: false })
export class UserPreference implements GrpcUserPreference {
  @Prop({ required: true, unique: true, index: true })
  mUserId: number;

  @Prop({ type: UserNotificationPreference, required: true })
  notification: GrpcUserNotificationPreference;
}

export const UserPreferenceSchema = SchemaFactory.createForClass(UserPreference)