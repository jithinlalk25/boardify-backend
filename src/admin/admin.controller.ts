import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminRoles } from '../auth/decorators/admin-roles.decorator';
import { InstituteAdminRole } from '../institute/schemas/institute-admin.schema';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('me')
  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  async getAdminDetails(@Request() req) {
    return {
      admin: req.admin,
      institute: req.institute,
      instituteAdmin: req.instituteAdmin,
    };
  }

  @Get('admins')
  @UseGuards(AdminGuard)
  async findByInstituteId(@Request() req) {
    return this.adminService.findByInstituteId(req.institute._id);
  }

  @Post('admin')
  @UseGuards(AdminGuard)
  async create(@Request() req, @Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto, req.institute._id);
  }

  @Patch('admin/:id')
  @UseGuards(AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete('admin/:id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string) {
    await this.adminService.delete(id);
    return { message: 'Admin deleted successfully' };
  }
}
