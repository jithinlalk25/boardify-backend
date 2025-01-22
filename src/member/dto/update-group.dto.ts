import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateGroupDto {
  @IsMongoId()
  groupId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  name: string;
}
