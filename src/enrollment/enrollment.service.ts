import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EnrollmentService {
    constructor(private prisma : PrismaService){}

    async enroll(studentId: number, courseId){

        const student = await this.prisma.user.findUnique({
            where: {
              id: studentId,
            },
          });
      
          if (!student || student.role !== UserRole.Student) {
            throw new BadRequestException('User not found or not a student');
          }


          const course = await this.prisma.course.findUnique({
            where: {
              id: courseId,
            },
          });
      
          if (!course) {
            throw new BadRequestException('Course not found');
          }
      
          // Check if the user is already enrolled in the course
          const existingEnrollment = await this.prisma.enrollment.findFirst({
            where: {
              studentId: studentId,
              courseId: courseId,
            },
        });

            if (existingEnrollment) {
                throw new BadRequestException('User is already enrolled in this course');
              }
          
            // Create the enrollment record
            const enrollment = await this.prisma.enrollment.create({
                data: {
                  studentId: studentId,
                  courseId: courseId,
                },
              });


              return{
                 enrollment,
                message:`Course with title ${course} has been successfully enrolled for.`
              }
          
      
    }
}
