import { Controller, Get, Post, Redirect, Render } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('login')
  @Render('login')
  loginPage() {}

  @Post('login')
  @Redirect('/')
  login() {}

  @Get('signup')
  @Render('signup')
  signupPage() {}

  @Post('signup')
  @Redirect('/')
  signup() {}

  @Get('logout')
  @Redirect('login')
  logout() {}
}
