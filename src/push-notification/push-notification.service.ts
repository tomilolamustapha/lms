import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PusherService } from 'src/pusher/pusher.service';

@Injectable()
export class PushNotificationService {
    constructor(
        private prisma: PrismaService,
        private pusher :PusherService,
    ){}
}
