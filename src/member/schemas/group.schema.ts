import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Institute' })
  instituteId: Types.ObjectId;

  @Prop({ default: 0 })
  memberCount: number;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
