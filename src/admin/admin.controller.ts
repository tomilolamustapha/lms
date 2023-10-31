import {
  Controller,
  Get,
  Render,
  Req,
  Res,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserGuard } from 'src/common/guards';

@Controller('admin')
export class AdminController {
  constructor() {}
  @Get('')
  @UseGuards(UserGuard)
  dashboard(@Req() req: Request, @Res() res: Response) {
    // let message;
    // const success = req.flash('success')[0];
    // const error = req.flash('error')[0];
    console.log('adminheader:', res.getHeaders());
    // if (success) {
    //   message = {
    //     status: 'success',
    //     message: success,
    //   };
    // }
    // if (error) {
    //   message = { status: 'error', message: error };
    // }
    res.render('dashboard/admin');
  }
}
