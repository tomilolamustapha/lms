import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, validateSync } from "class-validator";

export class dataFetchDto{


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




    constructor(data: Partial<dataFetchDto>) {
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