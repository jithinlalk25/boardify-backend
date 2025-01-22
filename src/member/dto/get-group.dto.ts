import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class GetGroupDto {
  @IsMongoId()
  groupId: Types.ObjectId;
}
