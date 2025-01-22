import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { AdminModule } from '../admin/admin.module';
import { InstituteModule } from '../institute/institute.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Dashboard, DashboardSchema } from './schemas/dashboard.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dashboard.name, schema: DashboardSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
    AdminModule,
    InstituteModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
