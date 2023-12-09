import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ContentType, UserRole } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { updateCourseDataDto } from './dto/updateCourseData.dto';
import { CourseService } from 'src/course/course.service';

@Injectable()
export class TutorService {
  constructor(
    private prisma: PrismaService,
    private course: CourseService,
  ) { }

  async getUserById(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('Tutor Id is Invalid');
    }

    const tutor = await this.prisma.user.findUnique({ where: { id } });

    if (!tutor || tutor.role !== UserRole.Tutor) {
      throw new BadRequestException('Tutor Id does not exist');
    }

    return {
      data: tutor,
      message: 'Tutor Fetched Successfully',
    };
  }

  async updateTutorCourse(id: number, data: updateCourseDataDto) {
    const { title, description, category, code } = data;

    const tutor = await this.prisma.user.findFirst({ where: { id } });

    if (!tutor || tutor.role! == UserRole.Tutor) {
      throw new UnauthorizedException('Only Tutors can update courses');
    }

    if (isNaN(id)) {
      throw new BadRequestException('User Id is Invalid');
    }

    const findCourse = await this.prisma.course.findFirst({ where: { id } });

    if (findCourse == null) throw new BadRequestException('Course Not Found');

    const updateCourse = await this.prisma.course.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        code,
        courseCode: category + ' ' + code,
      },
    });

    return {
      updateCourse,
      message: 'Course Updated Successfully',
    };
  }

  // async getTutorStats(userId: number) {
  //   const existingTutor = await this.prisma.user.findUnique({
  //     where: {
  //       id: userId,
  //     },
  //   });

  //   if (!existingTutor) {
  //     throw new NotFoundException('Tutor not found');
  //   }

  //   const totalCourses = await this.prisma.course.count({
  //     where: {
  //       userId: existingTutor.id,
  //     },
  //   });

  //   const totalContents = await this.prisma.content.count({
  //     where: {
  //       content : true
  //       },
  //   });

  //   const totalStudentsEnrolled = await this.prisma.enrollment.count({
  //     where: {
  //       courseId: {
  //         in: (await this.prisma.course.findMany({
  //           where: {
  //             userId: existingTutor.id,
  //           },
  //           select: {
  //             userId: true,
  //           },
  //         })).map((course) => course.userId),
  //       },
  //     },
  //   });

  //   return {
  //     totalCourses,
  //     totalContents,
  //     totalStudentsEnrolled,
  //     message: 'Totals Courses Fetched Successfully',
  //   };
  // }

  async getTutorStats(userId: number) {
    
    const existingTutor = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingTutor) {
      throw new NotFoundException('Tutor not found');
    }

    const courses = await this.prisma.course.findMany({
      where: {
        userId: existingTutor.id,
      },
      include: { content: true, students: true },
    });

    const totalCourses = courses.length;

    let totalVideos = 0;
    let totalDocuments = 0;
    let totalStudentsEnrolled = 0;

    // Iterate through each course to calculate totals
    courses.forEach((course) => {
      // Calculate total videos and documents in each course
      totalVideos += course.content.filter((c) => c.type === ContentType.Video).length;
      totalDocuments += course.content.filter((c) => c.type === ContentType.Document).length;

      // Calculate total students enrolled in each course
      totalStudentsEnrolled += course.students.length;
    });

    return {
      totalCourses,
      totalVideos,
      totalDocuments,
      totalStudentsEnrolled,
      message: 'Totals Courses Fetched Successfully',
    };
  }



  async getAllTutorCourse(userId: number) {
    const existingTutor = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingTutor) {
      throw new NotFoundException('Tutor not found');
    }

    const allCourse = await this.prisma.course.findMany({
      where: {
        userId: existingTutor.id,
      },
    });

    return {
      allCourse,
      message: "All courses fetched successfully"
    }
  }


  async getEnrolledStudentsCount(courseId: number) {

    const existingCourse = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!existingCourse) {
      throw new NotFoundException('Course not found');
    }

    const enrolledStudentsCount = await this.prisma.enrollment.count({
      where: {
        courseId: existingCourse.id,
      },
    });


    return {
      enrolledStudentsCount,
      message: 'Enrolled students count fetched successfully',
    };
  }







}






