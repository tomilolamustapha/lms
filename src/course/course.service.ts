import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ContentType, UserRole } from '@prisma/client';
import { PaginateFunction, paginator } from 'prisma/models/paginator';
import { PrismaService } from 'prisma/prisma.service';
import { dataFetchDto } from 'src/user/dto/dataFetchDto.dto';
import { createCourseDto } from './dto/createCourse.dto';
import { enrollmentDto } from './dto/enrollment.dto';
import { title } from 'process';
import { courseDataDto } from 'src/admin/dto/courseData.dto';
import { type } from 'os';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) { }

  async getAllCourses(data: dataFetchDto) {
    const { search_term, page_number, start_date, end_date, page_size } = data;

    const pageSize = page_size ?? 10;

    const paginate: PaginateFunction = paginator({ perPage: pageSize });

    const startDate = new Date(start_date).toISOString();

    const endDate = new Date(end_date).toISOString();

    const allCourses = await paginate(
      this.prisma.course,
      {
        where: {
          AND: [
            { createdAt: { lte: endDate } },
            { createdAt: { gte: startDate } },
          ],
          OR: [
            {
              title: { contains: search_term?.toString(), mode: 'insensitive' },
            },
            {
              description: {
                contains: search_term?.toString(),
                mode: 'insensitive',
              },
            },
            {
              courseCode: {
                contains: search_term?.toString(),
                mode: 'insensitive',
              },
            },
            {
              document: {
                contains: search_term?.toString(),
                mode: 'insensitive',
              },
            },
            {
              category: {
                contains: search_term?.toString(),
                mode: 'insensitive',
              },
            },
            {
              code: { contains: search_term?.toString(), mode: 'insensitive' },
            },
          ],
        },
        orderBy: {
          id: 'desc',
        },
      },
      {
        page: page_number,
        perPage: pageSize,
      },
    );

    return {
      data: allCourses.data,
      meta: allCourses.meta,
      message: 'Course fetched successfully',
    };
  }

  async getCourseById(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('Course Id is Invalid');
    }

    const course = await this.prisma.course.findUnique({ where: { id } });

    if (!course) {
      throw new BadRequestException('Course Id does not exist');
    }

    return {
      data: course,
      message: 'Course Fetched Successfully',
    };
  }

  // async gettopCourses() {
  //   const topCourses = await this.prisma.course.findMany({
  //     take: 6,
  //     orderBy: {
  //       students: {
  //         _count: 'desc',
  //       },
  //     },
  //   });

  //   return {
  //     topCourses,
  //     message: 'Courses fetched sucessfully',
  //   };
  // }

  async courseCodes(courseCode: string) {
    const filterCourse = await this.prisma.course.findMany({
      where: { courseCode },
    });

    return {
      filterCourse,
      message: 'Course code has been successfully searched',
    };
  }

  async courseCategory(category: string) {
    const filterCourse = await this.prisma.course.findMany({
      where: { category },
    });

    return {
      filterCourse,
      message: 'Code have been successfully searched',
    };
  }

  async createCourse(data: createCourseDto, id: number) {

    const { title, description, courseCode, category, code, } = data;

    const user = await this.prisma.user.findFirst({ where: { id } })


    if (user.role !== UserRole.Tutor && user.role !== UserRole.Admin) {
      throw new UnauthorizedException(
        'Only Admin and Tutors can create Courses',
      );
    }


    const existingCourse = await this.prisma.course.findFirst({
      where: {
        courseCode: courseCode,
      },
    });

    if (existingCourse) {
      throw new ConflictException('Course code already exists');
    }

    const newCourse = await this.prisma.course.create({
      data: {
        title,
        description,
        courseCode: category + ' ' + code,
        category,
        code,
        userId: user.id,
      },
    });

    return {
      newCourse,
      mesaage: ' Course created successfully',
    };
  }

  async deleteCourse(id: number, data: courseDataDto) {
    const admin = await this.prisma.user.findUnique({ where: { id } });

    const tutor = await this.prisma.user.findUnique({ where: { id } });

    if (
      !admin ||
      (admin.role !== UserRole.Admin && !tutor) ||
      tutor.role !== UserRole.Tutor
    ) {
      throw new UnauthorizedException(
        'You are not Authorized to perform this action',
      );
    }
    const course = await this.prisma.course.findUnique({ where: { id } });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found.`);
    }

    await this.prisma.course.delete({
      where: {
        id,
      },
    });

    return `Course with title ${title} has been deleted.`;
  }

  async enrollCourse(userRole: UserRole, data: enrollmentDto, id: number) {
    const { courseId } = data;

    const student = await this.prisma.user.findFirst({ where: { id } });

    if (!student || student.role !== UserRole.Student) {
      throw new UnauthorizedException('Only Student can enroll for course(s).');
    }

    if (isNaN(id)) {
      throw new BadRequestException('User Id is Invalid');
    }

    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found.`);
    }

    const isEnrolled = await this.prisma.enrollment.findFirst({
      where: {
        courseId: courseId,
        studentId: student.id,
      },
    });

    if (isEnrolled) {
      throw new ConflictException('Student is already enrolled in the course');
    }

    const enroll = await this.prisma.enrollment.create({
      data: {
        courseId: courseId,
        studentId: student.id,
      },
    });

    return {
      enroll,
      message: 'Student enrolled in the course sucessfully',
    };
  }

  async uploadVideo(courseId: number, title: string, url: string) {

    const existingCourse = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!existingCourse) {
      throw new NotFoundException('Course not found!');
    }

    const videoUpload = await this.prisma.content.create({
      data: {
        title,
        url: url,
        courseId,
        type: ContentType.Video
      },
    });

    return {
      data: videoUpload,
      message: 'Video Successfully uploded!',
    };
  }

  async uploadDocument(courseId: number, title: string, url: string) {

    const existingCourse = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!existingCourse) {
      throw new NotFoundException('Course not found!');
    }

    const documentUpload = await this.prisma.content.create({
      data: {
        title,
        url: url,
        courseId,
        type: ContentType.Document,
      },
    });

    return {
      data: documentUpload,
      message: 'Document Successfully Uploaded!',
    };
  }


  async getAllCourse() {

    const getcourse = await this.prisma.course.findMany();

    return {
      getcourse,
      message: 'All courses have been fetched successfully!',
    };
  }


  async getRecentlyUploadedCourses(userId: number, limit: number = 5) {

    const existingTutor = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingTutor) {
      throw new NotFoundException('Tutor not found');
    }

    const recentlyUploadedCourses = await this.prisma.course.findMany({
      where: {
        id: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        students: true, // Include the students (enrollments) associated with each course
      },
    });

    return {
      recentlyUploadedCourses,
      message :"Recently Uploaded Courses Fetched Suceesfully!"
    };
  }


  async deleteUploadedVideo(contentId: number) {
    
    const existingVideo = await this.prisma.content.findUnique({
      where: {
        id: contentId,
      },
    });
  
    if (!existingVideo) {
      throw new NotFoundException('Video not found');
    }
  
    // Delete the video file *you need to implement the logic to delete the actual video file from storage*
  
    // Delete the video record from the database
    await this.prisma.content.delete({
      where: {
        id: contentId,
      },
    });
  
    return {
      message: 'Uploaded video successfully deleted',
    };
  }
  
  async deleteUploadedDocument(contentId: number) {

    const existingDocument = await this.prisma.content.findUnique({
      where: {
        id: contentId,
      },
    });
  
    if (!existingDocument) {
      throw new NotFoundException('Document not found');
    }
  
    // Delete the document file *you need to implement the logic to delete the actual document file from storage*
  
    // Delete the document record from the database
    await this.prisma.content.delete({
      where: {
        id: contentId,
      },
    });
  
    return {
      message: 'Uploaded document successfully deleted',
    };
  }

  async generateCustomUniqueId() {

    const timestamp = new Date().getTime().toString(36);
    const randomString = Math.random().toString(36).substring(2, 8);
    const uniqueId = `${timestamp}-${randomString}`;
  
    return {
      uniqueId,
      message: 'Id generated successfully',
    };
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
