export class User {
    id: number;
    firstname: string;
    lastname: string;
    fullname?: string;
    email: string;
    phone?: string;
    passsword ?: string;
    currentDeviceId?: string;
    createdBy?: string;
    lastLogin?: Date;
    isEmailVerified: boolean;
    createdAt?: Date;
    updatedAt: Date;
}