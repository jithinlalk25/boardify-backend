import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Request } from 'express';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() createNoticeDto: CreateNoticeDto, @Req() req: Request) {
    return this.noticeService.create(createNoticeDto, req['institute']._id);
  }

  @Get()
  @UseGuards(AdminGuard)
  async findAll(@Req() req: Request) {
    return this.noticeService.findAll(req['institute']._id);
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  async findOne(@Param('id') id: string, @Req() req: Request) {
    return this.noticeService.findOne(id, req['institute']._id);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string, @Req() req: Request) {
    return this.noticeService.delete(id, req['institute']._id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateNoticeDto: UpdateNoticeDto,
    @Req() req: Request,
  ) {
    return this.noticeService.update(id, updateNoticeDto, req['institute']._id);
  }
}
