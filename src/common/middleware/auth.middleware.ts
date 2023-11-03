import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor() {}
  use(req: Request, res: Response, next) {
    if (
      !(
        req.cookies &&
        'user_token' in req.cookies &&
        req.cookies.user_token.length > 0
      )
    ) {
      res.status(403).render('response/no-session');
    }
    next();
  }
}
