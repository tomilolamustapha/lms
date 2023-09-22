import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { AdminSratgey, StudentStratgey, TutorStratgey } from './strategies';
import { EmailService } from 'src/email/email.service';
import { StudentService } from 'src/student/student.service';
import { TutorService } from 'src/tutor/tutor.service';
import { AdminService } from 'src/admin/admin.service';

@Module({
  imports: [JwtModule.register({}), EmailModule],
  controllers: [AuthController],
  providers: [AuthService, StudentService,TutorService,EmailService,AdminService],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
