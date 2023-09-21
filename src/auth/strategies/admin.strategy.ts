import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
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
}

   //