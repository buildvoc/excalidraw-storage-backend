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
  UnauthorizedException,
  NotFoundException,
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
import { StorageNamespace, StorageService } from 'src/storage/storage.service';

@Controller('draw')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
export class DrawController {
  namespace = StorageNamespace.SCENES;
  constructor(
    private readonly drawService: DrawService,
    private storageService: StorageService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor, OwnerInterceptor)
  async upsert(
    @AuthUser() user: User,
    @Body() drawUpsertDto: DrawUpsertDto,
  ): Promise<Draw> {
    return await this.drawService.upsert(user, drawUpsertDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor, OwnerInterceptor)
  async list(@AuthUser() user: User,): Promise<Draw[]> {
    return await this.drawService.list(user);
  }

  @Get(':id')
  @Header('content-type', 'application/octet-stream')
  @UseInterceptors(ClassSerializerInterceptor)
  async get(@Param('id', new ParseIntPipe()) id: number, @AuthUser() user: User, @Res() res: Response): Promise<void> {
    const data = await this.drawService.findOne(id);

    if (data.user != user.id) throw new UnauthorizedException(`You're unauthorized to access this resources.`);

    let sceneID = Number(data.value.split(",")[0]);

    const scene = await this.storageService.get(sceneID.toString(), this.namespace);

    if (!scene) throw new NotFoundException();

    const stream = new Readable();
    stream.push(scene);
    stream.push(null);
    stream.pipe(res);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor, OwnerInterceptor)
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updates: DrawUpdateDto,
  ): Promise<Draw> {
    return await this.drawService.update(id, updates);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(ClassSerializerInterceptor, OwnerInterceptor)
  async remove(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Draw> {
    return await this.drawService.remove(id);
  }
}
