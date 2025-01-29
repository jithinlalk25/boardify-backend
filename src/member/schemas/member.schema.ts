import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export const MemberType = {
  '678cd9c2101bd565c074b2b6': {
    STUDENT: 'STUDENT',
    TEACHER: 'TEACHER',
    STAFF: 'STAFF',
  },
};

export type MemberDocument = Member & Document;

@Schema({ _id: false })
class Metadata {
  @Prop({ type: String, default: null })
  expoPushToken: string | null;
}

@Schema({ timestamps: true })
export class Member {
  @Prop({ required: true, index: true })
  email: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Institute' })
  instituteId: Types.ObjectId;

  @Prop({ type: Metadata, default: () => ({}) })
  metadata: Metadata;

  @Prop({ required: true })
  type: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
MemberSchema.index({ email: 'text' });
