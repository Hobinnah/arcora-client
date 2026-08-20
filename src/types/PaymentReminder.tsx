import type { InvoiceMaster } from "./InvoiceMaster";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type PaymentReminder = {
    paymentReminderID: string;
    invoiceMasterID: string;
    channel: string;
    scheduledAt: string;
    sentAt: string;
    status: string;
    messageSubject: string;
    messageBody: string;
    capturedDate: string;
    capturedBy: string;
    invoiceMaster: InvoiceMaster;
};
