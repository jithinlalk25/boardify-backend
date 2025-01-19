import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { AddMembersDto } from './dto/add-members.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Request } from 'express';
import { GetMembersDto } from './dto/get-members.dto';
import { DeleteMembersDto } from './dto/delete-members.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Delete()
  @UseGuards(AdminGuard)
  async deleteMembers(
    @Body() deleteMembersDto: DeleteMembersDto,
    @Req() req: Request,
  ) {
    return this.memberService.deleteMembers(
      deleteMembersDto.memberIds,
      req['institute']._id,
    );
  }

  @Get()
  @UseGuards(AdminGuard)
  async getMembers(@Query() query: GetMembersDto, @Req() req: Request) {
    return this.memberService.getMembers(
      req['institute']._id,
      query.page,
      query.type,
      query.search,
    );
  }

  @Post('addMembers')
  @UseGuards(AdminGuard)
  async addMembers(@Body() addMembersDto: AddMembersDto, @Req() req: Request) {
    return this.memberService.addMembers(
      addMembersDto.emails,
      req['institute']._id,
      addMembersDto.type,
    );
  }
}
