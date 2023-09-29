import { Controller, Get, Render } from '@nestjs/common';

@Controller('student')
export class StudentController {
  constructor() {}
  @Get('')
  @Render('dashboard/student')
  dashboard() {}
}
