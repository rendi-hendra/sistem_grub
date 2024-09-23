import { PrismaService } from '../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
// import { v4 as uuid } from 'uuid';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteAll() {
    await this.deleteGrubMember();
    await this.deleteGrub();
    await this.deleteUser();
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: {
          contains: 'test',
        },
      },
    });
  }

  async createUser() {
    await this.prismaService.user.createMany({
      data: [
        {
          username: 'test',
          name: 'test',
          password: await bcrypt.hash('test', 10),
          token: 'test',
        },
        {
          username: 'test2',
          name: 'test2',
          password: await bcrypt.hash('test2', 10),
          token: 'test2',
        },
      ],
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
        OR: [
          {
            role_id: 1,
          },
          {
            role_id: 2,
          },
        ],
      },
    });
  }

  async createGrubMember() {
    await this.prismaService.grubMember.create({
      data: {
        grub_id: 'test',
        user_id: (await this.getUser()).id,
        role_id: 2,
      },
    });
  }

  async createGrub() {
    const grub = await this.prismaService.grub.create({
      data: {
        grub_id: 'test',
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

  async getGrubId() {
    return await this.prismaService.grub.findFirst({
      where: {
        name: 'test',
      },
    });
  }
}
