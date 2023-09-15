import { Controller, Get, Post, Redirect, Render } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('login')
  @Render('login')
  index() {}

  @Post('login')
  @Render('index')
  login() {}

  @Get('logout')
  @Redirect('login')
  logout() {}
}
