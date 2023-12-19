import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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

  @Get('update/:id/:status')
  async publish(
    @Req() req: Request,
    @Param('id') id: number,
    @Param('status') status,
    @Res() res: Response,
  ) {
    const payload: any = req.user;
    try {
      const action = await this.courseService.updateCourseStatus(
        +id,
        payload.user.id,
        status,
        payload.user.role,
      );

      // Set success message
      req.flash('success', action.message);
    } catch (error) {
      // Set error message
      req.flash('error', error.message);
    }

    // Redirect back to the referring page
    res.redirect('back');
  }
}
