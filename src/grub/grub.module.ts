import { Module } from '@nestjs/common';
import { GrubService } from './grub.service';
import { GrubController } from './grub.controller';

@Module({
  providers: [GrubService],
  controllers: [GrubController],
})
export class GrubModule {}
