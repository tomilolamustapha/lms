import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Request,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { request } from 'http';
import { error } from 'console';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('login')
  @Render('login')
  loginPage(@Request() req) {
    // const message = req.session.message;
    // return { message: message };
  }

  @Post('login')
  @Redirect('/admin')
  async login(@Request() req) {
    try {
      const user = await this.authService.signInUser(req.body);
      if (user.user.role === 'Admin') {
        req.session.message = user.message;
        return {
          url: '/admin',
        };
      }
      if (user.user.role === 'Student') {
        req.session.message = user.message;
        return {
          url: '/student',
        };
      }
      if (user.user.role === 'Tutor') {
        req.session.message = user.message;
        return {
          url: '/tutor',
        };
      }
    } catch (error) {
      req.session.message = error.message;
      return { url: '/auth/login' };
    }
  }

  @Get('signup')
  @Render('signup')
  signupPage() {}

  @Post('signup')
  @Redirect('/admin')
  async signup(@Request() req) {
    try {
      const user = await this.userService.registerUser(req.body);
      if (user.user.role === 'Admin') {
        return {
          url: '/admin',
        };
      }
      if (user.user.role === 'Student') {
        return {
          url: '/student',
        };
      }
      if (user.user.role === 'Tutor') {
        return {
          url: '/tutor',
        };
      }
    } catch (error) {
      return { url: '/auth/signup' };
    }
  }

  @Get('logout')
  @Redirect('login')
  logout() {}
}
