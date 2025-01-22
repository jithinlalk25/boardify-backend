import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstituteController } from './institute.controller';
import { InstituteService } from './institute.service';
import { Institute, InstituteSchema } from './schemas/institute.schema';
import {
  InstituteAdmin,
  InstituteAdminSchema,
} from './schemas/institute-admin.schema';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Institute.name, schema: InstituteSchema },
      { name: InstituteAdmin.name, schema: InstituteAdminSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    forwardRef(() => AdminModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [InstituteController],
  providers: [InstituteService],
  exports: [InstituteService],
})
export class InstituteModule {}
