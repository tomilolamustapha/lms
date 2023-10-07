import { Video } from "@prisma/client";
import { Student } from "./student.model";
import { Tutor } from "./tutor.model";

export class courses {
    id: number;
    title: string;
    description: string;
    document : Document[];
    video : Video[];
    createdBy: string;
    courseCode : string;
    tutor: Tutor[];
    student :Student[];
    uploadedOn: Date;
    updatedON: Date;
}