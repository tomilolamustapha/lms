import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length, validateSync } from "class-validator";

export class loginStudentDto{


    @ApiProperty()

    @IsEmail()

    @IsNotEmpty()

    studentMatric: string;


    @ApiProperty()

    @IsNotEmpty()

    @Length(3,20, { message: "Password has to be between 3 and 20 chars"})

    password: string;


    constructor(data: Partial<loginStudentDto>) {
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