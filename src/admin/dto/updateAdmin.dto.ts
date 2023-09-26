import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, validateSync } from "class-validator";
import { RoleType } from "./roleType.enum";

export class updateAdminRoleDto{
    @ApiProperty({ enum: RoleType, enumName: 'RoleType' })
    
    @IsNotEmpty()

    @IsEnum(RoleType)

    role: RoleType;

    @ApiProperty()

    @IsNotEmpty()

    id:number;


    constructor(data: Partial<updateAdminRoleDto>) {
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