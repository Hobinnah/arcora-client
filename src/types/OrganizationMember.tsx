import type { Organization } from "./Organization";
import type { User } from "./User";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type OrganizationMember = {
    organizationMemberID: string;
    organizationID: string;
    userID: number;
    roleName: string;
    status: string;
    isPrimaryOwner: boolean;
    invitedAt: string;
    acceptedAt: string;
    deactivatedAt: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    organization: Organization;
    user: User;
};
