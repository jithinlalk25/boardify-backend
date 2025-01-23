import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcrypt';
import { InstituteService } from '../institute/institute.service';
import { InstituteAdminRole } from '../institute/schemas/institute-admin.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private readonly instituteService: InstituteService,
  ) {}

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminModel.findOne({ email }).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<Admin | null> {
    return this.adminModel.findById(id).exec();
  }

  async findByInstituteId(
    instituteId: string | Types.ObjectId,
  ): Promise<(Omit<Admin, 'password'> & { role: InstituteAdminRole })[]> {
    const instituteAdmins =
      await this.instituteService.findInstituteAdminsByInstituteId(instituteId);
    const adminIds = instituteAdmins.map((ia) => ia.adminId);
    const admins = await this.adminModel
      .find({ _id: { $in: adminIds } })
      .lean()
      .exec();

    // Combine admin data with their roles
    return admins.map((admin) => {
      const instituteAdmin = instituteAdmins.find(
        (ia) => ia.adminId.toString() === admin._id.toString(),
      );
      return {
        ...admin,
        role: instituteAdmin.role,
      };
    });
  }

  async create(
    createAdminDto: CreateAdminDto,
    instituteId: string | Types.ObjectId,
  ): Promise<Omit<Admin, 'password'>> {
    const existingAdmin = await this.findByEmail(createAdminDto.email);
    if (existingAdmin) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = createAdminDto.password; // await bcrypt.hash(createAdminDto.password, 10);

    const admin = new this.adminModel({
      email: createAdminDto.email,
      password: hashedPassword,
      name: createAdminDto.name,
    });

    const savedAdmin = await admin.save();

    // Create InstituteAdmin entry
    await this.instituteService.createInstituteAdmin({
      adminId: savedAdmin._id,
      instituteId: instituteId,
      role: InstituteAdminRole.ADMIN,
    });

    const adminObject = savedAdmin.toObject();
    const { password, ...result } = adminObject;
    return result;
  }

  async update(
    adminId: string,
    updateAdminDto: UpdateAdminDto,
  ): Promise<Omit<Admin, 'password'>> {
    if (!updateAdminDto.name && !updateAdminDto.password) {
      throw new BadRequestException(
        'At least one field (name or password) must be provided',
      );
    }

    const admin = await this.findById(adminId);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const updateData: Partial<Admin> = {};

    if (updateAdminDto.name) {
      updateData.name = updateAdminDto.name;
    }

    if (updateAdminDto.password) {
      updateData.password = updateAdminDto.password;
    }

    const updatedAdmin = await this.adminModel
      .findByIdAndUpdate(adminId, updateData, { new: true })
      .exec();

    const adminObject = updatedAdmin.toObject();
    const { password, ...result } = adminObject;
    return result;
  }

  async delete(adminId: string): Promise<void> {
    const admin = await this.findById(adminId);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Delete InstituteAdmin entry first
    await this.instituteService.deleteInstituteAdmin(adminId);

    // Then delete the admin
    await this.adminModel.findByIdAndDelete(adminId).exec();
  }
}
