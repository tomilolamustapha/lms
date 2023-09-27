import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class RevokedTokenMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const userToken = await this.prisma.userAccessToken.findUnique({ where: { accessToken } });
      const token = userToken;
    
      if (!token || token.revoked) throw new UnauthorizedException();
      next();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}

