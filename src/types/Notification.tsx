import type { Organization } from "./Organization";
import type { OrganizationMember } from "./OrganizationMember";
import type { Tenant } from "./Tenant";
import type { User } from "./User";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type Notification = {
    notificationID: string;
    recipientUserID: number;
    tenantID: string;
    organizationID: string;
    organizationMemberID: string;
    recipientEmail: string;
    recipientPhoneNumber: string;
    channel: string;
    templateCode: string;
    subject: string;
    body: string;
    status: string;
    scheduledAt: string;
    sentAt: string;
    deliveredAt: string;
    readAt: string;
    failureReason: string;
    providerMessageID: string;
    metadata: string;
    capturedDate: string;
    capturedBy: string;
    recipientUser: User;
    tenant: Tenant;
    organization: Organization;
    organizationMember: OrganizationMember;
};
