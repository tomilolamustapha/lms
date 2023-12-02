import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ContentType, UserRole } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { dashboardDto } from './dto/dashboard.dto';
import { PaginateFunction, paginator } from 'prisma/models/paginator';
import { createUserDto } from 'src/user/dto/createUserDto';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async AdminStats(id: number) {

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.role !== UserRole.Admin) {
      throw new UnauthorizedException(
        'Only admins can access these statistics.',
      );
    }


    //calculate total number of students
    const numStudents = await this.prisma.user.count({
      where: {
        role: UserRole.Student,
      },
    });

    //calculate total number of tutors
    const numTutors = await this.prisma.user.count({
      where: {
        role: UserRole.Tutor,
      },
    });

    // calculate total number of courses
    const numCourses = await this.prisma.course.count();

    return {
      message: 'Total Users and Courses Fetched',
      numCourses,
      numStudents,
      numTutors,
    };
  }

  async recentUsers(data: dashboardDto) {
    const { start_date, end_date } = data;

    const paginate: PaginateFunction = paginator({});

    const startDate = new Date(start_date).toISOString();

    const endDate = new Date(end_date).toISOString();

    const recentlyRegisteredStudents = await this.prisma.user.findMany({
      where: {
        role: UserRole.Student,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    const recentlyRegisteredTutors = await this.prisma.user.findMany({
      where: {
        role: UserRole.Tutor,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return {
      data: {
        recentlyRegisteredStudents,
        recentlyRegisteredTutors,
      },
      message: 'Recently Added Users Fetched',
    };
  }

  async getNewUploadedVideos() {
    // Get the last month's videos uploaded by tutors 
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const newUploadedVideos = await this.prisma.content.findMany({
        where: {
          type: ContentType.Video ,
            createdAt: {
                gte: startOfToday.toISOString(),
                lte: endOfToday.toISOString(),
            },
        },
        
        orderBy: {
            createdAt: 'desc',
        },
    });

    return {
        data: newUploadedVideos,
        message: 'New uploaded videos fetched successfully',
    };
}

}
