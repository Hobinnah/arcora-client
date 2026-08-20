import type { Organization } from "./Organization";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type OrgPayoutAccount = {
    orgPayoutAccountID: number;
    organizationID: string;
    providerName: string;
    providerAccountID: string;
    accountType: string;
    bankName: string;
    accountLast4: string;
    currency: string;
    verificationStatus: string;
    verifiedAt: string;
    isDefault: boolean;
    isActive: boolean;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    organization: Organization;
};
