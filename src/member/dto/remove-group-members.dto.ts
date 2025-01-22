import { IsArray, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class RemoveGroupMembersDto {
  @IsMongoId()
  groupId: Types.ObjectId;

  @IsArray()
  @IsMongoId({ each: true })
  memberIds: Types.ObjectId[];
}
