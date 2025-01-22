import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DashboardDocument = Dashboard & Document;

@Schema({ timestamps: true })
export class Dashboard {
  @Prop({ type: Types.ObjectId, required: true })
  instituteId: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  noticeCount: number;

  @Prop({ required: true, default: 0 })
  memberCount: number;

  @Prop({ required: true, default: 0 })
  groupCount: number;
}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);
