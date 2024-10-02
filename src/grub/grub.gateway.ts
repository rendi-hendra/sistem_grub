import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../common/prisma.service';

@WebSocketGateway(81, {
  transports: ['websocket'],
  cors: {
    origin: '*', // Set origin sesuai kebutuhan
  },
})
export class GrubGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private prismaService: PrismaService) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization; // Mengambil token dari query params

    if (!token) {
      client.disconnect(); // Putuskan koneksi jika token tidak ada
      return;
    }

    // Validasi token menggunakan Prisma
    const user = await this.prismaService.user.findFirst({
      where: { token: token as string },
    });

    if (!user) {
      client.disconnect(); // Putuskan koneksi jika pengguna tidak ditemukan
      return;
    }

    const grub = await this.prismaService.grubMember.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        grub: true,
      },
    });

    console.log(`User ${user.username} connected with token: ${token}`);

    // Kirim pesan selamat datang
    client.emit('message', grub);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('grub')
  grub(): void {
    this.server.emit('grub', 'test');
  }
}
