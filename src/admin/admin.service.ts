import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { createAdminDto } from './dto/createAdmin.dto';
import { hash } from 'bcrypt';
import { userActionDto } from './dto/userAction.dto';
import { threadId } from 'worker_threads';
import { async } from 'rxjs';
import { createUserDto } from './dto/createUser.dto';

import { PaginateFunction, paginator } from 'prisma/models/paginator';
import { adminFetch } from './dto/fetchAdmin.dto';
import { updateAdminRoleDto } from './dto/updateAdmin.dto';
import { adminActionDto } from './dto/adminAction.dto';
import { Tutor } from 'prisma/models/tutor.model';
import { title } from 'process';
import { Student } from 'prisma/models/student.model';
import { createTutorDto } from './dto/createrTutor.dto';

@Injectable()
export class AdminService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async createAdmin(data: createAdminDto) {
        const { email, firstname, lastname, phone } = data

        const findAdminEmail = await this.prisma.admin.findUnique({ where: { email } })

        const findAdminPhone = await this.prisma.admin.findUnique({ where: { phone } })


        if (findAdminEmail) {

            throw new BadRequestException('Email Already exists')
        }

        if (findAdminPhone) {

            throw new BadRequestException('Phone Number Already exists')
        }

        const hashedPassword = await this.generateRandomPasswordAndHash();

        const newAdmin = await this.prisma.admin.create({

            data: {

                firstname: firstname,
                lastname: lastname,
                fullname: firstname + " " + lastname,
                email: email,
                password: hashedPassword,
                phone: phone,
            }
        });

