import { UserRole } from "@prisma/client";
import { IsEnum, IsNotEmpty, validateSync } from "class-validator";

export class userCreation{

    @IsNotEmpty()

    firstname: string;

    @IsNotEmpty()

    lastname: string;

    @IsNotEmpty()

    email:string;

    @IsNotEmpty()

    phoneNumber: string;

    @IsNotEmpty()

    @IsEnum(UserRole)
    
    role: UserRole;



    constructor(data: Partial<userCreation>) {
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