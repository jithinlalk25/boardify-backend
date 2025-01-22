import { SetMetadata } from '@nestjs/common';
import { InstituteAdminRole } from '../../institute/schemas/institute-admin.schema';

export const ADMIN_ROLES_KEY = 'admin_roles';
export const AdminRoles = (...roles: InstituteAdminRole[]) =>
  SetMetadata(ADMIN_ROLES_KEY, roles);
