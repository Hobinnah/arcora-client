import type { Payment } from "./Payment";
import type { Tenant } from "./Tenant";
import type { Organization } from "./Organization";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type Chargeback = {
    chargebackID: string;
    paymentID: string;
    tenantID: string;
    organizationID: string;
    providerDisputeID: string;
    amount: number;
    currency: string;
    reasonCode: string;
    status: string;
    openedAt: string;
    evidenceDueAt: string;
    evidenceSubmittedAt: string;
    resolvedAt: string;
    outcome: string;
    providerResponse: string;
    capturedDate: string;
    capturedBy: string;
    payment: Payment;
    tenant: Tenant;
    organization: Organization;
};
