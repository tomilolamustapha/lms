import { Course, User } from "@prisma/client";

export class Enorllment{
    id : number;
    courseId: number;
    studentId: number;
    course: Course[];
    student : User[];
    createdAt?: Date;
}