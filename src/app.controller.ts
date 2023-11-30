import { Controller, Get, Redirect, Req, Res, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { CourseService } from './course/course.service';
import { courses } from 'prisma/models/courses';

@Controller()
export class AppController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async index(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const courses = await this.courseService.gettopCourses();

    res.render('index', {
      message,
      page: 'home',
      courses: courses.topCourses,
    });
  }
}
