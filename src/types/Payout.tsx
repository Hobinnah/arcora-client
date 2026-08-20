import type { Organization } from "./Organization";
import type { OrgPayoutAccount } from "./OrgPayoutAccount";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type Payout = {
    payoutID: number;
    organizationID: string;
    orgPayoutAccountID: number;
    amount: number;
    currency: string;
    status: string;
    scheduledAt: string;
    requestedAt: string;
    processedAt: string;
    paidAt: string;
    providerName: string;
    providerPayoutID: string;
    failureReason: string;
    capturedBy: string;
    capturedDate: string;
    organization: Organization;
    orgPayoutAccount: OrgPayoutAccount;
};