        return {
            message: "Account Created Successfully"
        }
    }

    async userAction(id: number, params: userActionDto) {

        const dto = new userActionDto(params);

        const errorMessage = dto.validate();

        if (errorMessage) {
            throw new BadRequestException(errorMessage);
        }

        if (isNaN(id)) {
            throw new BadRequestException('User Id is Invalid')
        }

        const { type } = params

        const findStudent = await this.prisma.student.findFirst({ where: { id } });

        const findTutor = await this.prisma.tutor.findFirst({ where: { id } });

        if (type == 'enable') {

            const enableStudent = await this.prisma.student.update({
                where: {
                    id
                },
                data: {
                    Status: true

                }
            });

            const enableTutor = await this.prisma.student.update({
                where: {
                    id
                },
                data: {
                    Status: true

                }
            });

            const allStaff = await this.prisma.admin.findMany({
                where: {
                    Status: true
                }
            });

            for (const staff of allStaff) {
                const title = ' User Enabling Notification';
                const adminId = staff.id;

                //await this.pusher.sendNotificationtoAdmin(title, adminId)
            }
            return {
                message: 'User Enabled Sucessfully'
            }
        } else if (type == 'disable') {

            const disableStuent = await this.prisma.student.update({
                where: {
                    id
                },
                data: {
                    Status: false
                }
            });

            const disableTutor = await this.prisma.student.update({
                where: {
                    id
                },
                data: {
                    Status: false
                }
            });

            const allStaff = await this.prisma.admin.findMany({
                where: {
                    Status: true
                }
            });

            for (const staff of allStaff) {
                const title = ' User Enabling Notification';
                const adminId = staff.id;
            }
            //await this.pusher.sendNotificationtoAdmin(title, adminId)
            return {
                message: 'User Disabled Sucessfully'
            }
        }
    }

    async createStudent(data: createUserDto) {

        const { email, firstname, lastname, phoneNumber,studentMatric} = data

        const findStudentEmail = await this.prisma.student.findUnique({ where: { email } })


        const password = Math.random().toString(36).slice(-8);

        const hashedPassword = await hash(password, 10);

        const newStudent = await this.prisma.student.create({

            data: {

                firstname: firstname,
                lastname: lastname,
                fullname: firstname + " " + lastname,
                email: email,
                password: hashedPassword,
                studentMatric: studentMatric,
                phoneNumber: phoneNumber

            }
        });

        const allStaff = await this.prisma.admin.findMany({
            where: {
                Status: true
            }
        });

        for (const staff of allStaff) {

            const title = `Student Account Registration Notification`;
            const content = ` ${findStudentEmail} has successfully created an account on the platform`;
            const adminId = staff.id;

            //await this.pusher.sendNotificationtoAdmin(title, content, adminId)
        }

        return {
            message: "Student Registered",

        }

    }

    async createTutor(data: createTutorDto) {

        const { email, firstname, lastname ,phoneNumber,loginId} = data

        const findTutorEmail = await this.prisma.tutor.findUnique({ where: { email } })

        const password = Math.random().toString(36).slice(-8);

        const hashedPassword = await hash(password, 10);

        const newStudent = await this.prisma.tutor.create({

            data: {

                firstname: firstname,
                lastname: lastname,
                fullname: firstname + " " + lastname,
                email: email,
                password: hashedPassword,
                phoneNumber:phoneNumber ,
                loginId: loginId

            }
        });

        const allStaff = await this.prisma.admin.findMany({
            where: {
                Status: true
            }
        });

        for (const staff of allStaff) {

            const title = `Tutor Account Registration Notification`;
            const content = ` ${findTutorEmail} has successfully created an account on the platform`;
            const adminId = staff.id;

            // await this.pusher.sendNotificationtoAdmin(title, content, adminId)
        }

        return {
            message: "Student Registered",

        }


    }

    async getStaffById(id: number) {

        if (isNaN(id)) {
            throw new BadRequestException("Staff Id is Invalid");
        }

        const user = await this.prisma.admin.findUnique({
            where: {
                id
            },
        });

        if (!user) {
            throw new BadRequestException('Staff Id does not exist');
        }

        return {
            data: user,
            message: "Staf Fetched Successfully"
        };
    }

    async getAllStaffs(data: adminFetch) {

        const { search_term, page_number, start_date, end_date, page_size, } = data;

        const pageSize = page_size ?? 10;

        const paginate: PaginateFunction = paginator({ perPage: pageSize });

        const startDate = new Date(start_date).toISOString();

        const endDate = new Date(end_date).toISOString();

        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0) // set time to 00:00:00.000

        const endOfToday = new Date()
        endOfToday.setHours(23, 59, 59, 999) // set time to 23:59:59.999

        const newlyRegistered = await this.prisma.admin.count({
            where: {
                AND: [
                    { createdAt: { lte: startOfToday.toISOString() } },
                    { createdAt: { gte: endOfToday.toISOString() } },

                ]
            }
        });

        const totalStaffs = await this.prisma.admin.count();

        const allUsers = await paginate(this.prisma.admin, {

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
                    { course: { contains: search_term?.toString(), mode: 'insensitive' } },

                ],

            },
            orderBy: {
                id: 'desc',
            },
        },
            {
                page: page_number,
                perPage: pageSize
            }
        );

        return {
            data: allUsers.data,
            meta: allUsers.meta,
            totalStaffs,
            message: "Staffs fetched Successfully"
        }
    }

    async updateAdminRole(data: updateAdminRoleDto) {
        const findAdmin = await this.prisma.admin.findFirst({ where: { id: data.id } })

        if (!findAdmin) throw new BadRequestException('Staff does Not Exist');

        const updateRole = await this.prisma.admin.update({
            where: {
                id: findAdmin.id
            }, data: {
                //role: data.role,
            }
        });

        const emailContent = {
            firstname: findAdmin.firstname,
            content: `Congratulations, your role has been changed successfully.`,
            warning: "Please note that the Super Admin authorized this change.",
            header: "Role Changed Successfully"
        }

        //await this.emailService.sendEmail(emailContent, "adminInfo", findAdmin.email, "Role Changed Successfully");

        const allStaff = await this.prisma.admin.findMany({
            where: {
                Status: true
            }
        });

        for (const staff of allStaff) {

            const title = `Role Update Alert`;
            const content = `${findAdmin.fullname} role has just been updated successfully`;
            const adminId = staff.id;

            // await this.pusher.sendNotificationtoAdmin(title, content, adminId)
        }

        return {
            "message": "Admin Role Updated Successfully"
        }
    }

    async adminAction(id: number, params: adminActionDto) {

        const dto = new adminActionDto(params);
        const errorMessage = dto.validate();
        if (errorMessage) {
            throw new BadRequestException(errorMessage);
        }

        const { type } = params

        const findAdmin = await this.prisma.admin.findFirst({ where: { id } });

        if (findAdmin == null) throw new BadRequestException("Admin Not Found");


        if (type == "enable") {

            const enableAdmin = await this.prisma.admin.update({
                where: {
                    id
                },
                data: {
                    Status: true
                }
            });

            const allStaff = await this.prisma.admin.findMany({
                where: {
                    Status: true
                }
            });

            for (const staff of allStaff) {

                const title = `Admin Enabled`;
                const content = `${findAdmin.fullname}'s account has been enabled successfully`;
                const adminId = staff.id;

                // await this.pusher.sendNotificationtoAdmin(title, content, adminId)
            }

        } else if (type == "disable") {

            const disableAdmin = await this.prisma.admin.update({
                where: {
                    id
                },
                data: {
                    Status: false
                }
            });

            const allStaff = await this.prisma.admin.findMany({
                where: {
                    Status: true
                }
            });

            for (const staff of allStaff) {

                const title = `Admin Disabled`;
                const content = `${findAdmin.fullname}'s account has been disabled`;
                const adminId = staff.id;

                //await this.pusher.sendNotificationtoAdmin(title, content, adminId)
            }
        }

        return {
            message: "Admin Updated Successfully"
        }

    }

    async filterByTutorAndCourse(title : string , tutorId : number){

        const courses = await this.prisma.course.findMany({
            where:{
                AND:[
                    { id: tutorId},
                    {title : title}
                    
                ]
            }
        });

        return courses;

    }



    async generateRandomPasswordAndHash(): Promise<string> {
        // Generate a random 8-character password
        const password = Math.random().toString(36).slice(-8);

        // Hash the password with bcrypt
        const hashedPassword = await hash(password, 10);

        // Return the hashed password
        return hashedPassword;
    }

}

