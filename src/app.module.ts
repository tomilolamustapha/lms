import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { DashboardModule } from './dashboard/dashboard.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { VideoController } from './course/video/video.controller';
import { PushNotificationController } from './push-notification/push-notification.controller';
import { PushNotificationModule } from './push-notification/push-notification.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PusherModule } from './pusher/pusher.module';
import { CourseService } from './course/course.service';
import { CourseModule } from './course/course.module';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { StudentController } from './student/student.controller';
import { StudentService } from './student/student.service';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { TutorController } from './tutor/tutor.controller';
import { TutorService } from './tutor/tutor.service';

@Module({
  imports: [
    AuthModule,
    DashboardModule,
    PrismaModule,
    EmailModule,
    PushNotificationModule,
    PusherModule,
    CourseModule,
    UserModule,
  ],
  controllers: [
    AppController,
    AuthController,
    VideoController,
    PushNotificationController,
    UserController,
    StudentController,
    AdminController,
    TutorController
  ],
  providers: [
    AuthService,
    EmailService,
    UserService,
    JwtService,
    CourseService,
    StudentService,
    AdminService,
    TutorService,
  ],
})
export class AppModule {}
