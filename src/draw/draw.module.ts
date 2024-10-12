import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Draw } from './draw.entity';
import { DrawController } from './draw.controller';
import { DrawService } from './draw.service';
import { RawParserMiddleware } from 'src/raw-parser.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Draw])],
  controllers: [DrawController],
  providers: [DrawService],
  exports: [DrawService],
})
export class DrawModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RawParserMiddleware).forRoutes(DrawController);
  }
}
