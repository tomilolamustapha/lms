import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

type JwtPayload = {
  sub: number;
  email: string;
};

@Injectable()
export class TutorStratgey extends PassportStrategy(Strategy, 'tutor-jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'tutor-secret',
    });
  }

  async validate(payload: JwtPayload) {
    const tutor = await this.prisma.tutor.findUnique({
      where: { id: payload.sub },
    });
    if (!tutor) throw new UnauthorizedException('Invalid token');

    return payload;
  }
}
