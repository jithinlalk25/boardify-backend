import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export enum InstituteAdminRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
}

export type InstituteAdminDocument = InstituteAdmin & Document;

@Schema({ timestamps: true })
export class InstituteAdmin {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Institute',
    required: true,
  })
  instituteId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Admin', required: true })
  adminId: Types.ObjectId;

  @Prop({ type: String, enum: InstituteAdminRole, required: true })
  role: InstituteAdminRole;
}

export const InstituteAdminSchema =
  SchemaFactory.createForClass(InstituteAdmin);
