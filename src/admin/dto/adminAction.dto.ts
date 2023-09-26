import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEnum, validateSync } from "class-validator";
import { userActionType } from "./userAction.enum";

export class adminActionDto{


    @ApiProperty({ enum: userActionType, enumName: 'userActionType' })
    
    @IsNotEmpty()

    @IsEnum(userActionType)

    type: userActionType;



    constructor(data: Partial<adminActionDto>) {
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