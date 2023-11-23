import { Controller, Get, Redirect, Req, Res, Session } from '@nestjs/common';
import { IS_NOT_EMPTY_OBJECT } from 'class-validator';
import { Request, Response } from 'express';
import { session } from 'passport';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  index(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    res.render('index', { message, page: 'home' });
  }

  
}