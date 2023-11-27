import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserGuard } from 'src/common/guards';
@UseGuards(UserGuard)
@Controller('tutor')
export class TutorController {
  constructor() {}
  @Get('')
  dashboard(@Req() req: Request, @Res() res: Response) {
    const payload: any = req.user;
    res.render('tutor/dashboard', { user: payload.user });
  }
}
