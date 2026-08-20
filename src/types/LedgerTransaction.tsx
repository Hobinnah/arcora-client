import type { Organization } from "./Organization";
import type { Payment } from "./Payment";
import type { InvoiceMaster } from "./InvoiceMaster";
import type { Refund } from "./Refund";
import type { Payout } from "./Payout";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type LedgerTransaction = {
    ledgerTransactionID: string;
    organizationID: string;
    transactionType: string;
    transactionDate: string;
    description: string;
    paymentID: string;
    invoiceMasterID: string;
    refundID: string;
    payoutID: number;
    referenceNumber: string;
    status: string;
    reversedTransactionID: string;
    capturedDate: string;
    capturedBy: string;
    organization: Organization;
    payment: Payment;
    invoiceMaster: InvoiceMaster;
    refund: Refund;
    payout: Payout;
};
