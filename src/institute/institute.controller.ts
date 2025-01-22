import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { InstituteService } from './institute.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Request } from 'express';
import { AdminRoles } from '../auth/decorators/admin-roles.decorator';
import { InstituteAdminRole } from './schemas/institute-admin.schema';

@Controller('institute')
export class InstituteController {
  constructor(private readonly instituteService: InstituteService) {}

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Get()
  async getInstitute(@Req() req: Request) {
    // ... existing code ...
  }
}
