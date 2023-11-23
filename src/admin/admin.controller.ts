import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserGuard } from 'src/common/guards';
import { DashboardService } from 'src/dashboard/dashboard.service';
@UseGuards(UserGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get('')
  async dashboard(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;
    const stats = await this.dashboardService.AdminStats(payload.user.id);
    res.render('dashboard/admin', {
      message,
      user: payload.user,
      stats: stats,
    });
  }

  @Get('settings')
  settings(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    res.render('settings', {
      message,
      user: payload.user,
    });
  }

  @Get('settings/users')
  users(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    res.render('users', {
      message,
      user: payload.user,
    });
  }

  @Get('settings/users/add-user')
  addUser(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;

    res.render('add-user', {
      message,
      user: payload.user,
    });
  }
}
