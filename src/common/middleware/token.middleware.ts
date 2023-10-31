import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SetTokenMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}
  use(req: Request, res: Response, next) {
    const token = this.authService.getToken();

    if (token) {
      req.headers['authorization'] = `Bearer ${token}`;
    } else {
      // Render an unauthorized view for 3 seconds, then redirect
      res.status(403).render('no-session'); // Render an unauthorized view
    }
    next();
  }
}
