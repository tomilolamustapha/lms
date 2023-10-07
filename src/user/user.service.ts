import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { title } from 'process';
import { courseDataDto } from 'src/admin/dto/courseData.dto';
import { createUserDto } from './dto/createUserDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async registerUser(data: createUserDto,){

        const { email, password, firstname, lastname, phoneNumber , role ,username} = data

        const findUserEmail = await this.prisma.user.findUnique({ where: { email } })

        const findUserPhone = await this.prisma.user.findUnique({ where: { phoneNumber } })

        if (findUserEmail) {

            throw new BadRequestException('Email Already exists')
        }

        if (findUserPhone) {

            throw new BadRequestException('Phone Number Already exists')
        }

        const hashedPassword = await this.hashPassword(password)

        
        const newUser = await this.prisma.user.create({
            data: {
                firstname:firstname,
                lastname: lastname,
                fullname: firstname + " " + lastname,
                email : email,
                password: hashedPassword,
                phoneNumber: phoneNumber,
                role,
                username: username,
                Status: true

            },
        });
        const userData : User=  {
            ...newUser,
            Status: newUser.Status
        }

        return {
            message: "User Registered",
            user: userData,
        
        }

    }

    async hashPassword(password: string) {

        const saltOrRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltOrRounds)

        return hashedPassword;
    }





    async deleteCourse(id: number, data: courseDataDto) {

        const admin = await this.prisma.user.findUnique({ where: { id } });

        const tutor = await this.prisma.user.findUnique({ where: { id } });

        if (!admin || admin.role !== UserRole.Admin && !tutor || tutor.role !== UserRole.Tutor) {
            throw new UnauthorizedException('You are not Authorized to perform this action');
        }
        const course = await this.prisma.course.findUnique({ where: { id } })

        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found.`)
        }

        await this.prisma.course.delete({
            where: {
                id
            }
        });

        return `Course with title ${title} has been deleted.`
    }


}
