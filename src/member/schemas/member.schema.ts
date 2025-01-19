import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum MemberType {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  STAFF = 'STAFF',
}

export type MemberDocument = Member & Document;

@Schema({ timestamps: true })
export class Member {
  @Prop({ required: true, index: true })
  email: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Institute' })
  instituteId: Types.ObjectId;

  @Prop({ required: true, type: String, enum: MemberType })
  type: MemberType;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
MemberSchema.index({ email: 'text' });
