import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class FlashMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next) {
    const success = req.flash('success')[0];
    const error = req.flash('error')[0];
    const flash = req.flash('flash')[0];

    let message;

    if (success) {
      message = {
        status: 'success',
        message: success,
      };
    } else if (error) {
      message = { status: 'error', message: error };
    } else if (flash) {
      message = { status: 'flash', message: flash };
    }
    console.log('success :', success, 'error :', error, 'flash :', flash);

    console.log();

    res.locals.message = message;

    next();
  }
}
