import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class PageMiddleware implements NestMiddleware {
  constructor() {}
  use(req: Request, res: Response, next) {
    console.log(res.status, res.statusCode, res.statusMessage, res);
    if (res.statusCode == 404) {
      res.status(403).render('response/page-not-found');
    }
    next();
  }
}
