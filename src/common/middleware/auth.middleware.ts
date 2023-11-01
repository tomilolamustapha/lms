import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}
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
