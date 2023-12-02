import { Content } from "@prisma/client";
import { Student } from "./student.model";
import { Tutor } from "./tutor.model";

export class courses {
    id: number;
    title: string;
    description: string;
    category: string;
    duration: number;
    progress: number;
    status: boolean;
    content: Content;
    createdBy: string;
    courseCode: string;
    tutor: Tutor[];
    student: Student[];
    uploadedOn: Date;
    updatedON: Date;
}