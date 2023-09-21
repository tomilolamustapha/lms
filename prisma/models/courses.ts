import { Tutor } from "./tutor.model";

export class courses {
    id: number;
    title: string;
    description: string;
    createdBy: string;
    tutors: Tutor[];
    uploadedOn: Date;
    updatedON: Date;
}