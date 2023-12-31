import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ContentType, CourseStats, Prisma, UserRole } from '@prisma/client';
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

    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        content: true
      }
    });

    if (!course) {
      throw new BadRequestException('Course Id does not exist');
    }

    return {
      data: course,
      message: 'Course Fetched Successfully',
    };
  }

  async gettopCourses() {

    const topCourses = await this.prisma.course.findMany({
      where: {
        status: 'isPublished',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6,
    });

    return {
      topCourses,
      message: 'Top 6 published courses fetched successfully',
    };
  }


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

  async enrollCourse(courseId : number , id: number) {

   
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

    if (course.status !== CourseStats.isPublished) {
      throw new BadRequestException('Course is not published, enrollment is not allowed.');
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

  async uploadVideo(courseId: number, title: string, url: string, instruction: string ,duration : number) {

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
        type: ContentType.Video,
        instruction,
        duration,
      },
    });

    return {
      data: videoUpload,
      message: 'Video Successfully uploded!',
    };
  }

  async uploadDocument(courseId: number, title: string, url: string, instruction: string, duration : number) {

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
        instruction,
        duration,
      } 
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
        id: userId
      },
    });

    if (!existingTutor) {
      throw new NotFoundException('Tutor not found');
    }

    const recentlyUploadedCourses = await this.prisma.course.findMany({
      where: {
        userId: userId,
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
      message: "Recently Uploaded Courses Fetched Suceesfully!"
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

  async getAllCoursesWithUser() {

    const coursesWithCreators = await this.prisma.course.findMany({
      include: {
        user: true,
      },
    });

    return {
      data: coursesWithCreators,
      message: 'Courses with creators fetched successfully',
    };
  }

  async getCourseWithEnrollmentStats(courseId: number) {

    if (isNaN(courseId)) {
      throw new BadRequestException('Course Id is Invalid');
    }

    const course = await this.prisma.course.findMany({
      where: {
        id: courseId,
        status: 'isPublished'
      },
    });

    if (!course) {
      throw new BadRequestException('Course Id does not exist');
    }

    const enrollmentStats = await this.prisma.enrollment.count({
      where: {
        courseId,
      },
    });

    const data = Object.assign({}, { course, enrollment: enrollmentStats });

    return {
      data,
      message: 'Course with enrollment stats fetched successfully',
    };
  }


  async getCoursesWithContentAndUserForAdmin() {

    const coursesWithContentAndUser = await this.prisma.course.findMany({
      include: {
        content: true,
        user: true,
      },
    });

    return {
      coursesWithContentAndUser,
      message: 'Courses with content and user details fetched successfully for admin',
    };
  }

  async updateCourseStatus(courseId: number, userId: number, newStatus: CourseStats, allowedRole: UserRole) {


    const user = await this.prisma.user.findFirst({ where: { id: userId } });
  
    if (!user || user.role !== allowedRole) {
      throw new UnauthorizedException(`Only ${allowedRole}s can perform this action.`);
    }
  
    if (isNaN(courseId)) {
      throw new BadRequestException('Course ID is Invalid');
    }
  
    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        content: true,
      },
    });
  
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found.`);
    }
  
    if (course.status === newStatus) {
      throw new ConflictException(`Course is already ${newStatus}.`);
    }
  
    if (newStatus === CourseStats.isPublished && (!course.content || course.content.length === 0)) {
      throw new BadRequestException('Cannot publish a course without content.');
    }
  
    // Update the course status
    const updatedCourse = await this.prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        status: newStatus,
      },
    });
  
    const action = newStatus === CourseStats.isPublished ? 'isPublished' : 'withdrawn';
  
    return {
      course: updatedCourse,
      message: `Course ${action} successfully.`,
    };
  }

  async calculateVideoProgress(contentId: number, userId: number) {

    const content = await this.prisma.content.findUnique({
      where: {
        id: contentId,
      },
    });
  
    if (!content) {
      throw new NotFoundException(`Content with ID "${contentId}" not found.`);
    }
  
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        watchedContents: {
          where: {
            id: contentId,
          },
        },
      },
    });
  
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }
  
    const { duration } = content;

    const timeWatched = user.watchedContents?.[0]?.timeWatched || 0;
  
    // Calculate progress percentage
    const progressPercentage = (timeWatched / duration) * 100;
  
    // Calculate progress per hour
    const progressPerHour = (timeWatched / duration) * 60; // Assuming duration is in minutes
  
    return {
      progressPercentage,
      progressPerHour,
      message : 'Progress Tracked fetched successfully'
    };
  }
  
  async getAllPublished(){

    const publishedCourses = await this.prisma.course.findMany({
      where:{
        status : CourseStats.isPublished
      },
    });


    return{
      publishedCourses,
      message: 'Published courses fetched'
    }

  }
   

}