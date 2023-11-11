import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as flash from 'express-flash';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'assets'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');

  app.use(cookieParser());
  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 30 * 60 * 1000 },
    }),
  );
  app.use(flash());

  await app.listen(4004);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
