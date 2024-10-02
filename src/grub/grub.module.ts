import { Module } from '@nestjs/common';
import { GrubService } from './grub.service';
import { GrubController } from './grub.controller';
import { GrubGateway } from './grub.gateway';

@Module({
  providers: [GrubService, GrubGateway],
  controllers: [GrubController],
})
export class GrubModule {}
