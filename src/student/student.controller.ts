import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserGuard } from 'src/common/guards';
import { CourseService } from 'src/course/course.service';
import { StudentService } from './student.service';
@UseGuards(UserGuard)
@Controller('student')
export class StudentController {
  constructor(
    private readonly courseService: CourseService,
    private readonly studentService: StudentService,
  ) {}

  @Get('')
  async dashboard(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.messages;
    const payload: any = req.user;

    const courses = await this.courseService.gettopCourses();
    const recent = await this.studentService.getRecentEnrollmentsByStudent(
      payload.user.id,
    );
    res.render('student/dashboard', {
      user: payload.user,
      topCourses: courses.topCourses,
      recents: recent.recentEnrollments,
    });
  }

  @Get('my-courses')
  async course(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    const courses = await this.studentService.getCoursesEnrolledByStudent(
      payload.user.id,
    );
    res.render('student/my-course', {
      message,
      user: payload.user,
      courses: courses.studentEnrollments,
    });
  }

  @Get('my-courses/course/:id')
  async viewCoursePage(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    const course = await this.studentService.getEnrollmentByIdWithContent(
      +req.params.id,
    );

    res.render('student/view-course', {
      message,
      user: payload.user,
      course: course.enrollment.course,
    });
  }
}
