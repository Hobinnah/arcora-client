import type { Tenant } from "./Tenant";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type TenantScreeningCheck = {
    tenantScreeningCheckID: string;
    tenantID: string;
    rentalApplicationID: string;
    checkType: string;
    providerName: string;
    providerReferenceID: string;
    status: string;
    consentCapturedAt: string;
    score: number;
    resultSummary: string;
    reportReference: string;
    requestedAt: string;
    completedAt: string;
    expiresAt: string;
    failureReason: string;
    capturedDate: string;
    capturedBy: string;
    tenant: Tenant;
};
