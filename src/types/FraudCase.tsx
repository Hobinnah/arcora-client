import type { Tenant } from "./Tenant";
import type { Organization } from "./Organization";
import type { Lease } from "./Lease";
import type { PaymentIntent } from "./PaymentIntent";
import type { Payment } from "./Payment";
import type { Chargeback } from "./Chargeback";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type FraudCase = {
    fraudCaseID: string;
    tenantID: string;
    organizationID: string;
    leaseID: string;
    leaseRenewalID: string;
    paymentIntentID: string;
    paymentID: string;
    chargebackID: string;
    status: string;
    riskScore: number;
    reason: string;
    isBlocking: boolean;
    openedAt: string;
    reviewedAt: string;
    closedAt: string;
    resolution: string;
    capturedDate: string;
    capturedBy: string;
    tenant: Tenant;
    organization: Organization;
    lease: Lease;
    paymentIntent: PaymentIntent;
    payment: Payment;
    chargeback: Chargeback;
};
