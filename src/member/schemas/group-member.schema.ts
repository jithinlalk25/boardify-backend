import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GroupMemberDocument = GroupMember & Document;

@Schema({ timestamps: true })
export class GroupMember {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Group' })
  groupId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Member' })
  memberId: Types.ObjectId;
}

export const GroupMemberSchema = SchemaFactory.createForClass(GroupMember);

// Create a compound index to ensure unique group-member pairs
GroupMemberSchema.index({ groupId: 1, memberId: 1 }, { unique: true });
