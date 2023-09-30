import { Controller, Get, Render, Request } from '@nestjs/common';

@Controller('student')
export class StudentController {
  constructor() {}
  @Get('')
  @Render('dashboard/student')
  dashboard(@Request() req) {
    let message;
    const success = req.flash('success')[0];
    const error = req.flash('error')[0];
    if (success) {
      message = {
        status: 'success',
        message: success,
      };
    }
    if (error) {
      message = { status: 'error', message: error };
    }
    return { message: message };
  }
}
