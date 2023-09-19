import { Module } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';

@Module({
  providers: [PushNotificationService]
})
export class PushNotificationModule {}
