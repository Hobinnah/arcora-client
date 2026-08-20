import type { Lease } from "./Lease";
import type { Tenant } from "./Tenant";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type CreditReportingEnrollment = {
    creditReportingEnrollmentID: string;
    leaseID: string;
    leaseRenewalID: string;
    tenantID: string;
    status: string;
    consentedAt: string;
    cancelledAt: string;
    providerName: string;
    providerReferenceID: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    lease: Lease;
    tenant: Tenant;
};
