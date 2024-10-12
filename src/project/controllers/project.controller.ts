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
} from '@nestjs/common';

import { ProjectService } from '../services/project.service';
import { ProjectCreateDto } from '../dto/project-create.dto';
import { ProjectUpdateDto } from '../dto/project-update.dto';
import { JWTAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SessionAuthGuard } from '../../auth/guards/session-auth.guard';
import { Project } from '../entities/project.entity';
import { AuthUser } from '../../user/decorators/user.decorator';
import { User } from '../../user/entities/user.entity';
import { OwnerInterceptor } from '../interceptors/owner.interceptor';

@Controller('project')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@UseInterceptors(ClassSerializerInterceptor, OwnerInterceptor)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(
    @AuthUser() user: User,
    @Body() projectCreateDto: ProjectCreateDto,
  ): Promise<Project> {
    return await this.projectService.create(user, projectCreateDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@AuthUser() user: User,): Promise<Project[]> {
    return await this.projectService.list(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id', new ParseIntPipe()) id: number): Promise<Project> {
    return await this.projectService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updates: ProjectUpdateDto,
  ): Promise<Project> {
    return await this.projectService.update(id, updates);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Project> {
    return await this.projectService.remove(id);
  }
}
