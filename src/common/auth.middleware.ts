import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as moment from 'moment';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}

  async use(req: any, res: any, next: (error?: Error | any) => void) {
    const token = req.headers['authorization'] as string;
    if (token) {
      let user = await this.prismaService.user.findFirst({
        where: {
          token: token,
        },
      });

      moment.locale('id');

      user = await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          createdAt: moment().format(),
        },
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  }
}
