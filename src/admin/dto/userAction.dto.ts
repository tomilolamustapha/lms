import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, Length, validateSync } from "class-validator";
import { userActionType } from "./userAction.enum";
import { Transform } from "class-transformer";


export class userActionDto{


    @ApiProperty({ enum: userActionType, enumName: 'userActionType' })
    
    @IsNotEmpty()

    @IsEnum(userActionType)

    type: userActionType;



    constructor(data: Partial<userActionDto>) {
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