import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NoticeDocument = Notice & Document;

@Schema({ timestamps: true })
export class Notice {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, required: true })
  instituteId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], required: true })
  groupIds: Types.ObjectId[];

  @Prop({ default: 0 })
  viewCount: number;
}

export const NoticeSchema = SchemaFactory.createForClass(Notice);
