import { Student } from "./student.model";
import { Tutor } from "./tutor.model";

export class courses {
    id: number;
    title: string;
    description: string;
    createdBy: string;
    tutor: Tutor[];
    student :Student[];
    uploadedOn: Date;
    updatedON: Date;
}