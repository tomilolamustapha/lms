import { Controller, Get, Res, Session } from '@nestjs/common';
import { session } from 'passport';

@Controller('dashboard')
export class DashboardController {
  constructor() {}

  @Get()
  index(@Res() res, @Session() session) {
    if (!session.user || !session.access_token) {
      res.redirect('/');
    } else {
      if (session.user.role === 'admin') {
        res.redirect('/admin');
      } else if (session.user.role === 'student') {
        res.redirect('/student');
      } else if (session.user.role === 'tutor') {
        res.redirect('/tutor');
      }
    }
  }
}
