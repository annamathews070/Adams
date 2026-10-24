import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Get(['', 'home', 'about', 'services', 'project', 'contact', 'privacy', 'terms'])
  serveLandingPage(@Res() response: Response): void {
    response.sendFile(join(process.cwd(), 'public', 'index.html'));
  }
}
