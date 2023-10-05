import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { updateUserDto } from './dto/updateUser.dto';
import { UserRole } from '@prisma/client';
import { userActionDto } from './dto/userActionDto';



@Injectable()
export class AdminService {
    constructor(
        private prisma: PrismaService
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

}
