import { Controller, Get, Redirect } from '@nestjs/common';

@Controller('dashboard')
export class DashboardController {
  constructor() {}

  @Get()
  @Redirect('/admin')
  index() {}
}
