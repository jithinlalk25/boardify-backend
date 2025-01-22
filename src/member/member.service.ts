import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Member, MemberDocument, MemberType } from './schemas/member.schema';
import { Group, GroupDocument } from './schemas/group.schema';
import {
  GroupMember,
  GroupMemberDocument,
} from './schemas/group-member.schema';
import { DashboardService } from '../dashboard/dashboard.service';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(GroupMember.name)
    private groupMemberModel: Model<GroupMemberDocument>,
    private readonly dashboardService: DashboardService,
  ) {}

  async createGroup(name: string, instituteId: Types.ObjectId): Promise<Group> {
    const group = await this.groupModel.create({ name, instituteId });
    await this.dashboardService.incrementGroupCount(instituteId);
    return group;
  }

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

    const createdMembers = await this.memberModel.create(memberDocs);
    await this.dashboardService.incrementMemberCount(
      instituteId,
      newEmails.length,
    );
    return createdMembers;
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

    if (result.deletedCount > 0) {
      await this.dashboardService.decrementMemberCount(
        instituteId,
        result.deletedCount,
      );
    }

    return {
      deletedCount: result.deletedCount,
    };
  }

  async deleteGroup(groupId: Types.ObjectId, instituteId: Types.ObjectId) {
    // Delete group members first
    await this.groupMemberModel.deleteMany({ groupId });

    // Delete the group
    const result = await this.groupModel.deleteOne({
      _id: groupId,
      instituteId,
    });

    if (result.deletedCount > 0) {
      await this.dashboardService.decrementGroupCount(instituteId);
    }

    return { deleted: result.deletedCount > 0 };
  }

  async updateGroup(
    groupId: Types.ObjectId,
    name: string,
    instituteId: Types.ObjectId,
  ) {
    const result = await this.groupModel.findOneAndUpdate(
      { _id: groupId, instituteId },
      { name },
      { new: true },
    );

    return result;
  }

  async addGroupMembers(
    groupId: Types.ObjectId,
    emails: string[],
    instituteId: Types.ObjectId,
  ) {
    // First verify the group exists and belongs to the institute
    const group = await this.groupModel.findOne({ _id: groupId, instituteId });
    if (!group) {
      return { added: 0 };
    }

    // Get member IDs from the emails
    const members = await this.memberModel.find({
      email: { $in: emails },
      instituteId,
    });

    if (members.length === 0) {
      return { added: 0 };
    }

    // Filter out members that are already in the group
    const existingMembers = await this.groupMemberModel.find({
      groupId,
      memberId: { $in: members.map((m) => m._id) },
    });

    const existingMemberIds = existingMembers.map((m) => m.memberId.toString());
    const newMembers = members.filter(
      (m) => !existingMemberIds.includes(m._id.toString()),
    );

    if (newMembers.length === 0) {
      return { added: 0 };
    }

    // Create new group members
    const groupMembers = await this.groupMemberModel.create(
      newMembers.map((member) => ({
        groupId: group._id,
        memberId: member._id,
      })),
    );

    return { added: groupMembers.length };
  }

  async getGroups(instituteId: Types.ObjectId) {
    return this.groupModel.find({ instituteId }).sort({ createdAt: -1 }).lean();
  }

  async getGroupDetails(groupId: Types.ObjectId, instituteId: Types.ObjectId) {
    // Get the group details
    const group = await this.groupModel.findOne({ _id: groupId, instituteId });
    if (!group) {
      return null;
    }

    return group;
  }

  async removeGroupMembers(
    groupId: Types.ObjectId,
    memberIds: Types.ObjectId[],
    instituteId: Types.ObjectId,
  ) {
    const groupObjectId = new Types.ObjectId(groupId);
    const memberObjectIds = memberIds.map((id) => new Types.ObjectId(id));

    // Verify the group exists and belongs to the institute
    const group = await this.groupModel.findOne({
      _id: groupObjectId,
      instituteId,
    });
    if (!group) {
      return { removed: 0 };
    }

    // Remove the members from the group
    const result = await this.groupMemberModel.deleteMany({
      groupId: groupObjectId,
      memberId: { $in: memberObjectIds },
    });

    return { removed: result.deletedCount };
  }

  async getGroupMembers(
    groupId: Types.ObjectId,
    instituteId: Types.ObjectId,
    page: number = 1,
    search?: string,
    type?: MemberType,
  ) {
    const limit = 30;
    const skip = (page - 1) * limit;

    // Verify the group exists and belongs to the institute
    const group = await this.groupModel.findOne({ _id: groupId, instituteId });
    if (!group) {
      return null;
    }

    const query: any = { groupId };
    let memberQuery: any = {};

    if (search) {
      memberQuery.email = { $regex: search, $options: 'i' };
    }
    if (type) {
      memberQuery.type = type;
    }

    const [groupMembers, total] = await Promise.all([
      this.groupMemberModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'memberId',
          match: memberQuery,
          model: this.memberModel,
        })
        .lean(),
      this.groupMemberModel.countDocuments(query),
    ]);

    // Filter out any members that didn't match the search query or type filter
    const members = groupMembers
      .filter((gm) => gm.memberId)
      .map((gm) => gm.memberId);

    // Adjust total count for search/type filters
    const filteredTotal = members.length;
    const totalPages = Math.ceil(filteredTotal / limit);

    return {
      members,
      total: filteredTotal,
      page,
      totalPages,
    };
  }
}
