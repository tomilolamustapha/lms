import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { updateUserDto } from './dto/updateUser.dto';
import { UserRole } from '@prisma/client';
import { userActionDto } from './dto/userActionDto';
import { userCreation } from './dto/adminCreateDto.dto';
import { StudentService } from 'src/student/student.service';
import { TutorService } from 'src/tutor/tutor.service';
import * as bcrypt from 'bcrypt';


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
            message: "User Updated Successfully"
        };
    }

    async userAction(id: number, params: userActionDto) {
        const dto = new userActionDto(params);
        const errorMessage = dto.validate();
        if (errorMessage) {
            throw new BadRequestException(errorMessage);
        }

        if (isNaN(id)) {
            throw new BadRequestException("User Id is Invalid");
        }

        const { type } = params

        const findUser = await this.prisma.user.findFirst({ where: { id } });

        if (findUser == null) throw new BadRequestException("User Not Found");


        if (type == "enable") {

            const enableUser = await this.prisma.user.update({
                where: {
                    id
                },
                data: {
                    Status: true
                }
            });

            return {
                message: 'User Enabled Successfully'
            }
        } else if (type == 'disable') {

            const disableUser = await this.prisma.user.update({
                where: {
                    id
                },
                data: {
                    Status: false
                }
            });
        }
        return {
            message: "User Disabled Sucessfully"
        }


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


    async addCourse(courseId: number, courseCode: string , title : string , description: string , category : string) {

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
                courseCode: courseCode,
                title : title,
                description: description,
                category : category,
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
        const { email, role, firstname, lastname, phoneNumber,} = data;

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
                password : hashedPassword,
                username,
            },
        });

        return {
            adduser,
            message: "User Created sucessfully."
        }


    }


    async hashPassword(password: string) {

        const saltOrRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltOrRounds)

        return hashedPassword;
    }


}
