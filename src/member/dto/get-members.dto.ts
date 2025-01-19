import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { MemberType } from '../schemas/member.schema';

export class GetMembersDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsEnum(MemberType)
  type?: MemberType;

  @IsOptional()
  @IsString()
  search?: string;
}
