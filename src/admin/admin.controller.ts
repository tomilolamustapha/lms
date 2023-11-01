import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserGuard } from 'src/common/guards';
@UseGuards(UserGuard)
@Controller('admin')
export class AdminController {
  constructor() {}
  @Get('')
  dashboard(@Req() req: Request, @Res() res: Response) {
    const payload: any = req.user;
    res.render('dashboard/admin', { user: payload.user });
  }
}
