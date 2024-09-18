import { PrismaService } from '../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteAll() {
    await this.deleteUser();
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test',
        name: 'test',
        password: await bcrypt.hash('test', 10),
        token: 'test',
      },
    });
  }

  async getUser(): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });
  }

  async getuserId(): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });
  }

  async deleteGrub() {
    await this.prismaService.grub.deleteMany({
      where: {
        name: 'test',
      },
    });
  }

  async deleteGrubMember() {
    await this.prismaService.grubMember.deleteMany({
      where: {
        role_id: 1,
      },
    });
  }

  async createGrub() {
    const grub = await this.prismaService.grub.create({
      data: {
        grub_id: uuid(),
        name: 'test',
        total_users: 1,
      },
    });

    return await this.prismaService.grubMember.create({
      data: {
        grub_id: grub.grub_id,
        user_id: (await this.getUser()).id,
        role_id: 1,
      },
    });
  }
}
