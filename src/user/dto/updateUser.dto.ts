import { IsEmail, IsNotEmpty, validateSync } from "class-validator";

export class updateUserProfileDto {

    @IsNotEmpty()

    firstname: string;

    @IsNotEmpty()

    lastname: string;

    @IsNotEmpty()

    fullname: string;

    @IsEmail()

    @IsNotEmpty()

    email: string;

    @IsNotEmpty()

    phoneNumber: string;



    @IsNotEmpty()

    password: string;


    @IsNotEmpty()

    username: string;


    constructor(data: Partial<updateUserProfileDto>) {
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