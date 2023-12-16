import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserGuard } from 'src/common/guards';
@UseGuards(UserGuard)
@Controller('student')
export class StudentController {
  constructor() {}
  @Get('')
  dashboard(@Req() req: Request, @Res() res: Response) {
    const payload: any = req.user;
    res.render('student/dashboard', { user: payload.user });
  }

  @Get('my-courses')
  course(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;
    res.render('student/my-course', { message, user: payload.user });
  }

  @Get('my-courses/course/:id')
  async viewCoursePage(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    res.render('student/view-course', {
      message,
      user: payload.user,
    });
  }
}
