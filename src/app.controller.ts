import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {} // private readonly lmsService: LMSService

  @Get()
  @Render('index')
  index() {}
}
