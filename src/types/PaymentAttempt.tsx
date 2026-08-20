import type { PaymentIntent } from "./PaymentIntent";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type PaymentAttempt = {
    paymentAttemptID: string;
    paymentIntentID: string;
    attemptNumber: number;
    amount: number;
    status: string;
    providerAttemptID: string;
    failureCode: string;
    failureMessage: string;
    attemptedAt: string;
    completedAt: string;
    nextRetryAt: string;
    providerResponse: string;
    capturedDate: string;
    paymentIntent: PaymentIntent;
};
