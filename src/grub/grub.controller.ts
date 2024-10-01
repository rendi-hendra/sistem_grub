import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
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
} from '../model/grub.model';
import { User } from '@prisma/client';
import { Auth } from '../common/auth.decorator';
import { GrubGuard } from 'src/common/grub.guard';

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
  @UseGuards(GrubGuard)
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
}
