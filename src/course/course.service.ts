import { BadRequestException, Injectable } from '@nestjs/common';
import { Course, UserRole } from '@prisma/client';
import { courses } from 'prisma/models/courses';
import { PaginateFunction, paginator } from 'prisma/models/paginator';
import { PrismaService } from 'prisma/prisma.service';
import { dataFetchDto } from 'src/user/dto/dataFetchDto.dto';
import { createCourseDto } from './dto/createCourse.dto';

@Injectable()
export class CourseService {
    constructor( private prisma :PrismaService){}

    async  getAllCourses(data:dataFetchDto){
        const { search_term, page_number, start_date, end_date, page_size,} = data;

        const pageSize = page_size ?? 10;

        const paginate: PaginateFunction = paginator({ perPage: pageSize });

        const startDate = new Date(start_date).toISOString();

        const endDate = new Date(end_date).toISOString();

        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0) // set time to 00:00:00.000

        const endOfToday = new Date()
        endOfToday.setHours(23, 59, 59, 999) // set time to 23:59:59.999
        
        const newlyUploaded = await this.prisma.course.count({
            where: {
                AND: [
                    { createdAt: { lte: startOfToday.toISOString() } },
                    { createdAt: { gte: endOfToday.toISOString() } },

                ]
            }
        });

        const allCourses = await paginate(this.prisma.user, {
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
            data : allCourses.data,
            meta: allCourses.meta,
            newlyUploaded,
            message : "Course fetched successfully"
          }

    }

    async getCourseById(id: number) {

      if (isNaN(id)) {
          throw new BadRequestException("Tutor Id is Invalid");
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

  async uploadVideo(courseId : number, title : string, url:string){

    const videoUpload = await this.prisma.video.create({
      data:{
        title,
        url: url,
        courseId
      }
    });

    return{
      data : videoUpload,
      message: "Video Successfully uploded!"
    }
  }

  async uploadDocument(courseId : number ,title: string, url:string){

    const document = await this.prisma.document.create({
      data:{
        title,
        url : url,
        courseId
      }
    });

    return{
      data: document,
      message : "Document Successfully Uploaded!"
    }
  }

  async courseCategory(courseCode: string){

    const filterCourse = await this.prisma.course.findMany({
      where: {courseCode}
    });


    return{
      filterCourse,
      message : "Course code have been successfully searched"
    }
  }


  async gettopCourses(){

    const topCourses = await this.prisma.course.findMany({
      take: 6,
      orderBy:{
        students:{
          _count : 'desc',
        },
      },
    });

    return{
      topCourses,
      message : "Courses fetched sucessfully"
    }
  }
   

  async createCourse(data :createCourseDto){

    const {title, description, courseCode, tutorId} = data;

    const newCourse = await this.prisma.course.create({
      data:{
        title,
        description,
        courseCode,
        tutorId
      },
    });

    return{
      newCourse,
      mesaage :" Course created successfully"
    }

  }



}
