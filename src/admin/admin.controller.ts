import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserGuard } from 'src/common/guards';
import { DashboardService } from 'src/dashboard/dashboard.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from './admin.service';
import { CourseService } from 'src/course/course.service';
import { dataFetchDto } from 'src/user/dto/dataFetchDto.dto';
@UseGuards(UserGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly dashboardService: DashboardService,
    private readonly userService: UserService,
    private readonly courseService: CourseService,
  ) {}

  @Get('')
  async dashboard(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;
    const stats = await this.dashboardService.AdminStats(payload.user.id);
    const students = await this.adminService.getUserByRole('Student');
    const tutors = await this.adminService.getUserByRole('Tutor');
    res.render('admin/dashboard', {
      message,
      user: payload.user,
      stats: stats,
      students: students.users,
      tutors: tutors.users,
    });
  }

  @Get('settings')
  settings(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    res.render('admin/settings', {
      message,
      user: payload.user,
    });
  }

  @Get('settings/users')
  async users(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;
    const users = await this.userService.getAllUsers();

    res.render('admin/users', {
      message,
      user: payload.user,
      users: users.users,
    });
  }

  @Get('settings/users/add-user')
  addUserPage(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    res.render('admin/add-user', {
      message,
      user: payload.user,
    });
  }

  @Post('settings/users/add-user')
  async addUser(@Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.adminService.addUser(
        req.body,
        req.body.password,
        req.body.username,
      );

      req.flash('success', user.message);
      res.redirect('/admin/settings/users');
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/admin/settings/users/add-user');
    }
  }

  @Post('settings/users/:id/update-status')
  async updatestatus(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = +req.params.id;
      const user = await this.adminService.updateUserStatus(
        userId,
        req.body.newStatus,
      );
      console.log(user);
      res.status(200).json({ message: user.message });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('settings/courses')
  async courses(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;
    // const dto: dataFetchDto = {
    //   search_term: '',
    //   page_number: 1,
    //   start_date: '',
    //   end_date: '',
    //   page_size: 10,
    //   validate: function (): string {
    //     throw new Error('Function not implemented.');
    //   },
    // };
    // const courses = await this.courseService.getAllCourses(dto);
    // console.log(courses.data);

    res.render('admin/courses', {
      message,
      user: payload.user,
      // courses: courses.data,
      // pagination: courses.meta,
    });
  }

  @Get('settings/courses/add-course')
  addCoursePage(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    res.render('add-course', {
      message,
      user: payload.user,
    });
  }

  @Post('settings/courses/add-course')
  async addCourse(@Req() req: Request, @Res() res: Response) {
    const payload: any = req.user;

    console.log(payload);

    try {
      const course = await this.courseService.createCourse(
        req.body,
        payload.user.userId,
        payload.user.tutorId
      );

      req.flash('success', course.mesaage);
      res.redirect('/admin/settings/courses');
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/admin/settings/courses/add-course');
    }
  }
}
