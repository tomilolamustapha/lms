import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class dashboardDto {


    @ApiProperty()

    @IsString()

    @IsNotEmpty()

    start_date: string;



    @ApiProperty()

    @IsString()

    @IsNotEmpty()

    end_date: string;
    

    @ApiProperty()

    @IsString()

    @IsNotEmpty()

    graph_start_date: string;



    @ApiProperty()

    @IsString()

    @IsNotEmpty()

    graph_end_date: string;


    constructor(data: Partial<dashboardDto>) {
        Object.assign(this, data);
    }

   //
}









