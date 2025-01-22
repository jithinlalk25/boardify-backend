import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { Notice, NoticeSchema } from './schemas/notice.schema';
import { AuthModule } from '../auth/auth.module';
import { AdminModule } from '../admin/admin.module';
import { InstituteModule } from '../institute/institute.module';
import { DashboardModule } from '../dashboard/dashboard.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notice.name, schema: NoticeSchema }]),
    AuthModule,
    AdminModule,
    InstituteModule,
    DashboardModule,
  ],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
