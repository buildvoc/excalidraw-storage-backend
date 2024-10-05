import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthUser } from '../user/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JWTAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionAuthGuard } from './guards/session-auth.guard';
import { TokenInterceptor } from './interceptors/token.interceptor';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(TokenInterceptor)
  async register(@Request() req, @Body() signUpDto: SignUpDto): Promise<any> {
    await this.authService.register(req, signUpDto);

    return {
      message: 'Register success. Please check email to verify your account.',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TokenInterceptor)
  async login(@Body() signInDto: SignInDto): Promise<User> {
    const data = await this.authService.login(
      signInDto.email,
      signInDto.password,
    );

    return data;
  }

  @Get('verify-email?')
  async verifyEmail(@Query('token') token: string, @Res() res) {
    await this.authService.verifyEmail(token);
    return res.redirect(process.env.ALLOWED_ORIGINS);
  }

  @Post('resend-email-verification')
  @UseGuards(SessionAuthGuard, JWTAuthGuard)
  @HttpCode(HttpStatus.OK)
  async resendEmailVerification(@Request() req, @AuthUser() user: User) {

    try {
      await this.authService.sendEmailVerificationLink(req, user);
    } catch (error) {}

    return {
      message: 'Email verification link sent. Please check your email.',
    };
  }

  @Get('/me')
  @UseGuards(SessionAuthGuard, JWTAuthGuard)
  me(@AuthUser() user: User): User {
    return user;
  }
}
