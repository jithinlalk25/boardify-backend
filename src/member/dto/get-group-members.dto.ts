import { IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { MemberType } from '../schemas/member.schema';

export class GetGroupMembersDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(MemberType)
  type?: MemberType;
}
