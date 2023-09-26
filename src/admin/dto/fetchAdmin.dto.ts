import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, validateSync } from "class-validator";

export class adminFetch{


    @ApiProperty()

    search_term: string;


    @ApiProperty()

    page_number: number;


    @ApiProperty()

    @IsString()

    @IsNotEmpty()

    start_date: string;



    @ApiProperty()

    @IsString()

    @IsNotEmpty()

    end_date: string;


    @ApiProperty()

    page_size: number;

    

    @ApiProperty()
    
    type: string;



    constructor(data: Partial<adminFetch>) {
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