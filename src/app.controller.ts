import { Controller, Get, Redirect, Render } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {} // private readonly lmsService: LMSService

  @Get()
  @Redirect('/auth/login')
  index() {}

  @Get('course')
  @Render('course')
  course() {}
}
