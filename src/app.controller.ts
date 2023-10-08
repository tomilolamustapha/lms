import { Controller, Get, Redirect, Render } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @Render('index')
  index() {}

  @Get('course')
  @Render('course')
  course() {}
}
