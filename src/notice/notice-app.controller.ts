import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { MemberGuard } from 'src/auth/guards/member.guard';
import { Request } from 'express';

@Controller('notice-app')
export class NoticeAppController {
  constructor(private readonly noticeService: NoticeService) {}

  @UseGuards(MemberGuard)
  @Get()
  async findAll(@Req() req: Request) {
    return this.noticeService.findAll(req['member'].instituteId);
  }

  @UseGuards(MemberGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    return this.noticeService.findOne(id, req['member'].instituteId);
  }
}
