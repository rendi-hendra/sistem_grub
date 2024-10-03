import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class GrubGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToWs().getClient<Socket>();
    const token = request?.handshake?.headers?.authorization as string;
    if (token) {
      const user = await this.prismaService.user.findFirst({
        where: {
          token: token,
        },
      });
      if (user) {
        return true;
      } else {
        throw new WsException('Unauthorized');
      }
    }
    throw new WsException('Unauthorized');
  }
}
