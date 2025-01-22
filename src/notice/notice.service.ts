import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notice, NoticeDocument } from './schemas/notice.schema';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { DashboardService } from '../dashboard/dashboard.service';

@Injectable()
export class NoticeService {
  constructor(
    @InjectModel(Notice.name) private noticeModel: Model<NoticeDocument>,
    private readonly dashboardService: DashboardService,
  ) {}

  async create(
    createNoticeDto: CreateNoticeDto,
    instituteId: Types.ObjectId,
  ): Promise<Notice> {
    const notice = new this.noticeModel({
      ...createNoticeDto,
      instituteId,
    });
    await this.dashboardService.incrementNoticeCount(instituteId);
    return notice.save();
  }

  async findAll(instituteId: Types.ObjectId): Promise<Notice[]> {
    return this.noticeModel
      .find({ instituteId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(
    noticeId: string,
    instituteId: Types.ObjectId,
  ): Promise<Notice> {
    const notice = await this.noticeModel
      .findOne({
        _id: new Types.ObjectId(noticeId),
        instituteId,
      })
      .exec();

    if (!notice) {
      throw new NotFoundException('Notice not found');
    }
    return notice;
  }

  async delete(noticeId: string, instituteId: Types.ObjectId): Promise<Notice> {
    const deletedNotice = await this.noticeModel
      .findOneAndDelete({
        _id: new Types.ObjectId(noticeId),
        instituteId,
      })
      .exec();

    if (!deletedNotice) {
      throw new NotFoundException('Notice not found');
    }

    await this.dashboardService.decrementNoticeCount(instituteId);
    return deletedNotice;
  }

  async update(
    noticeId: string,
    updateNoticeDto: UpdateNoticeDto,
    instituteId: Types.ObjectId,
  ): Promise<Notice> {
    const updatedNotice = await this.noticeModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(noticeId),
          instituteId,
        },
        { $set: updateNoticeDto },
        { new: true },
      )
      .exec();

    if (!updatedNotice) {
      throw new NotFoundException('Notice not found');
    }
    return updatedNotice;
  }
}
