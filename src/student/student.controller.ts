import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserGuard } from 'src/common/guards';
@UseGuards(UserGuard)
@Controller('student')
export class StudentController {
  constructor() {}
  @Get('')
  dashboard(@Req() req: Request, @Res() res: Response) {
    const payload: any = req.user;
    res.render('dashboard/student', { user: payload.user });
  }
}
