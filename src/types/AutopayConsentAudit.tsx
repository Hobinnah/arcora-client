import type { AutopayMandate } from "./AutopayMandate";
import type { Tenant } from "./Tenant";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type AutopayConsentAudit = {
    autopayConsentAuditID: string;
    autopayMandateID: string;
    tenantID: string;
    action: string;
    consentVersion: string;
    consentTextHash: string;
    ipAddress: string;
    userAgent: string;
    providerReferenceID: string;
    actionAt: string;
    metadata: string;
    capturedBy: string;
    capturedDate: string;
    autopayMandate: AutopayMandate;
    tenant: Tenant;
};
