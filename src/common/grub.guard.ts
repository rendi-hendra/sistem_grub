import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class GrubGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'] as string;
    const grubId = request.params['grub_id'] as string;

    if (token) {
      const user = await this.prismaService.user.findFirst({
        where: {
          token: token,
        },
      });

      const grub = await this.prismaService.grub.findFirst({
        where: {
          grub_id: grubId,
        },
      });

      if (!grub) {
        throw new HttpException('Grub not found!', 404);
      }

      const isMember = await this.prismaService.grubMember.findFirst({
        where: {
          user_id: user.id,
          grub_id: grubId,
        },
      });

      if (isMember) {
        return true;
      }

      throw new ForbiddenException('Forbidden');
    }
    throw new ForbiddenException('Forbidden');
  }
}
