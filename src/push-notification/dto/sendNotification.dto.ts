import { IsNotEmpty, IsString, validateSync } from "class-validator";

export class sendNotificationDto{
    
    
    @IsNotEmpty()

    @IsString()

    content:string;


    @IsNotEmpty()

    @IsString()

    title: string;


    constructor(data: Partial<sendNotificationDto>) {
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