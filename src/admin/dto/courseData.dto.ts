import { IsNotEmpty, validateSync } from "class-validator";

export class courseDataDto{

    @IsNotEmpty()

     title : string;

    @IsNotEmpty()

    description : string;

    @IsNotEmpty()

    id : number;



    constructor(data: Partial<courseDataDto>) {
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