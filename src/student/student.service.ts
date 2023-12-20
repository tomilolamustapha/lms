import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('Student Id is Invalid');
    }

    const student = await this.prisma.user.findUnique({ where: { id } });

    if (!student || student.role !== UserRole.Student) {
      throw new BadRequestException('Tutor Id does not exist');
    }

    return {
      data: student,
      message: 'Student Fetched Successfully',
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

    return {
      studentEnrollments,
      message: 'Enrolled courses fetched successfully',
    };
  }

  async getEnrollmentByIdWithContent(enrollmentId: number) {
    const enrollmentWithContent = await this.prisma.enrollment.findUnique({
      where: {
        id: enrollmentId,
      },
      include: {
        course: {
          include: {
            content: true,
          },
        },
        student: true,
      },
    });

    if (!enrollmentWithContent) {
      throw new NotFoundException(
        `Enrollment with ID "${enrollmentId}" not found.`,
      );
    }

    return {
      enrollment: enrollmentWithContent,
      message: 'Enrollment details with content fetched successfully',
    };
  }

  async getRecentEnrollmentsByStudent(studentId: number, limit: number = 4) {
    const recentEnrollments = await this.prisma.enrollment.findMany({
      where: {
        studentId: studentId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
    });

    return {
      recentEnrollments,
      message: 'Recent enrollments fetched successfully',
    };
  }
}
