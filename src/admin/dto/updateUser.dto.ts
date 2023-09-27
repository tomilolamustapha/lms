import { IsEmail, IsNotEmpty, validateSync } from "class-validator";

export class updateUserDto{

    @IsNotEmpty()

    firstname : string;

    @IsNotEmpty()

    lastname : string;

    @IsEmail()

    email:string;

    @IsNotEmpty()

    phoneNumber:string;


    @IsNotEmpty()

    id:number;

    constructor(data: Partial<updateUserDto>) {
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