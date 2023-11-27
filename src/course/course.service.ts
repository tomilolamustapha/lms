import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Course, UserRole } from '@prisma/client';
import { courses } from 'prisma/models/courses';
import { PaginateFunction, paginator } from 'prisma/models/paginator';
import { PrismaService } from 'prisma/prisma.service';
import { dataFetchDto } from 'src/user/dto/dataFetchDto.dto';
import { createCourseDto } from './dto/createCourse.dto';
import { User } from 'src/auth/auth.service';
import { enrollmentDto } from './dto/enrollment.dto';
import { createCourseTutorDto } from './dto/createCourseTutor.dto';
import { title } from 'process';
import { courseDataDto } from 'src/admin/dto/courseData.dto';
import { updateCourseDataDto } from 'src/tutor/dto/updateCourseData.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) { }

  async getAllCourses(data: dataFetchDto) {
    const { search_term, page_number, start_date, end_date, page_size, } = data;

    const pageSize = page_size ?? 10;

    const paginate: PaginateFunction = paginator({ perPage: pageSize });

    const startDate = new Date(start_date).toISOString();

    const endDate = new Date(end_date).toISOString();

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0) // set time to 00:00:00.000

    const endOfToday = new Date()
    endOfToday.setHours(23, 59, 59, 999) // set time to 23:59:59.999


    const allCourses = await paginate(this.prisma.course, {
      where: {
        AND: [
          { createdAt: { lte: endDate } },
          { createdAt: { gte: startDate } },
        ],
        OR: [
          { title: { contains: search_term?.toString(), mode: 'insensitive' } },
          { description: { contains: search_term?.toString(), mode: 'insensitive' } },
          { courseCode: { contains: search_term?.toString(), mode: 'insensitive' } },
          { document: { contains: search_term?.toString(), mode: 'insensitive' } },
          { category: { contains: search_term?.toString(), mode: 'insensitive' } },
          { code: { contains: search_term?.toString(), mode: 'insensitive' } },

        ],
      },
      orderBy: {
        id: 'desc',
      },
    }, {
      page: page_number,
      perPage: pageSize,
    });


    return {
      data: allCourses.data,
      meta: allCourses.meta,
      message: "Course fetched successfully"
    }

  }

  async getCourseById(id: number) {

    if (isNaN(id)) {
      throw new BadRequestException("Course Id is Invalid");
    }

    const course = await this.prisma.course.findUnique({ where: { id } });

    if (!course) {
      throw new BadRequestException('Course Id does not exist');
    }

    return {
      data: course,
      message: "Course Fetched Successfully"
    };
  }


  async gettopCourses() {

    const topCourses = await this.prisma.course.findMany({
      take: 6,
      orderBy: {
        students: {
          _count: 'desc',
        },
      },
    });

    return {
      topCourses,
      message: "Courses fetched sucessfully"
    }
  }

  async courseCodes(courseCode: string) {

    const filterCourse = await this.prisma.course.findMany({
      where: { courseCode }
    });


    return {
      filterCourse,
      message: "Course code has been successfully searched"
    }
  }


  async courseCategory(category: string) {

    const filterCourse = await this.prisma.course.findMany({
      where: { category }
    });


    return {
      filterCourse,
      message: "Code have been successfully searched"
    }
  }


  async createCourseAdmin(data: createCourseDto, id: number) {

    const { title, description, courseCode, category, code } = data;

    const admin = await this.prisma.user.findFirst({ where: { id } });

    if (admin || admin.role !== UserRole.Admin) {
      throw new UnauthorizedException('Only Admins and Tutors can create Courses')
    }

    if (isNaN(id)) {
      throw new BadRequestException("User Id is Invalid");
    }

    const existingCourse = await this.prisma.course.findFirst({
      where: {
        courseCode: courseCode
      },
    });

    if (existingCourse) {
      throw new ConflictException('Course code already exists');
    }

    const newCourse = await this.prisma.course.create({
      data: {
        title,
        description,
        courseCode: category + " " + code,
        // document,
        // video,
        category,
        code,
      },
    });

    return {
      newCourse,
      mesaage: " Course created successfully"
    }

  }

  async createCourseTutor(data: createCourseTutorDto, id: number) {

    const { title, description, courseCode, code, category } = data;

    const tutor = await this.prisma.user.findFirst({ where: { id } });

    if (tutor || tutor.role !== UserRole.Tutor) {
      throw new UnauthorizedException('Only Admins and Tutors can create Courses')
    }

    if (isNaN(id)) {
      throw new BadRequestException("User Id is Invalid");
    }

    const existingCourse = await this.prisma.course.findFirst({
      where: {
        courseCode: courseCode
      },
    });

    if (existingCourse) {
      throw new ConflictException('Course code already exists');
    }

    const newCourse = await this.prisma.course.create({
      data: {
        title,
        description,
        courseCode: category + " " + code,
        code,
        category
      },
    });

    return {
      newCourse,
      mesaage: " Course created successfully"
    }

  }

  async deleteCourse(id: number, data: courseDataDto) {

    const admin = await this.prisma.user.findUnique({ where: { id } });

    const tutor = await this.prisma.user.findUnique({ where: { id } });

    if (!admin || admin.role !== UserRole.Admin && !tutor || tutor.role !== UserRole.Tutor) {
      throw new UnauthorizedException('You are not Authorized to perform this action');
    }
    const course = await this.prisma.course.findUnique({ where: { id } })

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found.`)
    }

    await this.prisma.course.delete({
      where: {
        id
      }
    });

    return `Course with title ${title} has been deleted.`
  }


  async enrollCourse(userRole: UserRole, data: enrollmentDto, id: number) {

    const { courseId } = data;

    const student = await this.prisma.user.findFirst({ where: { id } });

    if (!student || student.role !== UserRole.Student) {
      throw new UnauthorizedException('Only Student can enroll for course(s).')
    }

    if (isNaN(id)) {
      throw new BadRequestException("User Id is Invalid");
    }

    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      }
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
      throw new ConflictException('Student is already enrolled in the course')
    }

    const enroll = await this.prisma.enrollment.create({
      data: {
        courseId: courseId,
        studentId: student.id,
      },
    });

    return {
      enroll,
      message: "Student enrolled in the course sucessfully"
    }

  }

  async uploadVideo(courseId: number, title: string, url: string) {

    const videoUpload = await this.prisma.video.create({
      data: {
        title,
        url: url,
        courseId
      }
    });

    return {
      data: videoUpload,
      message: "Video Successfully uploded!"
    }
  }


  async updateVideo(videoId: number, url: string) {
    const existingVideo = await this.prisma.video.findUnique({
      where: {
        id: videoId,
      },
    });

    if (!existingVideo) {
      throw new NotFoundException('Video not found');
    }

    const updatedVideo = await this.prisma.video.update({
      where: {
        id: videoId,

      },
      data: {
        url
      }
    });

    return {
      data: updatedVideo,
      message: 'Video updated successfully',
    };
  }

  async uploadDocument(courseId: number, title: string, url: string) {

    const document = await this.prisma.document.create({
      data: {
        title,
        url: url,
        courseId
      }
    });

    return {
      data: document,
      message: "Document Successfully Uploaded!"
    }
  }

  async updateDocument(documentId: number, url:string) {
    const existingVideo = await this.prisma.video.findUnique({
        where: {
            id: documentId,
        },
    });

    if (!existingVideo) {
        throw new NotFoundException('Video not found');
    }

    const updatedVideo = await this.prisma.video.update({
        where: {
            id: documentId,
            
        },
        data:{
          url
        }
    });

    return {
        data: updatedVideo,
        message: 'Video updated successfully',
    };
}


}
