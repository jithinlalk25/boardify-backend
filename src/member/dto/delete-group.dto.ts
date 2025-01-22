import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class DeleteGroupDto {
  @IsMongoId()
  groupId: Types.ObjectId;
}
