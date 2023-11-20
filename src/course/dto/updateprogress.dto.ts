import { IsNotEmpty, IsNumber, validateSync } from "class-validator";

export class progressTrackDto{

    @IsNotEmpty()

    courseId: number;

    @IsNumber()

    videoDuration: number;


    constructor(data: Partial<progressTrackDto>) {
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