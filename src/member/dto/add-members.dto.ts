import { IsArray, IsEmail, IsEnum } from 'class-validator';
import { MemberType } from '../schemas/member.schema';

export class AddMembersDto {
  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[];

  @IsEnum(MemberType)
  type: MemberType;
}
