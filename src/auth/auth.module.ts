import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { UserService } from 'src/user/user.service';
import { UserJwtStrategy } from './strategies/user.strategy';

@Module({
  imports: [JwtModule.register({}), EmailModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, EmailService, UserJwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
