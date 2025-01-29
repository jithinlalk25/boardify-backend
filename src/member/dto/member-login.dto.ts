import { IsEmail, IsNotEmpty } from 'class-validator';

export class InitiateMemberLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class VerifyMemberOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  otp: string;
}
