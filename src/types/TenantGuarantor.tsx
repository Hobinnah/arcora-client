import type { Tenant } from "./Tenant";
import type { User } from "./User";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type TenantGuarantor = {
    tenantGuarantorID: string;
    tenantID: string;
    rentalApplicationID: string;
    userID: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    relationship: string;
    annualIncome: number;
    status: string;
    invitedAt: string;
    acceptedAt: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    tenant: Tenant;
    user: User;
};
