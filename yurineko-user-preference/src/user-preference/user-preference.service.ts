import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPreferenceDto } from './dto';
import { UserPreference, UserPreferenceDocument } from './schemas';

@Injectable()
export class UserPreferenceService {
  constructor(
    @InjectModel(UserPreference.name) private readonly userPreferenceModel: Model<UserPreferenceDocument>,
  ) { }

  /**
   * If the user preference does not exist, create a new one else update the existing one.
   * @param userId 
   * @param userPreference 
   * @returns Altered user preference
   */
  async setUserPreference(userId: number, userPreference: UserPreferenceDto): Promise<UserPreference> {
    return this.userPreferenceModel.findOneAndUpdate({
      mUserId: userId,
    }, userPreference, { upsert: true, new: true }).select({ _id: 0, __v: 0 });
  }

  async initUserPreference(userId: number): Promise<UserPreference> {
    return this.userPreferenceModel.findOneAndUpdate({
      mUserId: userId,
    }, {
      $setOnInsert: {
        notification: {
          generalMessage: true,
          mangaFollowingNewChapter: true,
          teamFollowingNewManga: true,
          teamMangaNewComment: true,
          commentReply: true,
          commentReaction: true,
          commentMention: true,
          teamNewReport: true,
        }
      }
    }, { upsert: true, new: true }).select({ _id: 0, __v: 0 });
  }

  async getUserPreference(userId: number): Promise<UserPreference> {
    return await this.userPreferenceModel.findOne({ mUserId: userId }, { _id: 0, __v: 0 });
  }

  async batchGetUserPreference(userIds: number[]): Promise<UserPreference[]> {
    return await this.userPreferenceModel.find({ mUserId: { $in: userIds } }, { _id: 0, __v: 0 });
  }
}
