import type { Organization } from "./Organization";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type LedgerAccount = {
    ledgerAccountID: string;
    organizationID: string;
    accountCode: string;
    accountType: string;
    accountCategory: string;
    currency: string;
    name: string;
    isSystemAccount: boolean;
    isActive: boolean;
    capturedDate: string;
    capturedBy: string;
    organization: Organization;
};
