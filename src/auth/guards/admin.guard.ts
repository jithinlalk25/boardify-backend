import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AdminService } from '../../admin/admin.service';
import { InstituteService } from '../../institute/institute.service';
import { Document } from 'mongoose';
import { InstituteAdminRole } from '../../institute/schemas/institute-admin.schema';
import { Reflector } from '@nestjs/core';
import { ADMIN_ROLES_KEY } from '../decorators/admin-roles.decorator';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private adminService: AdminService,
    private instituteService: InstituteService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const admin = await this.adminService.findById(payload.adminId);
      if (!admin) {
        throw new UnauthorizedException();
      }

      const instituteAdmin =
        await this.instituteService.findInstituteAdminByAdminId(admin._id);
      if (!instituteAdmin) {
        throw new UnauthorizedException();
      }

      const institute = await this.instituteService.findInstituteById(
        instituteAdmin.instituteId,
      );
      if (!institute) {
        throw new UnauthorizedException();
      }

      // Get roles from decorator
      const requiredRoles =
        this.reflector.getAllAndOverride<InstituteAdminRole[]>(
          ADMIN_ROLES_KEY,
          [context.getHandler(), context.getClass()],
        ) || [];

      // Always allow OWNER role, and check additional roles if specified
      if (
        instituteAdmin.role !== InstituteAdminRole.OWNER &&
        !requiredRoles.includes(instituteAdmin.role)
      ) {
        throw new UnauthorizedException('Insufficient permissions');
      }

      // Attach to request object
      const adminObj = admin instanceof Document ? admin.toObject() : admin;
      const { password, ...adminWithoutPassword } = adminObj;
      request['admin'] = adminWithoutPassword;
      request['instituteAdmin'] = instituteAdmin;
      request['institute'] = institute;

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
