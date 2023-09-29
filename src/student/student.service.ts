import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class StudentService {
    constructor (private prisma : PrismaService){}
    async getUserById(id: number) {

        if (isNaN(id)) {
            throw new BadRequestException("Student Id is Invalid");
        }

        const student = await this.prisma.user.findUnique({ where: { id } });

        if (!student ||student.role !== UserRole.Student ) {
            throw new BadRequestException('Tutor Id does not exist');
        }

        return {
            data: student,
            message: "Student Fetched Successfully"
        };
    }
}
