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

    async progTrack(userRole: UserRole, data: progressTrackDto, id: number) {

        const {courseId ,videoDuration} = data;

        const student = await this.prisma.user.findFirst({ where: { id } });

        if (isNaN(id)) {
            throw new BadRequestException("User Id is Invalid");
        }
        const course = await this.prisma.course.findUnique({
            where:{
                id: courseId,
            }
        });

        if(!course){
            throw new NotFoundException('Course not found')
        }

        const enrolled = await this.prisma.enrollment.findFirst({
            where:{
                courseId: courseId,
                studentId: student.id,
            }
        });

        if(!enrolled){
            throw new NotFoundException('Student is not enrolled in this course');
        }

        const updateEnrollment = await this.prisma.enrollment.update({
            where:{
                id:enrolled.id
            },
            data:{

            }
        })


    }
}
