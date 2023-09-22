import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";



type JwtPayload  = {
        sub: number,
        email: string
}


@Injectable()
export class AdminSratgey extends PassportStrategy(Strategy, 'admin-jwt'){
    constructor(
        private readonly prisma: PrismaService,
    ){
        
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'admin-secret',
        });
    }

    async validateStudent(payload: JwtPayload){
 
        const student = await this.prisma.admin.findUnique({ where: { id: payload.sub }});
        if (!student) throw new UnauthorizedException('Invalid token');
        
        return payload;
    }

    async validateTutor(payload: JwtPayload){
 
        const tutor = await this.prisma.admin.findUnique({ where: { id: payload.sub }});
        if (!tutor) throw new UnauthorizedException('Invalid token');
        
        return payload;
    }
}

   