import { ArrayNotEmpty, IsArray, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class DeleteMembersDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  memberIds: Types.ObjectId[];
}
