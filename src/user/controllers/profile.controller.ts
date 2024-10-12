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
} from '@nestjs/common';

import { UserService } from '../services/user.service';
import { UserUpdate } from '../dto/user-update.dto';
import { SessionAuthGuard } from '../../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../entities/user.entity';

@Controller('profile')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  get(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
    return this.userService.findOne({ where: { id } });
  }

  @Put(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updatesUser: UserUpdate,
  ): Promise<User> {
    return this.userService.update(id, updatesUser);
  }
}
