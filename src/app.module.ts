import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { AppController } from './app.controller';
import { TutorService } from './tutor/tutor.service';
import { TutorController } from './tutor/tutor.controller';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { TutorModule } from './tutor/tutor.module';
import { AdminModule } from './admin/admin.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { VideoController } from './video/video.controller';
import { PushNotificationController } from './push-notification/push-notification.controller';
import { PushNotificationModule } from './push-notification/push-notification.module';
import { StudentService } from './student/student.service';
import { StudentController } from './student/student.controller';
import { StudentModule } from './student/student.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PusherModule } from './pusher/pusher.module';
import { CourseService } from './course/course.service';
import { CourseModule } from './course/course.module';

@Module({
  imports: [
    AuthModule,
    TutorModule,
    AdminModule,
    DashboardModule,
    PrismaModule,
    EmailModule,
    PushNotificationModule,
    StudentModule,
    PusherModule,
    CourseModule,
  ],
  controllers: [
    AppController,
    AuthController,
    TutorController,
    AdminController,
    VideoController,
    PushNotificationController,
    StudentController,
  ],
  providers: [
    AuthService,
    TutorService,
    AdminService,
    EmailService,
    StudentService,
    JwtService,
    CourseService,
  ],
})
export class AppModule {}
