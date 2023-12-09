import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ContentType, UserRole } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EnrollmentService {
    constructor(private prisma : PrismaService){}


    async getAllEnrollments(courseId: number) {
      if (isNaN(courseId)) {
        throw new BadRequestException('Course Id is Invalid');
      }
    
      const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    
      if (!course) {
        throw new BadRequestException('Course Id does not exist');
      }
    
      const enrollments = await this.prisma.enrollment.findMany({
        where: {
          courseId,
        },
        // include: {
        //   student: true, 
        //    content :{
        //     select:{
        //       type : true
        //     }
        //    }
        // },
      });
    
      return {
        enrollments,
        message: 'Enrollments Fetched Successfully',
      };
    }


    async getRecentEnrollments(courseId: number, limit: number = 5) {
      if (isNaN(courseId)) {
        throw new BadRequestException('Course Id is Invalid');
      }
  
      const course = await this.prisma.course.findUnique({ where: { id: courseId } });
  
      if (!course) {
        throw new NotFoundException('Course Id does not exist');
      }
  
      const recentEnrollments = await this.prisma.enrollment.findMany({
        where: {
          courseId,
        },
        orderBy: {
          // updatedAt: 'desc',
        },
        take: limit,
        include: {
          student: true,
          // content:{
          //   select:{
          //     true
          //   }
          // } ,
        },
      });
  
      return {
        recentEnrollments,
        message: 'Recent Enrollments Fetched Successfully',
      };
    }
  
    async updateProgress(enrollmentId: number) {
      const enrollment = await this.prisma.enrollment.update({
        where: {
          id: enrollmentId,
        },
        data: {
        //  updateAt: new Date(),
        },
      });
  
      return {
        data: enrollment,
        message: 'Progress updated successfully',
      };
    }
  }
    
    
      
      
    

