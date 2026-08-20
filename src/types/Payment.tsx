import type { PaymentIntent } from "./PaymentIntent";
import type { Tenant } from "./Tenant";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type Payment = {
    paymentID: string;
    paymentIntentID: string;
    tenantID: string;
    providerChargeID: string;
    status: string;
    grossAmount: number;
    platformFeeAmount: number;
    processorFeeAmount: number;
    refundedAmount: number;
    netAmount: number;
    currency: string;
    paidAt: string;
    settledAt: string;
    capturedBy: string;
    capturedDate: string;
    updatedDate: string;
    updatedBy: string;
    paymentIntent: PaymentIntent;
    tenant: Tenant;
};
