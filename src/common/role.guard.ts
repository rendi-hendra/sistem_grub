import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './role.decorator';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: string[] = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'] as string;
    const grubId = request.params['grub_id'] as string;

    if (token) {
      const user = await this.prismaService.user.findFirst({
        where: {
          token: token,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Unauthorized');
      }

      const grub = await this.prismaService.grub.findFirst({
        where: {
          grub_id: grubId,
        },
      });

      if (!grub) {
        throw new NotFoundException('Grub not found');
      }

      const grubMember = await this.prismaService.grubMember.findFirst({
        where: {
          user_id: user.id,
          grub_id: grubId,
        },
        include: {
          role: true,
        },
      });

      if (grubMember) {
        return roles.indexOf(grubMember.role.name) != -1;
      } else {
        throw new ForbiddenException('Forbidden');
      }
    }

    throw new UnauthorizedException('Unauthorized');
  }
}
