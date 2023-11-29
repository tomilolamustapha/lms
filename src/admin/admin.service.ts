import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { updateUserDto } from './dto/updateUser.dto';
import { UserRole } from '@prisma/client';
import { userCreation } from './dto/adminCreateDto.dto';
import { StudentService } from 'src/student/student.service';
import { TutorService } from 'src/tutor/tutor.service';
import * as bcrypt from 'bcrypt';
import { updateCourseDataDto } from 'src/tutor/dto/updateCourseData.dto';


@Injectable()
export class AdminService {
    constructor(
        private prisma: PrismaService,
        private student: StudentService,
        private tutor: TutorService
    ) { }


    async updateUserRole(userRole: UserRole, data: updateUserDto) {
        const { firstname, lastname, email, phoneNumber, id } = data

        const admin = await this.prisma.user.findFirst({ where: { id } });

        if (!admin || admin.role !== UserRole.Admin) {
            throw new UnauthorizedException('Only Admins can update User Role')
        }

        if (isNaN(id)) {
            throw new BadRequestException("User Id is Invalid");
        }

        const findUser = await this.prisma.user.findFirst({ where: { id } });

        if (findUser == null) throw new BadRequestException("User Not Found");

        const updateUser = await this.prisma.user.update({
            where: {
                id
            }, data: {
                firstname,
                lastname,
                email,
                phoneNumber
            }
        });

        return {
            updateUser,
            message: "User Updated Successfully"
        };
    }

    async updateUserStatus(id: number, status: boolean) {
        if (isNaN(id)) {
            throw new BadRequestException("User Id is Invalid");
        }
    
        const existingUser = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    
        if (!existingUser) {
            throw new BadRequestException('User not found');
        }
    
        const updateStatus = await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                Status: status, 
            },
        });
    
        return {
            updateStatus,
            message: 'User updated successfully',
        };
    }
      

    async getCourseCode(courseId: number) {

        const course = await this.prisma.course.findUnique({
            where: {
                id: courseId,
            },
            select: {
                courseCode: true,
            },
        });

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        return {
            courseCode: course.courseCode,
            message: 'Course code fetched successfully',
        };
    }


    async addCourse(courseId: number, title: string, description: string, category: string, code: string) {

        const existingCourse = await this.prisma.course.findUnique({
            where: {
                id: courseId,
            },
        });

        if (!existingCourse) {
            throw new NotFoundException('Course not found');
        }


        const updatedCourse = await this.prisma.course.update({
            where: {
                id: courseId,
            },
            data: {
                courseCode: category + " " + code,
                title: title,
                description: description,
                category: category,
            },
        });

        return {
            updatedCourse,
            message: 'Course code added successfully',
        };
    }


    // get all users by role
    async getUserByRole(userRole: UserRole) {
        const users = await this.prisma.user.findMany({

            where: {
                role: userRole
            },
        });

        return {
            users,
            message: "User Role fetched sucessfully."
        }
    }

    async addUser(data: userCreation, password: string, username: string) {
        const { email, role, firstname, lastname, phoneNumber, } = data;

        const useremail = await this.prisma.user.findUnique({ where: { email } })

        const userphone = await this.prisma.user.findUnique({ where: { phoneNumber } })

        if (useremail) {

            throw new BadRequestException('Email Already exists')
        }

        if (userphone) {

            throw new BadRequestException('Phone Number Already exists')
        }


        const hashedPassword = await this.hashPassword(password)


        const adduser = await this.prisma.user.create({
            data: {
                email,
                role,
                firstname,
                lastname,
                fullname: lastname + " " + firstname,
                phoneNumber,
                Status: false,
                password: hashedPassword,
                username,
            },
        });

        return {
            adduser,
            message: "User Created sucessfully."
        }


    }


    async updateAdminCourse(id: number, data: updateCourseDataDto, document: any, video: any) {
        const { title, description, category, code } = data

        const admin = await this.prisma.user.findFirst({ where: { id } });

        if (!admin || admin.role! == UserRole.Admin) {
            throw new UnauthorizedException("Only Admin can update courses")
        }

        if (isNaN(id)) {
            throw new BadRequestException("User Id is Invalid");
        }

        const findCourse = await this.prisma.course.findFirst({ where: { id } });

        if (findCourse == null) throw new BadRequestException('Course Not Found');

        const updateCourse = await this.prisma.course.update({
            where: {
                id
            }, data: {
                title,
                description,
                code,
                category,
                courseCode: category + " " + code,
                video,
                document
            }
        });

        return {
            updateCourse,
            message: "Course Updated Successfully"
        };
    }


    async deleteUser(id: number) {

        if (isNaN(id)) {
            throw new BadRequestException("User Id is Invalid");
        }

        const deleteUsers = await this.prisma.user.delete({
            where: {
                id
            },
        });

        return {
            deleteUsers,
            message: 'User deleted successfully',
        };
    }



    async hashPassword(password: string) {

        const saltOrRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltOrRounds)

        return hashedPassword;
    }


}
