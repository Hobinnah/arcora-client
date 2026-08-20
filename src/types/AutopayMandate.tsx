import type { Lease } from "./Lease";
import type { Tenant } from "./Tenant";
import type { PaymentMethod } from "./PaymentMethod";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type AutopayMandate = {
    autopayMandateID: string;
    leaseID: string;
    leaseRenewalID: string;
    tenantID: string;
    paymentMethodID: string;
    status: string;
    mandateType: string;
    paymentRail: string;
    maximumAmountPerDebit: number;
    currency: string;
    frequency: string;
    startDate: string;
    endDate: string;
    providerName: string;
    providerMandateID: string;
    consentVersion: string;
    consentTextHash: string;
    consentIpAddress: string;
    consentedAt: string;
    activatedAt: string;
    cancelledAt: string;
    cancellationReason: string;
    capturedBy: string;
    capturedDate: string;
    updatedDate: string;
    updatedBy: string;
    lease: Lease;
    tenant: Tenant;
    paymentMethod: PaymentMethod;
};
