import type { Tenant } from "./Tenant";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type TenantEmployment = {
    tenantEmploymentID: string;
    tenantID: string;
    employerName: string;
    jobTitle: string;
    employmentType: string;
    employerEmail: string;
    employerPhoneNumber: string;
    annualIncome: number;
    currency: string;
    startedAt: string;
    endedAt: string;
    isCurrent: boolean;
    verificationStatus: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    tenant: Tenant;
};
