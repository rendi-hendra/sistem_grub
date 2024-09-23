import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { GrubValidation } from './grub.validation';
import { v4 as uuid } from 'uuid';
import {
  CreateGrubRequest,
  GrubMemberResponse,
  GrubResponse,
  JoinGrubRequest,
} from 'src/model/grub.model';
import { User } from '@prisma/client';

@Injectable()
export class GrubService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async create(user: User, request: CreateGrubRequest): Promise<GrubResponse> {
    this.logger.debug(`Create new grub ${JSON.stringify(request)}`);

    const createRequest: CreateGrubRequest = this.validationService.validate(
      GrubValidation.CREATE,
      request,
    );

    const result = await this.prismaService.$transaction(async (prisma) => {
      const grub = await prisma.grub.create({
        data: {
          grub_id: uuid(),
          name: createRequest.name,
          total_users: 1,
        },
      });

      await prisma.grubMember.create({
        data: {
          grub_id: grub.grub_id,
          user_id: user.id,
          role_id: 1,
        },
      });

      const totalUser = await this.prismaService.grub.count({
        where: {
          id: grub.id,
        },
      });

      return {
        id: grub.id,
        grub_id: grub.grub_id,
        name: grub.name,
        total_users: totalUser,
      };
    });

    return result;
  }

  async join(
    user: User,
    request: JoinGrubRequest,
  ): Promise<GrubMemberResponse> {
    this.logger.debug(`Join new grub ${JSON.stringify(request)}`);

    const joinRequest: JoinGrubRequest = this.validationService.validate(
      GrubValidation.JOIN,
      request,
    );

    const grub = await this.prismaService.grub.findFirst({
      where: {
        grub_id: joinRequest.grub_id,
      },
    });

    if (!grub) {
      throw new HttpException('Grub not found', 404);
    }

    const users = await this.prismaService.grubMember.findFirst({
      where: {
        user_id: user.id,
      },
    });

    if (users) {
      throw new HttpException('Already joined', 400);
    }

    const member = await this.prismaService.grubMember.create({
      data: {
        grub_id: joinRequest.grub_id,
        user_id: user.id,
        role_id: 2,
      },
      include: {
        grub: true,
      },
    });

    return {
      id: member.id,
      user_id: member.user_id,
      grub_id: member.grub_id,
      name: grub.name,
      total_users: 1,
    };
  }
}
