import type { Payment } from "./Payment";
import type { Tenant } from "./Tenant";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type Refund = {
    refundID: string;
    paymentID: string;
    tenantID: string;
    amount: number;
    currency: string;
    reason: string;
    status: string;
    providerName: string;
    providerRefundID: string;
    requestedAt: string;
    processedAt: string;
    failedAt: string;
    failureReason: string;
    capturedDate: string;
    capturedBy: string;
    payment: Payment;
    tenant: Tenant;
};
