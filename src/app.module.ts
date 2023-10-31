import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
// import { UploadsService } from './course/uploads/uploads.service';
import { memoryStorage } from 'multer';
import { VideoController } from './course/uploads/video.controller';
import { MulterModule } from './common/middleware/multer.module';
import { EnrollmentService } from './enrollment/enrollment.service';
import { EnrollmentController } from './enrollment/enrollment.controller';
import * as flash from 'express-flash';
import * as cookieParser from 'cookie-parser';
import { SetTokenMiddleware } from './common/middleware/token.middleware';

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
    MulterModule,
  ],
  controllers: [
    AppController,
    AuthController,
    VideoController,
    PushNotificationController,
    UserController,
    StudentController,
    AdminController,
    TutorController,
    EnrollmentController,
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
    EnrollmentService,
    // UploadsService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(flash()).forRoutes('*'); // Apply express-flash middleware to all routes
    consumer
      .apply(SetTokenMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.GET },
        { path: 'auth/login', method: RequestMethod.POST },
      )
      .forRoutes('/');
  }
}
