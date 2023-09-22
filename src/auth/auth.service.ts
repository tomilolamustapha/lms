import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { loginAdminDto } from './dto/loginAdmin.dto';
import { loginStudentDto } from './dto/loginStudent.dto';
import { registerRes } from 'src/student/types/regRes.type';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private studentService : StudentService
  ) {}

  //async signin(headers: any , data : loginStudentDto): Promise<registerRes> {
    //const {studentMatric ,password} = data;

    //const findStudent = await this.prisma.student.findFirst{
     // where:{
        //email : studentMatric,

      //}
    //}
  //}
}
