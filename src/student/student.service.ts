import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { progressTrackDto } from 'src/course/dto/updateprogress.dto';

@Injectable()
export class StudentService {
    constructor(private prisma: PrismaService) { }
    async getUserById(id: number) {

        if (isNaN(id)) {
            throw new BadRequestException("Student Id is Invalid");
        }

        const student = await this.prisma.user.findUnique({ where: { id } });

        if (!student || student.role !== UserRole.Student) {
            throw new BadRequestException('Tutor Id does not exist');
        }

        return {
            data: student,
            message: "Student Fetched Successfully"
        };
    }


    async getCoursesEnrolledByStudent(studentId: number) {
        
        const studentEnrollments = await this.prisma.enrollment.findMany({
          where: {
            studentId: studentId,
          },
          include: {
            course: true,
          },
        });
      
        const enrolledCourses = studentEnrollments.map((enrollment) => enrollment.course);
      
        return {
          enrolledCourses,
          message: 'Enrolled courses fetched successfully',
        };
      }
      
}
