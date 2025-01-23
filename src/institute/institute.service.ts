import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Institute, InstituteDocument } from './schemas/institute.schema';
import {
  InstituteAdmin,
  InstituteAdminDocument,
  InstituteAdminRole,
} from './schemas/institute-admin.schema';

interface CreateInstituteAdminParams {
  adminId: Types.ObjectId;
  instituteId: Types.ObjectId | string;
  role: InstituteAdminRole;
}

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

  async findInstituteAdminsByInstituteId(
    instituteId: string | Types.ObjectId,
  ): Promise<InstituteAdmin[]> {
    return this.instituteAdminModel.find({ instituteId }).exec();
  }

  async createInstituteAdmin(
    params: CreateInstituteAdminParams,
  ): Promise<InstituteAdmin> {
    const instituteAdmin = new this.instituteAdminModel({
      adminId: params.adminId,
      instituteId: params.instituteId,
      role: params.role,
    });

    return instituteAdmin.save();
  }

  async deleteInstituteAdmin(adminId: string | Types.ObjectId): Promise<void> {
    await this.instituteAdminModel.deleteOne({ adminId }).exec();
  }
}
