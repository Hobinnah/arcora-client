import type { SecurityDeposit } from "./SecurityDeposit";
import type { Payment } from "./Payment";
import type { Refund } from "./Refund";
import type { InvoiceMaster } from "./InvoiceMaster";
import type { InvoiceDetail } from "./InvoiceDetail";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type SecurityDepositTransaction = {
    securityDepositTransactionID: string;
    securityDepositID: string;
    paymentID: string;
    refundID: string;
    invoiceMasterID: string;
    invoiceDetailID: string;
    transactionType: string;
    amount: number;
    currency: string;
    description: string;
    occurredAt: string;
    capturedDate: string;
    capturedBy: string;
    securityDeposit: SecurityDeposit;
    payment: Payment;
    refund: Refund;
    invoiceMaster: InvoiceMaster;
    invoiceDetail: InvoiceDetail;
};
