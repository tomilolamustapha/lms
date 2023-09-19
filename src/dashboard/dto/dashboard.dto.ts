export class dashboardDto {


    @ApiProperty()

    @String()

    @IsNotEmpty()

    start_date: string;



    @ApiProperty()

    @String()

    @IsNotEmpty()

    end_date: string;
    

    @ApiProperty()

    @String()

    @IsNotEmpty()

    graph_start_date: string;



    @ApiProperty()

    @String()

    @IsNotEmpty()

    graph_end_date: string;


    constructor(data: Partial<dashboardDto>) {
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



