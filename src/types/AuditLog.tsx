import type { Organization } from "./Organization";
import type { OrganizationMember } from "./OrganizationMember";
import type { Tenant } from "./Tenant";
import type { User } from "./User";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type AuditLog = {
    auditLogID: string;
    actorUserID: number;
    tenantID: string;
    organizationMemberID: string;
    organizationID: string;
    actorType: string;
    action: string;
    entityType: string;
    entityID: string;
    oldValues: string;
    newValues: string;
    ipAddress: string;
    userAgent: string;
    correlationID: string;
    note: string;
    capturedDate: string;
    actorUser: User;
    tenant: Tenant;
    organizationMember: OrganizationMember;
    organization: Organization;
};
