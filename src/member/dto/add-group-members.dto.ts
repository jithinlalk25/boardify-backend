import { IsArray, IsEmail, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class AddGroupMembersDto {
  @IsMongoId()
  groupId: Types.ObjectId;

  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[];
}
