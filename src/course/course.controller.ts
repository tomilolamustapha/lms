import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserGuard } from 'src/common/guards';

@UseGuards(UserGuard)
@Controller('course')
export class CourseController {
  constructor() {}

  @Get('')
  course(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;
    const payload: any = req.user;
    res.render('course', { message, user: payload.user });
  }
}
