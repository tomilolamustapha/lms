
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { IsEmail, IsNotEmpty, Length, validateSync } from "class-validator";

export class createUserDto{


    @ApiProperty()

    @IsNotEmpty()

    lastname: string;


    @ApiProperty()

    @IsNotEmpty()

    firstname: string;


    @ApiProperty()

    @IsEmail()

    @IsNotEmpty()

    email: string;


    @ApiProperty()

    @IsNotEmpty()

    phoneNumber: string;


    @ApiProperty()

    @IsNotEmpty()

    @Length(3,20, { message: "Password has to be between 3 and 20 chars"})

    password: string;


    @IsNotEmpty()

    role:UserRole

    @IsNotEmpty()

    username : string


    constructor(data: Partial<createUserDto>) {
        Object.assign(this, data);
      }

    validate(): string | null {
      const errors = validateSync(this);
      if (errors.length > 0) {
        return Object.values(errors[0].constraints)[0];
      }
      return null;
    }
}