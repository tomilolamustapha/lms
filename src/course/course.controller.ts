import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserGuard } from 'src/common/guards';
import { CourseService } from './course.service';

@UseGuards(UserGuard)
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('')
  async course(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    const courses = await this.courseService.getAllCourse();

    res.render('course', {
      message,
      user: payload.user,
      courses: courses.getcourse,
    });
  }
}
