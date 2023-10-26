import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailService } from './email.service';
import { EmailProcessor } from './email.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [EmailService, EmailProcessor],
  exports: [BullModule, EmailService]
})
export class EmailModule {}
