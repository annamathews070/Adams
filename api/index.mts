import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { join } from 'path';
import { AppModule } from '../src/app.module';

let applicationPromise: Promise<NestExpressApplication> | undefined;

async function createApplication(): Promise<NestExpressApplication> {
  const application = await NestFactory.create<NestExpressApplication>(AppModule);
  application.useStaticAssets(join(process.cwd(), 'public'), { index: false });
  await application.init();
  return application;
}

export default async function handler(request: Request, response: Response): Promise<void> {
  applicationPromise ??= createApplication();
  const application = await applicationPromise;
  application.getHttpAdapter().getInstance()(request, response);
}