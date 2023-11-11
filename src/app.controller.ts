import { Controller, Get, Redirect, Req, Res, Session } from '@nestjs/common';
import { session } from 'passport';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  index(@Req() req, @Res() res, @Session() session) {
    let message;
    const success = req.flash('success')[0];
    const error = req.flash('error')[0];
    if (success) {
      message = {
        status: 'success',
        message: success,
      };
    }
    if (error) {
      message = { status: 'error', message: error };
    }
    if (!session.user || !session.access_token) {
      res.render('index', message);
    } else {
      res.redirect('/dashboard');
    }
  }

  @Get('course')
  course(@Req() req, @Res() res) {
    let message;
    const success = req.flash('success')[0];
    const error = req.flash('error')[0];
    if (success) {
      message = {
        status: 'success',
        message: success,
      };
    }
    if (error) {
      message = { status: 'error', message: error };
    }
    res.render('course');
  }
}
