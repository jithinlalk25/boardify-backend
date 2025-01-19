import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('admin')
export class AdminController {
  @Get('me')
  @UseGuards(AdminGuard)
  async getAdminDetails(@Request() req) {
    return {
      admin: req.admin,
      institute: req.institute,
      instituteAdmin: req.instituteAdmin,
    };
  }
}
