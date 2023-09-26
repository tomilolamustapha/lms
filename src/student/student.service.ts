import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';
import * as bcrypt from 'bcrypt';
import { PaginateFunction, paginator } from 'prisma/models/paginator';
import { dataFetchDto } from './dto/dataFetch.dto';
@Injectable()
export class StudentService {
    constructor(
        private prisma : PrismaService,
       //
    ){}
    async hashPassword(password: string) {

        const saltOrRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltOrRounds)

        return hashedPassword;
    }

    async getAllUsers(data: dataFetchDto) {

        const { search_term, page_number, start_date, end_date, page_size, } = data;

        const pageSize = page_size ?? 10;

        const paginate: PaginateFunction = paginator({ perPage: pageSize });

        const startDate = new Date(start_date).toISOString();

        const endDate = new Date(end_date).toISOString();

        
        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0) // set time to 00:00:00.000

        const endOfToday = new Date()
        endOfToday.setHours(23, 59, 59, 999) // set time to 23:59:59.999

        const activeStudent = await this.prisma.student.count({
            where: {
                Status: true
            }
        });

        const inActiveStudent = await this.prisma.student.count({
            where: {
                Status: false
            }
        });

        const newlyRegistered = await this.prisma.student.count({
            where: {
                AND: [
                    { createdAt: { lte: startOfToday.toISOString() } },
                    { createdAt: { gte: endOfToday.toISOString() } },

                ]
            }
        })

        const allStudents = await paginate(this.prisma.student, {
            where: {
              AND: [
                { createdAt: { lte: endDate } },
                { createdAt: { gte: startDate } },
              ],
              OR: [
                { fullname: { contains: search_term?.toString(), mode: 'insensitive' } },
                { firstname: { contains: search_term?.toString(), mode: 'insensitive' } },
                { lastname: { contains: search_term?.toString(), mode: 'insensitive' } },
                { email: { contains: search_term?.toString(), mode: 'insensitive' } },
                { phone: { contains: search_term?.toString(), mode: 'insensitive' } },
                { studentMatric: { contains: search_term?.toString(), mode: 'insensitive' } },
              ],
             
            },
            orderBy: {
              id: 'desc',
            },
          }, {
            page: page_number,
            perPage: pageSize,
          });

          // Calculate the percentage increase/decrease
        const totalStudents= await this.prisma.student.count();
        const activePercentage = ((totalStudents - activeStudent) / totalStudents) * 100;
        const inactivePercentage = ((totalStudents - inActiveStudent) / totalStudents) * 100;
        const newPercentage = (newlyRegistered / totalStudents) * 100;

        return {
            data: allStudents.data,
            meta: allStudents.meta,
            activeStudent,
            inActiveStudent,
            newlyRegistered,
            activePercentage,
            inactivePercentage,
            newPercentage,
            message: "student fetched successfully"
        };
    }

    async getStudentById(id: number) {

        if (isNaN(id)) {
            throw new BadRequestException("Student Id is Invalid");
        }

        const student = await this.prisma.student.findUnique({ where: { id } });

        if (!student) {
            throw new BadRequestException('Student Id does not exist');
        }

        return {
            data: student,
            message: "Student Fetched Successfully"
        };
    }
}
