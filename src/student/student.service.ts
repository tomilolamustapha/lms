import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';
import * as bcrypt from 'bcrypt';
import { PaginateFunction, paginator } from 'prisma/models/paginator';
import { dataFetchDto } from './dto/dataFetch.dto';
@Injectable()
export class StudentService {
    constructor(
        private prisma : PrismaService,
       //
    ){}}
    //