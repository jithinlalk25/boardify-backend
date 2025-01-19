import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Member, MemberDocument, MemberType } from './schemas/member.schema';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
  ) {}

  async addMembers(
    emails: string[],
    instituteId: Types.ObjectId,
    type: MemberType,
  ): Promise<Member[]> {
    // Find existing members with these emails in this institute
    const existingMembers = await this.memberModel.find({
      email: { $in: emails },
      instituteId,
    });

    // Filter out emails that already exist
    const existingEmails = existingMembers.map((member) => member.email);
    const newEmails = emails.filter((email) => !existingEmails.includes(email));

    if (newEmails.length === 0) {
      return [];
    }

    const memberDocs = newEmails.map((email) => ({
      email,
      instituteId,
      type,
    }));

    return this.memberModel.create(memberDocs);
  }

  async getMembers(
    instituteId: Types.ObjectId,
    page: number = 1,
    type?: MemberType,
    search?: string,
  ) {
    const limit = 30;
    const skip = (page - 1) * limit;

    const query: any = { instituteId };
    if (type) {
      query.type = type;
    }
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }

    const [members, total] = await Promise.all([
      this.memberModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.memberModel.countDocuments(query),
    ]);

    return {
      members,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteMembers(
    memberIds: Types.ObjectId[],
    instituteId: Types.ObjectId,
  ) {
    const result = await this.memberModel.deleteMany({
      _id: { $in: memberIds },
      instituteId,
    });

    return {
      deletedCount: result.deletedCount,
    };
  }
}
