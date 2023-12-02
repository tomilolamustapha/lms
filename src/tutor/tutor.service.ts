import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ContentType, UserRole } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { updateCourseDataDto } from './dto/updateCourseData.dto';
import { CourseService } from 'src/course/course.service';
import { courses } from 'prisma/models/courses';
import { userActionDto } from 'src/admin/dto/userActionDto';

@Injectable()
export class TutorService {
  constructor(private prisma: PrismaService,
    private course: CourseService) { }

  async getUserById(id: number) {

    if (isNaN(id)) {
      throw new BadRequestException("Tutor Id is Invalid");
    }

    const tutor = await this.prisma.user.findUnique({ where: { id } });

    if (!tutor || tutor.role !== UserRole.Tutor) {
      throw new BadRequestException('Tutor Id does not exist');
    }

    return {
      data: tutor,
      message: "Tutor Fetched Successfully"
    };
  }


  async updateTutorCourse(id: number, data: updateCourseDataDto,) {
    const { title, description, category, code } = data

    const tutor = await this.prisma.user.findFirst({ where: { id } });

    if (!tutor || tutor.role! == UserRole.Tutor) {
      throw new UnauthorizedException("Only Tutors can update courses")
    }

    if (isNaN(id)) {
      throw new BadRequestException("User Id is Invalid");
    }

    const findCourse = await this.prisma.course.findFirst({ where: { id } });

    if (findCourse == null) throw new BadRequestException('Course Not Found');

    const updateCourse = await this.prisma.course.update({
      where: {
        id
      }, data: {
        title,
        description,
        code,
        courseCode: category + " " + code,
      }
    });

    return {
      updateCourse,
      message: "Course Updated Successfully"
    };
  }



  async getTutorStats(userId: number) {

    const existingTutor = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingTutor) {
      throw new NotFoundException('Tutor not found');
    }

    const totalCourses = await this.prisma.course.count({
      where: {
      userId: existingTutor.id
      },
    });

    const totalVideos = await this.prisma.content.count({
      where: {
       type : ContentType.Video,
      }
    });
    const totalDocuments = await this.prisma.content.count({
      where: {
       type :ContentType.Document,
      }
    });

    return {
      totalCourses,
      totalVideos,
      totalDocuments,
      message: 'Totals Courses Fetched Successfully',
    };
  }

  async getAllTutorCourse(userId : number){

    const existingTutor = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingTutor) {
      throw new NotFoundException('Tutor not found');
    }

    const allCourse = await this.prisma.course.findMany({
      where:{
        userId: existingTutor.id
      }
    });

    return{
      allCourse,
      message:"All courses fetched successfully"
    }
  }

  
  
  


  



}






