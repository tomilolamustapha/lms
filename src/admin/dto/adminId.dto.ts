import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, validateSync } from "class-validator";

export class adminIdDto{


    @ApiProperty()
    
    @IsNotEmpty()

    id: number;



    constructor(data: Partial<adminIdDto>) {
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