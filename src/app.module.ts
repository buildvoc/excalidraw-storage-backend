import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RawParserMiddleware } from './raw-parser.middleware';
import { ScenesController } from './scenes/scenes.controller';
import { StorageService } from './storage/storage.service';
import { RoomsController } from './rooms/rooms.controller';
import { FilesController } from './files/files.controller';
import { HealthController } from './health/health.controller';
import { PostgresTtlService } from './ttl/postgres_ttl.service';

import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ProjectModule } from './project/project.module';
import { DrawModule } from './draw/draw.module';

const logger = new Logger('AppModule');

const buildProviders = () => {
  const ttlProvider = addTtlProvider();
  const providers: any[] = [StorageService, AppService];
  if (ttlProvider) {
    // providers.push(ttlProvider);
  }
  return providers;
};

const addTtlProvider = () => {
  if (process.env['ENABLE_POSTGRES_TTL_SERVICE'] == 'true') {
    logger.log('Enabling PostgresTtlService');
    return PostgresTtlService;
  }
};

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
    TerminusModule,
    MailerModule.forRoot({
      transport: {
        host: String(process.env.MAIL_HOST),
        port: Number(process.env.MAIL_PORT),
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_USER}>`,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new EjsAdapter({ inlineCssEnabled: true }),
        options: {
          strict: false,
        },
      },
    }),
    UserModule,
    AuthModule,
    ProjectModule,
    DrawModule,
  ],
  controllers: [
    ScenesController,
    RoomsController,
    FilesController,
    HealthController,
    AppController,
  ],
  providers: buildProviders(),
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RawParserMiddleware).forRoutes(ScenesController, RoomsController, FilesController);
  }
}
