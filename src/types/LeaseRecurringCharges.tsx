import type { Lease } from "./Lease";
import type { Fee } from "./Fee";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type LeaseRecurringCharges = {
    leaseRecurringChargeID: string;
    leaseID: string;
    leaseRenewalID: string;
    feeID: string;
    chargeCode: string;
    description: string;
    amount: number;
    currency: string;
    frequency: string;
    billingDayOfMonth: number;
    firstDueDate: string;
    lastDueDate: string;
    prorationRule: string;
    autoGenerateInvoice: boolean;
    isActive: boolean;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    lease: Lease;
    fee: Fee;
};
