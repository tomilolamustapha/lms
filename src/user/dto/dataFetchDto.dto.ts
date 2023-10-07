import {IsNotEmpty, IsString, Length, validateSync } from "class-validator";

export class dataFetchDto {

    search_term: string;

    page_number: number;

    @IsString()

    @IsNotEmpty()

    start_date: string;

    @IsString()

    @IsNotEmpty()

    end_date: string;

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