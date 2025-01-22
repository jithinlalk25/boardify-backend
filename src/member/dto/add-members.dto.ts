import { IsArray, IsEmail, IsString } from 'class-validator';

export class AddMembersDto {
  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[];

  @IsString()
  type: string;
}
