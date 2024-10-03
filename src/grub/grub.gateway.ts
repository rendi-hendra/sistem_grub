import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../common/prisma.service';
import { AuthWs } from 'src/common/authWs.decorator';
import { User } from '@prisma/client';

@WebSocketGateway(81, {
  transports: ['websocket'],
  cors: {
    origin: '*', // Set origin sesuai kebutuhan
  },
})
export class GrubGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private prismaService: PrismaService) {}

  chat = [];

  async handleConnection(client: Socket) {
    // const token = client.handshake.headers.authorization; // Mengambil token dari query params
    // if (!token) {
    //   client.disconnect(); // Putuskan koneksi jika token tidak ada
    //   return;
    // }
    // // Validasi token menggunakan Prisma
    // const user = await this.prismaService.user.findFirst({
    //   where: { token: token as string },
    // });
    // if (!user) {
    //   client.disconnect(); // Putuskan koneksi jika pengguna tidak ditemukan
    //   return;
    // }
    // const grub = await this.prismaService.grubMember.findMany({
    //   where: {
    //     user_id: user.id,
    //   },
    // });
    // console.log(`User ${user.username} connected with token: ${token}`);
    // // Kirim pesan selamat datang
    client.emit('message', 'Hallo');
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // @UseGuards(GrubGuard)
  @SubscribeMessage('grub')
  grub(@AuthWs() user: User, @MessageBody() data: { message: string }): void {
    this.chat.push({
      name: user.name,
      message: data.message,
    });

    this.server.emit('grub', this.chat);
  }
}
