import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';
import { User } from '../auth.service';

type JwtPayload = {
  sub: number;
  user: User;
};

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(
    private readonly prisma: PrismaService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        UserJwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: 'user-secret',
    });
  }

  private static extractJWT(req: Request) {
    if (
      req.cookies &&
      'user_token' in req.cookies &&
      req.cookies.user_token.length > 0
    ) {
      return req.cookies.user_token;
    }
    return null;
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) throw new UnauthorizedException('Invalid token');

    return payload;
  }
}
