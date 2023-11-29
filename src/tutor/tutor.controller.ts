import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
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

    const stats = await this.tutorService.getTotalCoursesByTutor(
      payload.user.id,
    );
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

  @Get('my-course')
  async course(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;
    const ulpoadedCourses = await this.courseService.getRecentlyUploadedCourses(
      payload.user.id,
    );
    res.render('course/tutor-course', {
      message,
      user: payload.user,
      recentCourses: ulpoadedCourses,
    });
  }
}
