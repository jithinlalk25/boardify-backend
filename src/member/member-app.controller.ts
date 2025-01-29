import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MemberService } from './member.service';
import {
  InitiateMemberLoginDto,
  VerifyMemberOtpDto,
} from './dto/member-login.dto';
import { MemberGuard } from '../auth/guards/member.guard';
import { UpdatePushTokenDto } from './dto/update-push-token.dto';

@Controller('member-app')
export class MemberAppController {
  constructor(private readonly memberService: MemberService) {}

  @Post('login/initiate')
  async initiateLogin(@Body() dto: InitiateMemberLoginDto) {
    return this.memberService.initiateLogin(dto.email);
  }

  @Post('login/verify')
  async verifyOtp(@Body() dto: VerifyMemberOtpDto) {
    return this.memberService.verifyOtp(dto.email, dto.otp);
  }

  @Get('me')
  @UseGuards(MemberGuard)
  async getProfile(@Request() req) {
    return req.member;
  }

  @Post('push-token')
  @UseGuards(MemberGuard)
  async updatePushToken(@Request() req, @Body() dto: UpdatePushTokenDto) {
    return this.memberService.updatePushToken(
      req.member._id,
      dto.expoPushToken,
    );
  }
}
