import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, validateSync } from "class-validator";

export class createUserDto {


  @ApiProperty()

  @IsNotEmpty()

  lastname: string;


  @ApiProperty()

  @IsNotEmpty()

  firstname: string;


  @ApiProperty()

  @IsNotEmpty()

  fullname: string;

  @IsNotEmpty()

  studentMatric: string;


  @ApiProperty()

  @IsEmail()

  @IsNotEmpty()

  email: string;


  @ApiProperty()

  @IsNotEmpty()

  phoneNumber: string;



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