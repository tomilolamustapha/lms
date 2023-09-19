export class Tutor {
    id: number;
    firstname: string;
    lastname: string;
    fullname?: string;
    email: string;
    phone?: string;
    password?: string;
    currentDeviceId?: string;
    createdBy?: string;
    lastLogin?: Date;
    isEmailVerified: boolean;
    createdAt?: Date;
    updatedAt: Date;
}