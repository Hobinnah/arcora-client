import type { Lease } from "./Lease";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type LeaseRenewals = {
    leaseRenewalID: string;
    leaseID: string;
    status: string;
    offeredAt: string;
    offerExpiresAt: string;
    acceptedAt: string;
    declinedAt: string;
    startDate: string;
    endDate: string;
    leaseTermMonths: number;
    rentAmount: number;
    securityDepositAdjustmentAmount: number;
    notes: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    lease: Lease;
};
