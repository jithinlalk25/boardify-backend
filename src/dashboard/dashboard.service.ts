import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Dashboard, DashboardDocument } from './schemas/dashboard.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Dashboard.name)
    private readonly dashboardModel: Model<DashboardDocument>,
  ) {}

  async incrementNoticeCount(instituteId: string | Types.ObjectId) {
    return this.dashboardModel.updateOne(
      { instituteId: new Types.ObjectId(instituteId) },
      { $inc: { noticeCount: 1 } },
      { upsert: true },
    );
  }

  async decrementNoticeCount(instituteId: string | Types.ObjectId) {
    return this.dashboardModel.updateOne(
      { instituteId: new Types.ObjectId(instituteId) },
      { $inc: { noticeCount: -1 } },
    );
  }

  async incrementMemberCount(
    instituteId: string | Types.ObjectId,
    count: number = 1,
  ) {
    return this.dashboardModel.updateOne(
      { instituteId: new Types.ObjectId(instituteId) },
      { $inc: { memberCount: count } },
      { upsert: true },
    );
  }

  async decrementMemberCount(
    instituteId: string | Types.ObjectId,
    count: number = 1,
  ) {
    return this.dashboardModel.updateOne(
      { instituteId: new Types.ObjectId(instituteId) },
      { $inc: { memberCount: -count } },
    );
  }

  async incrementGroupCount(instituteId: string | Types.ObjectId) {
    return this.dashboardModel.updateOne(
      { instituteId: new Types.ObjectId(instituteId) },
      { $inc: { groupCount: 1 } },
      { upsert: true },
    );
  }

  async decrementGroupCount(instituteId: string | Types.ObjectId) {
    return this.dashboardModel.updateOne(
      { instituteId: new Types.ObjectId(instituteId) },
      { $inc: { groupCount: -1 } },
    );
  }

  async getDashboardData(instituteId: string | Types.ObjectId) {
    return this.dashboardModel.findOne({
      instituteId: new Types.ObjectId(instituteId),
    });
  }
}
