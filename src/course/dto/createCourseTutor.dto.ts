import {  IsNotEmpty, isNotEmpty, validateSync } from "class-validator";

export class createCourseTutorDto{
    @IsNotEmpty()

    title: string;

    @IsNotEmpty()

    description: string;

    @IsNotEmpty()

    courseCode: string;

    @IsNotEmpty()

    code: string;

     @IsNotEmpty()

     category: string;

    // @IsNotEmpty()
    
    //  document: string;


    constructor(data: Partial<createCourseTutorDto>) {
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