import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { StudentService } from 'src/student/student.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, EmailService,StudentService],
})
export class AuthModule {}
