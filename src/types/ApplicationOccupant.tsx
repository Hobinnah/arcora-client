import type { Tenant } from "./Tenant";
import type { User } from "./User";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type ApplicationOccupant = {
    applicationOccupantID: string;
    rentalApplicationID: string;
    tenantID: string;
    userID: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
    occupantType: string;
    isPrimaryApplicant: boolean;
    status: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    tenant: Tenant;
    user: User;
};
