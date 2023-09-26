import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { loginAdminDto } from './dto/loginAdmin.dto';
import { loginStudentDto } from './dto/loginStudent.dto';
import { registerRes } from 'src/student/types/regRes.type';
import { StudentService } from 'src/student/student.service';
import * as bcrypt from 'bcrypt';
import { loginTutorDto } from './dto/loginTutor.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private studentService: StudentService,
  ) {}

  async signinStudent(data: loginStudentDto) {
    const { studentMatric, password } = data;

    const findStudent = await this.prisma.student.findFirst({
      where: {
        email: studentMatric,
        password: password,
      },
    });

    if (!findStudent) {
      throw new BadRequestException('Incorrect Email or Password');
    }

    //if(findStudent.isDeleted == true){

    //throw new BadRequestException('Your Account has been deleted');
    //}

    const isMatch = await this.comparePasswords({
      password,
      hash: findStudent.password,
    });

    if (!isMatch) {
      throw new BadRequestException('Invalid Credentials');
    }
    if (findStudent.Status == false) {
      throw new BadRequestException(
        'Your Account Has been Disabled, Please Contact Support',
      );
    }

    return {
      message: 'Login Successful',
    };
  }

  async signinTutor(data: loginTutorDto) {
    const { tutorId, password } = data;

    const findTutor = await this.prisma.student.findFirst({
      where: {
        email: tutorId,
        password: password,
      },
    });

    if (!findTutor) {
      throw new BadRequestException('Incorrect Email or Password');
    }

    //if(findStudent.isDeleted == true){

    //throw new BadRequestException('Your Account has been deleted');
    //}

    const isMatch = await this.comparePasswords({
      password,
      hash: findTutor.password,
    });

    if (findTutor.Status == false) {
      throw new BadRequestException(
        'Your Account Has been Disabled, Please Contact Support',
      );
    }

    return {
      message: 'Login Successful',
    };
  }

  async signinAdmin(data: loginAdminDto) {
    const { email, password } = data;

    const findAdmin = await this.prisma.admin.findUnique({ where: { email } });

    if (!findAdmin) {
      throw new BadRequestException('Incorrect Email or Password');
    }

    const isMatch = await this.comparePasswords({
      password,
      hash: findAdmin.password,
    });

    if (!isMatch) {
      throw new BadRequestException('Invalid Credentials');
    }

    if (findAdmin.Status == false) {
      throw new BadRequestException(
        'Your Account Has been Disabled, Please Contact Support',
      );
    }

    return {
      message: 'Login Successful',
    };
  }

  async signoutAdmin(adminId: string, accessToken: string) {
    // await this.prisma.adminAcessToken.update({ where: { accessToken }, data: { revoked: true } });

    return {
      message: 'signout succcessful',
    };
  }

  async signoutStudent(studentId: number, accessToken: string) {
    //await this.prisma.stuentAccessToken.update({ where: { accessToken }, data: { revoked: true } });

    return {
      message: 'signout succcessful',
    };
  }

  async signoutTutor(tutorIdId: number, accessToken: string) {
    // await this.prisma.tutorAccessToken.update({ where: { accessToken }, data: { revoked: true } });

    return {
      message: 'signout succcessful',
    };
  }

  async comparePasswords(args: { password: string; hash: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }
}
