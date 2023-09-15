import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TutorService } from './tutor/tutor.service';
import { TutorController } from './tutor/tutor.controller';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';

@Module({
  imports: [],
  controllers: [AppController, UserController, TutorController, AdminController],
  providers: [AppService, UserService, TutorService, AdminService],
})
export class AppModule {}
