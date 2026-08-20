import type { CreditReportingEnrollment } from "./CreditReportingEnrollment";
import type { InvoiceMaster } from "./InvoiceMaster";
import type { Payment } from "./Payment";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type CreditReporting = {
    creditReportingID: string;
    creditReportingEnrollmentID: string;
    invoiceMasterID: string;
    paymentID: string;
    reportedAmount: number;
    wasPaidOnTime: boolean;
    reportingPeriodStart: string;
    reportingPeriodEnd: string;
    providerStatus: string;
    providerReferenceID: string;
    providerResponse: string;
    reportedAt: string;
    capturedDate: string;
    capturedBy: string;
    creditReportingEnrollment: CreditReportingEnrollment;
    invoiceMaster: InvoiceMaster;
    payment: Payment;
};
