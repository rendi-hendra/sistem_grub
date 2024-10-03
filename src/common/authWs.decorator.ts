import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
import { PrismaService } from './prisma.service';
import { Logger } from 'winston';
import { WsException } from '@nestjs/websockets';

export const AuthWs = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const request = context.switchToWs().getClient<Socket>();
    const logger = new Logger();
    const prisma = new PrismaService(logger);
    const user = await prisma.user.findFirst({
      where: {
        token: request.handshake.headers.authorization as string,
      },
    });
    if (user) {
      return user;
    } else {
      throw new WsException('Unauthorized');
    }
  },
);
