import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Request } from 'express';
import { AdminRoles } from '../auth/decorators/admin-roles.decorator';
import { InstituteAdminRole } from '../institute/schemas/institute-admin.schema';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Get()
  async getDashboardData(@Req() req: Request) {
    return this.dashboardService.getDashboardData(req['institute']._id);
  }
}
