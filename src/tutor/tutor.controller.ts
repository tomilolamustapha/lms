import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserGuard } from 'src/common/guards';
import { TutorService } from './tutor.service';
import { CourseService } from 'src/course/course.service';
import { AdminService } from 'src/admin/admin.service';

@UseGuards(UserGuard)
@Controller('tutor')
export class TutorController {
  constructor(
    private readonly adminService: AdminService,
    private readonly tutorService: TutorService,
    private readonly courseService: CourseService,
  ) {}

  @Get('')
  async dashboard(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    const stats = await this.tutorService.getTutorStats(payload.user.id);
    const ulpoadedCourses = await this.courseService.getRecentlyUploadedCourses(
      payload.user.id,
    );

    res.render('tutor/dashboard', {
      message,
      user: payload.user,
      stats: stats,
      recentCourses: ulpoadedCourses,
    });
  }

  @Get('my-courses')
  async course(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    const courses = await this.tutorService.getAllTutorCourse(payload.user.id);

    res.render('tutor/my-course', {
      message,
      user: payload.user,
      courses: courses.allCourse,
    });
  }

  @Get('my-courses/add-course')
  addCoursePage(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    res.render('tutor/add-course', {
      message,
      user: payload.user,
    });
  }

  @Post('my-courses/add-course')
  async addCourse(@Req() req: Request, @Res() res: Response) {
    const payload: any = req.user;

    try {
      const course = await this.courseService.createCourse(
        req.body,
        payload.user.id,
      );

      req.flash('success', course.mesaage);
      res.redirect('/tutor/my-courses');
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/tutor/my-courses/add-course');
    }
  }

  @Get('my-courses/course/:id')
  async viewCoursePage(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    const course = await this.courseService.getCourseById(+req.params.id);

    res.render('tutor/view-course', {
      message,
      user: payload.user,
      course: course.data,
    });
  }

  @Get('my-courses/course/:id/upload')
  async upload(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    const course = await this.courseService.getCourseById(+req.params.id);

    res.render('tutor/content-upload', {
      message,
      user: payload.user,
      course: course.data,
    });
  }
}
