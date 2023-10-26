import {
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Req,
  Request,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { UserGuard } from 'src/common/guards';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('login')
  @Render('login')
  loginPage(@Request() req) {
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
    return { message: message };
  }

  @Post('login')
  @Redirect('/admin')
  async login(@Request() req) {
    try {
      const user = await this.authService.signInUser(req.body);
      req.session.user = user.user;
      req.session.access_token = user.access_token;

      if (user.user.role === 'Admin') {
        req.flash('success', user.message);
        return {
          url: '/admin',
        };
      }
      if (user.user.role === 'Student') {
        req.flash('success', user.message);
        return {
          url: '/student',
        };
      }
      if (user.user.role === 'Tutor') {
        req.flash('success', user.message);
        return {
          url: '/tutor',
        };
      }
    } catch (error) {
      req.flash('error', error.message);
      return { url: '/auth/login' };
    }
  }

  @Get('signup')
  @Render('signup')
  signupPage(@Request() req) {
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
    return { message: message };
  }

  @Post('signup')
  @Redirect('/admin')
  async signup(@Request() req) {
    try {
      const user = await this.userService.registerUser(req.body);
      req.session.user = user.user;
      // req.session.access_token = user.access_token;
      if (user.user.role === 'Admin') {
        req.flash('success', user.message);
        return {
          url: '/admin',
        };
      }
      if (user.user.role === 'Student') {
        req.flash('success', user.message);
        return {
          url: '/student',
        };
      }
      if (user.user.role === 'Tutor') {
        req.flash('success', user.message);
        return {
          url: '/tutor',
        };
      }
    } catch (error) {
      req.flash('error', error.message);
      return { url: '/auth/signup' };
    }
  }

  @UseGuards(UserGuard)
  @Get('logout')
  @Redirect('/')
  async logout(@Session() session, @Req() req, @Res() res) {
    req.flash('success', 'Successfully logged out');
    await session.destroy();
    return { url: '/' };
  }
}
