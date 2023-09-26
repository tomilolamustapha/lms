import { Module } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { PusherService } from 'src/pusher/pusher.service';

@Module({
  providers: [PushNotificationService, PusherService],
})
export class PushNotificationModule {}
