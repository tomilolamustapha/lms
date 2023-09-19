import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { createAdminDto } from './dto/createAdmin.dto';

@Injectable()
export class AdminService {
    constructor(
        private prisma : PrismaService,
    ){}
    
    async creatAdmin( data : createAdminDto ){
        const { email ,firstname, lastname , phone} = data

        const findAdminEmail = await this.prisma.admin.findUnique({where : {email}})
        
        const findAdminPhone = await this.prisma.admin.findUnique({where : {phone}})

        if(findAdminEmail){

            throw new BadRequestException('Email Already exists')
        }

        if (findAdminPhone) {

            throw new BadRequestException('Phone Number Already exists')
        }

        //const hashedPassword = await this.generateRandomPasswordAndHash();
         const newAdmin = await this.prisma.admin.creatAdmin({
            data: {
                firstname : firstname,
                lastname : lastname,
                fullname : firstname + " " + lastname ,
                email : email,
                phone : phone,
            }

         });
        

    }

   // async generateRandomPasswordAndHash(): Promise<string> {
        // Generate a random 8-character password
        //const password = Math.random().toString(36).slice(-8);

        // Hash the password with bcrypt
        //const hashedPassword = await hash(password, 10);

        // Return the hashed password
        //return hashedPassword;
    //}

}
