import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserGuard } from 'src/common/guards';
import { DashboardService } from 'src/dashboard/dashboard.service';
import { UserService } from 'src/user/user.service';
import { AdminService } from './admin.service';
@UseGuards(UserGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly dashboardService: DashboardService,
    private readonly userService: UserService,
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
    console.log(users);

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
      res.redirect('');
    }
  }

  @Post('settings/users/:id/update-status')
  async updatestatus(@Req() req: Request, @Res() res: Response) {
    try {
      res.status(200).json({ message: 'User status updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('settings/courses')
  async courses(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;
    const users = await this.userService.getAllUsers();
    console.log(users);

    res.render('admin/courses', {
      message,
      user: payload.user,
      users: users.users,
    });
  }
}
