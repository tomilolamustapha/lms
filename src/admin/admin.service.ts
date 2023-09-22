import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { createAdminDto } from './dto/createAdmin.dto';

@Injectable()
export class AdminService {
    constructor(
        private prisma : PrismaService,
    ){}
    
    async createAdmin(data : createAdminDto){
        const {email, firstname , lastname ,phone} = data
        
    }
    }

   // async generateRandomPasswordAndHash(): Promise<string> {
        // Generate a random 8-character password
        //const password = Math.random().toString(36).slice(-8);

        // Hash the password with bcrypt
        //const hashedPassword = await hash(password, 10);

        // Return the hashed password
        //return hashedPassword;
    //}


