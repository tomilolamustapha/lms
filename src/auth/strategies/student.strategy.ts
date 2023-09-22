import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";



type JwtPayload  = {
        sub: number,
        email: string
}


@Injectable()
export class StudentStratgey extends PassportStrategy(Strategy, 'student-jwt'){
    constructor(
        private readonly prisma: PrismaService,
    ){
        
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'student-secret',
        });
    }

   async validate(payload: JwtPayload){
 
        const student = await this.prisma.student.findUnique({ where: { id: payload.sub }});
        if (!student) throw new UnauthorizedException('Invalid token');
        
        return payload;
    }
}