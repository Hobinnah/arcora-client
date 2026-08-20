import type { Lease } from "./Lease";
import type { Tenant } from "./Tenant";
import type { Organization } from "./Organization";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type SecurityDeposit = {
    securityDepositID: string;
    leaseID: string;
    tenantID: string;
    organizationID: string;
    requiredAmount: number;
    receivedAmount: number;
    appliedAmount: number;
    returnedAmount: number;
    currency: string;
    status: string;
    dueDate: string;
    fullyFundedAt: string;
    heldAt: string;
    closedAt: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    lease: Lease;
    tenant: Tenant;
    organization: Organization;
};
