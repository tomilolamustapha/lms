import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserGuard } from 'src/common/guards';

@UseGuards(UserGuard)
@Controller('dashboard')
export class DashboardController {
  constructor() {}

  @Get()
  index(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    req.flash(message.status, message.message);

    const payload: any = req.user;

    if (payload.user.role === 'Admin') {
      res.redirect('/admin');
    }
    if (payload.user.role === 'Student') {
      res.redirect('/student');
    }
    if (payload.user.role === 'Tutor') {
      res.redirect('/tutor');
    }
  }
}
