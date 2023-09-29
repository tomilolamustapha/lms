import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TutorService {
    constructor (private prisma : PrismaService){}

    async getUserById(id: number) {

        if (isNaN(id)) {
            throw new BadRequestException("Tutor Id is Invalid");
        }

        const tutor = await this.prisma.user.findUnique({ where: { id } });

        if (!tutor ||tutor.role !== UserRole.Tutor ) {
            throw new BadRequestException('Tutor Id does not exist');
        }

        return {
            data: tutor,
            message: "Tutor Fetched Successfully"
        };
    }

}
