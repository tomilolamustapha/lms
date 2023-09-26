import {  IsNotEmpty, validateSync } from "class-validator";

export class createCourseDto{
    @IsNotEmpty()

    title: string;

    @IsNotEmpty()

    description: string;

    constructor(data: Partial<createCourseDto>) {
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