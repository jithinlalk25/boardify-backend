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

  @Delete()
  @UseGuards(AdminGuard)
  async deleteMembers(
    @Body() deleteMembersDto: DeleteMembersDto,
    @Req() req: Request,
  ) {
    return this.memberService.deleteMembers(
      deleteMembersDto.memberIds,
      req['institute']._id,
    );
  }

  @Get()
  @UseGuards(AdminGuard)
  async getMembers(@Query() query: GetMembersDto, @Req() req: Request) {
    return this.memberService.getMembers(
      req['institute']._id,
      query.page,
      query.type,
      query.search,
    );
  }

  @Post('addMembers')
  @UseGuards(AdminGuard)
  async addMembers(@Body() addMembersDto: AddMembersDto, @Req() req: Request) {
    return this.memberService.addMembers(
      addMembersDto.emails,
      req['institute']._id,
      addMembersDto.type,
    );
  }

  @Post('group')
  @UseGuards(AdminGuard)
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: Request,
  ) {
    return this.memberService.createGroup(
      createGroupDto.name,
      req['institute']._id,
    );
  }

  @Delete('group')
  @UseGuards(AdminGuard)
  async deleteGroup(
    @Body() deleteGroupDto: DeleteGroupDto,
    @Req() req: Request,
  ) {
    return this.memberService.deleteGroup(
      deleteGroupDto.groupId,
      req['institute']._id,
    );
  }

  @Put('group')
  @UseGuards(AdminGuard)
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

  @Post('group/members')
  @UseGuards(AdminGuard)
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

  @Delete('group/members')
  @UseGuards(AdminGuard)
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

  @Get('groups')
  @UseGuards(AdminGuard)
  async getGroups(@Req() req: Request) {
    return this.memberService.getGroups(req['institute']._id);
  }

  @Get('types')
  @UseGuards(AdminGuard)
  async getMemberTypes(@Req() req: Request) {
    return this.memberService.getMemberTypes(req['institute']._id);
  }

  @Get('group/:groupId')
  @UseGuards(AdminGuard)
  async getGroupDetails(@Param() params: GetGroupDto, @Req() req: Request) {
    return this.memberService.getGroupDetails(
      params.groupId,
      req['institute']._id,
    );
  }

  @Get('group/:groupId/members')
  @UseGuards(AdminGuard)
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
