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
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { PageMiddleware } from './common/middleware/page.middleware';
import { RedirectLoginMiddleware } from './common/middleware/redirect-login.middleware';
import { ExternalExceptionFilter } from '@nestjs/core/exceptions/external-exception-filter';
import { FlashMiddleware } from './common/middleware/flash.middleware';
import { DocumentController } from './document/document.controller';

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
    DocumentController,
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
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FlashMiddleware).forRoutes('/');
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/(.*)', method: RequestMethod.ALL },
        { path: 'document/(.*)', method: RequestMethod.GET },

        { path: '/', method: RequestMethod.GET },
      )
      .forRoutes('*');
    consumer
      .apply(RedirectLoginMiddleware)
      .forRoutes({ path: 'auth/login', method: RequestMethod.GET });
    // consumer.apply(PageMiddleware).forRoutes('/');
  }
}
