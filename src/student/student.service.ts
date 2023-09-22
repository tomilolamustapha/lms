import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class StudentService {
    constructor(
        private prisma : PrismaService,
       //
    ){}
    
}
