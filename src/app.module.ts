import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TutorService } from './tutor/tutor.service';
import { TutorController } from './tutor/tutor.controller';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [AuthModule],
  controllers: [
    AppController,
    AuthController,
    UserController,
    TutorController,
    AdminController,
  ],
  providers: [UserService, TutorService, AdminService],
})
export class AppModule {}
