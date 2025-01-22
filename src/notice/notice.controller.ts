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
import { AdminRoles } from '../auth/decorators/admin-roles.decorator';
import { InstituteAdminRole } from '../institute/schemas/institute-admin.schema';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() createNoticeDto: CreateNoticeDto, @Req() req: Request) {
    return this.noticeService.create(createNoticeDto, req['institute']._id);
  }

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Get()
  async findAll(@Req() req: Request) {
    return this.noticeService.findAll(req['institute']._id);
  }

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    return this.noticeService.findOne(id, req['institute']._id);
  }

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: Request) {
    return this.noticeService.delete(id, req['institute']._id);
  }

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNoticeDto: UpdateNoticeDto,
    @Req() req: Request,
  ) {
    return this.noticeService.update(id, updateNoticeDto, req['institute']._id);
  }
}
