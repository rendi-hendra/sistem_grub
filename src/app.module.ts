import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { GrubModule } from './grub/grub.module';

@Module({
  imports: [CommonModule, UserModule, GrubModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
