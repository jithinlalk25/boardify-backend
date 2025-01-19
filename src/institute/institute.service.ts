import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Institute, InstituteDocument } from './schemas/institute.schema';
import {
  InstituteAdmin,
  InstituteAdminDocument,
} from './schemas/institute-admin.schema';

@Injectable()
export class InstituteService {
  constructor(
    @InjectModel(Institute.name)
    private instituteModel: Model<InstituteDocument>,
    @InjectModel(InstituteAdmin.name)
    private instituteAdminModel: Model<InstituteAdminDocument>,
  ) {}

  async findInstituteAdminByAdminId(
    adminId: string | Types.ObjectId,
  ): Promise<InstituteAdmin | null> {
    return this.instituteAdminModel.findOne({ adminId }).exec();
  }

  async findInstituteById(
    instituteId: string | Types.ObjectId,
  ): Promise<Institute | null> {
    return this.instituteModel.findById(instituteId).exec();
  }
}
