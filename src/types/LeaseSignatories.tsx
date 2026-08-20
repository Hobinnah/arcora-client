import type { User } from "./User";
import type { Tenant } from "./Tenant";
import type { OrganizationMember } from "./OrganizationMember";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type LeaseSignatories = {
    leaseSignatoryID: string;
    leaseDocumentID: string;
    userID: number;
    tenantID: string;
    organizationMemberID: string;
    signatoryRole: string;
    name: string;
    email: string;
    status: string;
    signatureOrder: number;
    providerSignerID: string;
    viewedAt: string;
    signedAt: string;
    declinedAt: string;
    capturedDate: string;
    capturedBy: string;
    user: User;
    tenant: Tenant;
    organizationMember: OrganizationMember;
};
