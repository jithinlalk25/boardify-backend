import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NoticeViewDocument = NoticeView & Document;

@Schema({ timestamps: true })
export class NoticeView {
  @Prop({ type: Types.ObjectId, required: true })
  noticeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  memberId: Types.ObjectId;
}

export const NoticeViewSchema = SchemaFactory.createForClass(NoticeView);

// Create a compound index to ensure a member can only view a notice once
NoticeViewSchema.index({ noticeId: 1, memberId: 1 }, { unique: true });
