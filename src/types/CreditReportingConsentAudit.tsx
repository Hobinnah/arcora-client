import type { CreditReportingEnrollment } from "./CreditReportingEnrollment";
import type { Tenant } from "./Tenant";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type CreditReportingConsentAudit = {
    consentAuditID: string;
    creditReportingEnrollmentID: string;
    tenantID: boolean;
    action: string;
    consentVersion: string;
    consentTextHash: string;
    providerReferenceID: string;
    actionAt: string;
    metadata: string;
    capturedDate: string;
    capturedBy: string;
    creditReportingEnrollment: CreditReportingEnrollment;
    tenant: Tenant;
};
