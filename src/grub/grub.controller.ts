import {
  Body,
  Controller,
  HttpCode,
  Post,
  // UseInterceptors,
} from '@nestjs/common';
import { GrubService } from './grub.service';
import { WebResponse } from '../model/web.model';
import { CreateGrubRequest, GrubResponse } from '../model/grub.model';
import { User } from '@prisma/client';
import { Auth } from '../common/auth.decorator';

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
}
