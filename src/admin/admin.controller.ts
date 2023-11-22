import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserGuard } from 'src/common/guards';
import { DashboardService } from 'src/dashboard/dashboard.service';
@UseGuards(UserGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get('')
  dashboard(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;
    const stats = this.dashboardService.AdminStats(payload.user.id);
    console.log(stats);
    res.render('dashboard/admin', {
      message,
      user: payload.user,
      stats: stats,
    });
  }
}
