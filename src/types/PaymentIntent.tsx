import type { InvoiceMaster } from "./InvoiceMaster";
import type { AutopayMandate } from "./AutopayMandate";
import type { Tenant } from "./Tenant";
import type { PaymentMethod } from "./PaymentMethod";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type PaymentIntent = {
    paymentIntentID: string;
    invoiceMasterID: string;
    autopayMandateID: string;
    tenantID: string;
    paymentMethodID: string;
    amount: number;
    currency: string;
    status: string;
    collectionMethod: string;
    providerName: string;
    providerPaymentIntentID: string;
    idempotencyKey: string;
    scheduledChargeAt: string;
    startedAt: string;
    completedAt: string;
    cancelledAt: string;
    failureReason: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    invoiceMaster: InvoiceMaster;
    autopayMandate: AutopayMandate;
    tenant: Tenant;
    paymentMethod: PaymentMethod;
};
