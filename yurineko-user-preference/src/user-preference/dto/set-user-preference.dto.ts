import { IsInt, IsBoolean, IsNotEmpty, IsNotEmptyObject } from "class-validator";
import { SetUserPreferenceRequest, UserNotificationPreference, UserPreference } from "../user-preference.pb";

class UserNotificationPreferenceDto implements UserNotificationPreference {
  @IsBoolean()
  generalMessage: boolean;
  @IsBoolean()
  mangaFollowingNewChapter: boolean;
  @IsBoolean()
  teamFollowingNewManga: boolean;
  @IsBoolean()
  teamMangaNewComment: boolean;
  @IsBoolean()
  commentReply: boolean;
  @IsBoolean()
  commentReaction: boolean;
  @IsBoolean()
  commentMention: boolean;
  @IsBoolean()
  teamNewReport: boolean;
}

export class UserPreferenceDto implements UserPreference {
  @IsNotEmptyObject()
  notification: UserNotificationPreferenceDto;
}

export class SetUserPreferenceDto implements SetUserPreferenceRequest {
  @IsNotEmpty()
  @IsInt()
  mUserId: number;

  @IsNotEmptyObject()
  mUserReference: UserPreferenceDto;
}