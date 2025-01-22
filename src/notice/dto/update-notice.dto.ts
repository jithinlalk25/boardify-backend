import { IsString, IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateNoticeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  groupIds?: Types.ObjectId[];
}
