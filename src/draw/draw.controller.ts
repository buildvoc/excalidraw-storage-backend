import {
  Controller,
  UseGuards,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  ParseIntPipe,
  Put,
  Body,
  Post,
  HttpStatus,
  HttpCode,
  Delete,
  Header,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { SessionAuthGuard } from 'src/auth/guards/session-auth.guard';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/user/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';

import { DrawService } from './draw.service';
import { DrawUpsertDto } from './dto/draw-upsert.dto';
import { DrawUpdateDto } from './dto/draw-update.dto';
import { Draw } from './draw.entity';
import { OwnerInterceptor } from './owner.interceptor';
import { Readable } from 'stream';

@Controller('draw')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@UseInterceptors(ClassSerializerInterceptor, OwnerInterceptor)
export class DrawController {
  constructor(private readonly drawService: DrawService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(
    @AuthUser() user: User,
    @Body() drawUpsertDto: DrawUpsertDto,
  ): Promise<Draw> {
    return await this.drawService.upsert(user, drawUpsertDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@AuthUser() user: User,): Promise<Draw[]> {
    return await this.drawService.list(user);
  }

  @Get(':id')
  @Header('content-type', 'application/octet-stream')
  async get(@Param('id', new ParseIntPipe()) id: number, @Res() res: Response): Promise<void> {
    const data = await this.drawService.findOne(id);

    const stream = new Readable();
    stream.push(data.value);
    stream.push(null);
    stream.pipe(res);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updates: DrawUpdateDto,
  ): Promise<Draw> {
    return await this.drawService.update(id, updates);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Draw> {
    return await this.drawService.remove(id);
  }
}
