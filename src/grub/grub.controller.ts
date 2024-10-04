import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
import { GrubService } from './grub.service';
import { WebResponse } from '../model/web.model';
import {
  CreateGrubRequest,
  GrubMemberResponse,
  GrubResponse,
  JoinGrubRequest,
  UpdateGrubRequest,
  UpdateRoleRequest,
  UserResponse,
} from '../model/grub.model';
import { User } from '@prisma/client';
import { Auth } from '../common/auth.decorator';
// import { GrubGuard } from 'src/common/grub.guard';
import { Roles } from 'src/common/role.decorator';
import { RoleGuard } from 'src/common/role.guard';

@UseGuards(RoleGuard)
@Controller('/api/grubs')
export class GrubController {
  constructor(private grubService: GrubService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Auth() user: User,
    @Body() request: CreateGrubRequest,
  ): Promise<WebResponse<GrubResponse>> {
    const result = await this.grubService.create(user, request);
    return {
      data: result,
    };
  }

  @Post('/join')
  @HttpCode(201)
  async join(
    @Auth() user: User,
    @Body() request: JoinGrubRequest,
  ): Promise<WebResponse<GrubMemberResponse>> {
    const result = await this.grubService.join(user, request);
    return {
      data: result,
    };
  }

  @Get('/:grub_id/member')
  @HttpCode(200)
  // @UseGuards(GrubGuard)
  async getGrubMember(
    @Auth() user: User,
    @Param('grub_id') grubId: string,
  ): Promise<WebResponse<GrubResponse>> {
    const result = await this.grubService.getGrubMember(user, grubId);

    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async getGrubs(@Auth() user: User): Promise<WebResponse<GrubResponse[]>> {
    const result = await this.grubService.getGrubs(user);
    return {
      data: result,
    };
  }

  @Patch('/:grub_id/role')
  @HttpCode(200)
  @Roles(['admin'])
  async updateRole(
    @Auth() user: User,
    @Param('grub_id') grubId: string,
    @Body() request: UpdateRoleRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.grubService.updateRole(user, grubId, request);
    return {
      data: result,
    };
  }

  @Patch('/:grub_id')
  @HttpCode(200)
  @Roles(['admin'])
  async updateGrub(
    @Auth() user: User,
    @Param('grub_id') grubId: string,
    @Body() request: UpdateGrubRequest,
  ): Promise<WebResponse<GrubResponse>> {
    const result = await this.grubService.updateGrub(user, grubId, request);
    return {
      data: result,
    };
  }

  @Delete('/:grub_id/kick/:user_id')
  @HttpCode(200)
  @Roles(['admin'])
  async kickUser(
    @Auth() user: User,
    @Param('grub_id') grubId: string,
    @Param('user_id') userId: number,
  ): Promise<WebResponse<boolean>> {
    const id = Number(userId);
    await this.grubService.kickUser(user, grubId, id);
    return {
      data: true,
    };
  }

  @Delete('/:grub_id')
  @HttpCode(200)
  async leave(
    @Auth() user: User,
    @Param('grub_id') grubId: string,
  ): Promise<WebResponse<boolean>> {
    await this.grubService.leave(user, grubId);
    return {
      data: true,
    };
  }
}
