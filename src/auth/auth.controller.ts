import {
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { UserGuard } from 'src/common/guards';
import { Request, Response } from 'express';
import session from 'express-session';
import { access } from 'fs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('login')
  loginPage(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;

    res.render('login', { message });
  }

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.authService.signInUser(req.body);
      const access = user.access_token;

      req.flash('success', user.message);
      res.cookie('user_token', access, {
        expires: new Date(Date.now() + 10 * 60 * 1000),
      });
      res.redirect('/dashboard');
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/auth/login');
    }
  }

  @Get('signup')
  signupPage(@Req() req: Request, @Res() res: Response) {
    const message = res.locals.message;

    res.render('signup', { message });
  }

  @Post('signup')
  async signup(@Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.userService.registerUser(req.body);

      const access = await this.authService.getUserTokens(
        user.user.id,
        user.user,
      );
      req.flash('success', user.message);
      if (access) {
        res.cookie('user_token', access.access_token, {
          expires: new Date(Date.now() + 10 * 60 * 1000),
        });
        res.redirect('/dashboard');
      } else {
        res.redirect('/');
      }
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/auth/signup');
    }
  }

  @UseGuards(UserGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.cookie('user_token', '', {
      expires: new Date(Date.now()),
    });
    req.flash('flash', 'successfully logged out');
    res.redirect('/');
  }
}
