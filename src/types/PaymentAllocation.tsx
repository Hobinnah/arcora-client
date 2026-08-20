import type { Payment } from "./Payment";
import type { InvoiceMaster } from "./InvoiceMaster";
import type { InvoiceDetail } from "./InvoiceDetail";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type PaymentAllocation = {
    paymentAllocationID: number;
    paymentID: string;
    invoiceMasterID: string;
    invoiceDetailID: string;
    allocatedAmount: number;
    allocationType: string;
    allocatedAt: string;
    capturedDate: string;
    capturedBy: string;
    payment: Payment;
    invoiceMaster: InvoiceMaster;
    invoiceDetail: InvoiceDetail;
};
