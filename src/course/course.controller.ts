import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('course')
export class CourseController {
  constructor() {}

  @Get('')
  course(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    res.render('course', { message });
  }
}
