import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, validateSync } from "class-validator";

export class createAdminDto{


    @ApiProperty()

    @IsNotEmpty()

    firstname: string;


    @ApiProperty()

    @IsNotEmpty()

    lastname: string;


    @ApiProperty()

    @IsEmail()

    @IsNotEmpty()

    email: string;


    @ApiProperty()

    @IsNotEmpty()

    phone: string;



    constructor(data: Partial<createAdminDto>) {
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