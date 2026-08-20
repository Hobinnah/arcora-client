import type { User } from "./User";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type Tenant = {
    tenantID: string;
    code: string;
    userID: number;
    description: string;
    phoneNumber: string;
    photoUrl: string;
    dateOfBirth: string;
    profileStatus: string;
    isActive: boolean;
    capturedBy: string;
    capturedDate: string;
    updatedBy: string;
    updatedDate: string;
    user: User;
};
