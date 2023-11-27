import { IsNotEmpty, validateSync } from "class-validator";

export class updateCourseDataDto{

    @IsNotEmpty()

    title : string;

    @IsNotEmpty()
    
    courseCode : string;

    @IsNotEmpty()

    document?: string;

    @IsNotEmpty()

    video?: string;
 
    @IsNotEmpty()

    description : string;

    @IsNotEmpty()

    id : number;

    @IsNotEmpty()

   code : string;

   @IsNotEmpty()

    category : string;



    constructor(data: Partial<updateCourseDataDto>) {
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