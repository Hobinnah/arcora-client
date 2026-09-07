import type { Lease } from "./Lease";
import type { LeaseRenewals } from "./LeaseRenewals";
import type { Tenant } from "./Tenant";
import type { User } from "./User";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type LeaseOccupants = {
    leaseOccupantID: string;
    leaseID: string;
    leaseRenewalID: string;
    tenantID: string;
    userID: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
    occupantType: string;
    isPrimaryTenant: boolean;
    isFinanciallyResponsible: boolean;
    joinedAt: string;
    removedAt: string;
    status: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    lease: Lease;
    leaseRenewalLeaseRenewals: LeaseRenewals;
    tenant: Tenant;
    user: User;
};
