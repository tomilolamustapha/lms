import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PusherService } from 'src/pusher/pusher.service';
import { sendNotificationDto } from './dto/sendNotification.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class PushNotificationService {
    constructor(
        private prisma: PrismaService,
        private pusher :PusherService,
    ){}


    async createNotification(id : number, data :sendNotificationDto){

        const admin = await this.prisma.user.findFirst({ where: { id } });

        if (!admin || admin.role !== UserRole.Admin) {
            throw new UnauthorizedException('Only Admins can get this notification')
        }

        if (isNaN(id)) {
            throw new BadRequestException("User Id is Invalid");
        }

        return{
            message:"Push Notification Sent Successfully"
        }
    }


    async sendNotificationton(title :string ,content :string, id: number){

        const newNotification = await this.prisma.notification.create({
            data:{
                title,
                content,
                id
            }
        });

        return{
            newNotification,
            message: 'Notification Successfully Sent!'
        }

    }


    async readUserNotificatin(userId :number ,notificationId:number){

        const findNotification = await this.prisma.notification.findFirst({
            where:{
                id: Number(notificationId),
                userId
            }
        });

        if(findNotification){

            const currentDate = new Date();
            const readNotification  = await this.prisma.notification.update({
                where:{
                    id: Number(notificationId),
                },
                data:{
                    is_read: true,
                    read_at: currentDate
                }
            });

            return {
                message: "Notification Read Successfully"
            }
        }

        throw new BadRequestException("Notification Not Found");
    }


    async getUserNotification(userId: number){

        const findNotifications = await this.prisma.notification.findMany({
            where:{
                userId:Number(userId),
                is_read: false
            },
            orderBy: {
                createdAt: 'desc'
            },
        });


             // Section notifications by common dates
             const sections = [];
             let currentDate = '';
 
             for (const notification of findNotifications) {
             const notificationDate = notification.createdAt.toISOString().split('T')[0];
 
             if (notificationDate !== currentDate) {
                 currentDate = notificationDate;
                 sections.push({ date: currentDate, notifications: [notification] });
             } else {
                 sections[sections.length - 1].notifications.push(notification);
             }
             }
 

        return {
            data: sections,
            message: "Notifications Fetched Successfully"
        }

    }

    async deleteNotification(id: number){

        await this.prisma.pushNotifications.delete({
            where: {
              id: Number(id)
            }
          });


          return {
            message: "Deleted Successfully"
        }
    }


    
    async NotificationList(){

        const notifications = await this.prisma.pushNotifications.findMany();

        return {
            data: notifications,
            message: "Notifications List Fetched"
        }
    }


    
}
