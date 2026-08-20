import type { InvoiceMaster } from "./InvoiceMaster";
import type { Fee } from "./Fee";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type InvoiceDetail = {
    invoiceDetailID: string;
    invoiceMasterID: string;
    leaseRecurringChargeID: string;
    feeID: string;
    lineType: string;
    description: string;
    servicePeriodStart: string;
    servicePeriodEnd: string;
    quantity: number;
    unitAmount: number;
    lineAmount: number;
    taxRate: number;
    taxAmount: number;
    totalLineAmount: number;
    capturedBy: string;
    capturedDate: string;
    invoiceMaster: InvoiceMaster;
    fee: Fee;
};
