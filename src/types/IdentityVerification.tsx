import type { User } from "./User";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type IdentityVerification = {
    identityVerificationID: string;
    userID: number;
    verificationType: string;
    providerName: string;
    providerReferenceID: string;
    status: string;
    confidenceScore?: number;
    requestedAt: string;
    verifiedAt: string;
    expiresAt: string;
    failureReason: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    user: User;
};
