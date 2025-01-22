import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MemberModule } from './member/member.module';
import { AdminModule } from './admin/admin.module';
import { InstituteModule } from './institute/institute.module';
import { NoticeModule } from './notice/notice.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    MemberModule,
    AdminModule,
    InstituteModule,
    NoticeModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
