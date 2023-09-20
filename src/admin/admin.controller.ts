import { Controller, Get, Render } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  constructor() {}

  @Get()
  @Render('dashboard/admin')
  index() {}
}
