import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { updateCourseDataDto } from './dto/updateCourseData.dto';

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


    async updateTutorCourse(id : number , data : updateCourseDataDto, document: any, video: any){
         const { title, description, courseCode} = data 

         const tutor = await this.prisma.user.findFirst({where : {id}});

         if(!tutor || tutor.role  ! == UserRole.Tutor){
            throw new UnauthorizedException("Only Tutors can update courses")
         }

         if(isNaN(id)){
            throw new BadRequestException("User Id is Invalid");
         }

         const findCourse = await this.prisma.course.findFirst({where :{id}});

         if (findCourse == null) throw new BadRequestException('Course Not Found');

         const updateCourse = await this.prisma.course.update({
            where:{
                id
            }, data: {
                title,
                description,
                courseCode,
                video,
                document
            }
         });

         return{
            message :"Course Updated Successfully"
         };
    }

}
