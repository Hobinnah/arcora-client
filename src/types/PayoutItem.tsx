import type { Payout } from "./Payout";
import type { Payment } from "./Payment";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type PayoutItem = {
    payoutItemID: number;
    payoutID: number;
    paymentID: string;
    grossAmount: number;
    deductionAmount: number;
    netPayoutAmount: number;
    description: string;
    capturedDate: string;
    capturedBy: string;
    payout: Payout;
    payment: Payment;
};
