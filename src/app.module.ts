import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './student/user.controller';
import { UserService } from './student/student.service';
import { TutorService } from './tutor/tutor.service';
import { TutorController } from './tutor/tutor.controller';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { UserModule } from './student/user.module';
import { TutorModule } from './tutor/tutor.module';
import { AdminModule } from './admin/admin.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { VideoController } from './video/video.controller';
import { PushNotificationController } from './push-notification/push-notification.controller';
import { PushNotificatioController } from './push-notificatio/push-notificatio.controller';
import { PushNotificationModule } from './push-notification/push-notification.module';
import { StudentService } from './student/student.service';
import { StudentController } from './student/student.controller';
import { StudentModule } from './student/student.module';

@Module({
  imports: [UserModule, TutorModule, AdminModule, DashboardModule, PrismaModule, EmailModule, PushNotificationModule, StudentModule],
  controllers: [AppController, UserController, TutorController, AdminController, VideoController, PushNotificationController, PushNotificatioController, StudentController],
  providers: [AppService, UserService, TutorService, AdminService, PrismaService, EmailService, StudentService],
})
export class AppModule {}
