import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { AddMembersDto } from './dto/add-members.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AdminRoles } from '../auth/decorators/admin-roles.decorator';
import { InstituteAdminRole } from '../institute/schemas/institute-admin.schema';
import { Request } from 'express';
import { GetMembersDto } from './dto/get-members.dto';
import { DeleteMembersDto } from './dto/delete-members.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { DeleteGroupDto } from './dto/delete-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddGroupMembersDto } from './dto/add-group-members.dto';
import { RemoveGroupMembersDto } from './dto/remove-group-members.dto';
import { GetGroupDto } from './dto/get-group.dto';
import { GetGroupMembersDto } from './dto/get-group-members.dto';
import { Types } from 'mongoose';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Delete()
  async deleteMembers(
    @Body() deleteMembersDto: DeleteMembersDto,
    @Req() req: Request,
  ) {
    return this.memberService.deleteMembers(
      deleteMembersDto.memberIds,
      req['institute']._id,
    );
  }

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Get()
  async getMembers(@Query() query: GetMembersDto, @Req() req: Request) {
    return this.memberService.getMembers(
      req['institute']._id,
      query.page,
      query.type,
      query.search,
    );
  }

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Post('addMembers')
  async addMembers(@Body() addMembersDto: AddMembersDto, @Req() req: Request) {
    return this.memberService.addMembers(
      addMembersDto.emails,
      req['institute']._id,
      addMembersDto.type,
    );
  }

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Post('group')
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: Request,
  ) {
    return this.memberService.createGroup(
      createGroupDto.name,
      req['institute']._id,
    );
  }

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Delete('group')
  async deleteGroup(
    @Body() deleteGroupDto: DeleteGroupDto,
    @Req() req: Request,
  ) {
    return this.memberService.deleteGroup(
      deleteGroupDto.groupId,
      req['institute']._id,
    );
  }

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Put('group')
  async updateGroup(
    @Body() updateGroupDto: UpdateGroupDto,
    @Req() req: Request,
  ) {
    return this.memberService.updateGroup(
      updateGroupDto.groupId,
      updateGroupDto.name,
      req['institute']._id,
    );
  }

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Post('group/members')
  async addGroupMembers(
    @Body() addGroupMembersDto: AddGroupMembersDto,
    @Req() req: Request,
  ) {
    return this.memberService.addGroupMembers(
      addGroupMembersDto.groupId,
      addGroupMembersDto.emails,
      req['institute']._id,
    );
  }

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Delete('group/members')
  async removeGroupMembers(
    @Body() removeGroupMembersDto: RemoveGroupMembersDto,
    @Req() req: Request,
  ) {
    return this.memberService.removeGroupMembers(
      removeGroupMembersDto.groupId,
      removeGroupMembersDto.memberIds,
      req['institute']._id,
    );
  }

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Get('groups')
  async getGroups(@Req() req: Request) {
    return this.memberService.getGroups(req['institute']._id);
  }

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Get('types')
  async getMemberTypes(@Req() req: Request) {
    return this.memberService.getMemberTypes(req['institute']._id);
  }

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Get('group/:groupId')
  async getGroupDetails(@Param() params: GetGroupDto, @Req() req: Request) {
    return this.memberService.getGroupDetails(
      params.groupId,
      req['institute']._id,
    );
  }

  @AdminRoles(InstituteAdminRole.ADMIN)
  @UseGuards(AdminGuard)
  @Get('group/:groupId/members')
  async getGroupMembers(
    @Param('groupId') groupId: string,
    @Query() query: GetGroupMembersDto,
    @Req() req: Request,
  ) {
    return this.memberService.getGroupMembers(
      new Types.ObjectId(groupId),
      req['institute']._id,
      query.page,
      query.search,
      query.type,
    );
  }
}
