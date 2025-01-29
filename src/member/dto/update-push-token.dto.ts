import { IsString, IsOptional } from 'class-validator';

export class UpdatePushTokenDto {
  @IsString()
  @IsOptional()
  expoPushToken: string | null;
}
