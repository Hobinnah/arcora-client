import type { Payment } from "./Payment";
import type { Tenant } from "./Tenant";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type ReceiptMaster = {
    receiptMasterID: number;
    paymentID: string;
    tenantID: string;
    receiptNumber: string;
    amount: number;
    currency: string;
    issuedAt: string;
    voidedAt: string;
    voidReason: string;
    capturedBy: string;
    capturedDate: string;
    payment: Payment;
    tenant: Tenant;
};
