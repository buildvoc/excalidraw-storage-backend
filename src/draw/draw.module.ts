import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Draw } from './draw.entity';
import { DrawController } from './draw.controller';
import { DrawService } from './draw.service';
import { StorageService } from 'src/storage/storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Draw])],
  controllers: [DrawController],
  providers: [DrawService, StorageService],
  exports: [DrawService],
})
export class DrawModule {}
