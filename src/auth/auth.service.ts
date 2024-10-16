import { Injectable, UnauthorizedException, Request, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../user/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../user/services/user.service';
import { MailerService } from '@nestjs-modules/mailer';

const logger = new Logger("AuthService");

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async register(@Request() req, signUpDto: SignUpDto): Promise<User> {
    const user = await this.userService.create(signUpDto);
    delete user.password;

    try {
      await this.sendEmailVerificationLink(req, user);
    } catch (error) {
      logger.error('Send mail verification failed:', error);
    }

    return user;
  }

  async login(email: string, password: string): Promise<any> {
    let user: User;

    try {
      user = await this.userService.findOne({ where: { email } });
    } catch (err) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${email}`,
      );
    }

    if (!(await user.checkPassword(password))) {
      throw new UnauthorizedException(
        `Wrong password for user with email: ${email}`,
      );
    }

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException(
        `Email not verified. Please check your email inbox to verify account.`,
      );
    }

    const access_token = this.signToken(user);

    delete user.password;

    return {
      data: {
        user_data: user, 
        access_token
      }
    };
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    let user: User;

    try {
      user = await this.userService.findOne({ where: { email: payload.sub } });
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${payload.sub}`,
      );
    }

    return user;
  }

  signToken(user: User): string {
    const payload = {
      sub: user.email,
    };

    return this.jwtService.sign(payload);
  }

  async sendEmailVerificationLink(@Request() req, user: User): Promise<any> {
    if (user.emailVerifiedAt) {
      throw new BadRequestException('Email already verified!');
    }
    const verificationToken = await this.jwtService.signAsync({ email: user.email });
    const email_verification_link = `${req.protocol}://${req.get(
      'Host',
    )}/api/v2/auth/verify-email?token=${verificationToken}`;
    return await this.mailerService.sendMail({
      to: user.email,
      from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_USER}>`,
      subject: 'Email verification',
      template: 'email-verification',
      context: {
        app_name: `${process.env.MAIL_FROM_NAME}`,
        name: user.name,
        email_verification_link,
      },
    });
  }

  async verifyEmail(token: string): Promise<any> {
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.APP_SECRET,
      });
      if (typeof payload === 'object' && 'email' in payload) {
        const user = await this.userService.findOne({ where: { email: payload.email } });
        if (user.emailVerifiedAt) {
          throw new BadRequestException('Email already verified!');
        }
        await this.userService.verifyEmail(user.id);
        return {
          message: 'Email verified.',
        };
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Invalid token');
    }
  }
}
