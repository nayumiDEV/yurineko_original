import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { PushSubscription } from "web-push";

export type UserPushDocument = HydratedDocument<UserPush>;

@Schema({ versionKey: false })
export class UserPush {
  @Prop({ required: true, unique: true, index: true })
  mUserId: number;

  @Prop({ type: Array<PushSubscription>, required: true, _id: false, default: [] })
  mData: PushSubscription[];
}

export const UserPushSchema = SchemaFactory.createForClass(UserPush)