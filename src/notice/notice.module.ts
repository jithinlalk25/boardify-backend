import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { Notice, NoticeSchema } from './schemas/notice.schema';
import { AuthModule } from '../auth/auth.module';
import { AdminModule } from '../admin/admin.module';
import { InstituteModule } from '../institute/institute.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { NoticeView, NoticeViewSchema } from './schemas/notice-view.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notice.name, schema: NoticeSchema },
      { name: NoticeView.name, schema: NoticeViewSchema },
    ]),
    AuthModule,
    AdminModule,
    InstituteModule,
    DashboardModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [NoticeController],
  providers: [NoticeService],
  exports: [NoticeService],
})
export class NoticeModule {}
