import { Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { GrubValidation } from './grub.validation';
import { v4 as uuid } from 'uuid';
import { CreateGrubRequest, GrubResponse } from 'src/model/grub.model';
import { User } from '@prisma/client';

@Injectable()
export class GrubService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async create(user: User, request: CreateGrubRequest): Promise<GrubResponse> {
    this.logger.debug(`Register new user ${JSON.stringify(request)}`);

    const createRequest: CreateGrubRequest = this.validationService.validate(
      GrubValidation.CREATE,
      request,
    );

    const grub = await this.prismaService.grub.create({
      data: {
        grub_id: uuid(),
        name: createRequest.name,
        total_users: 1,
      },
    });

    await this.prismaService.grubMember.create({
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
  }
}
