import type { Contractor } from "./Contractor";
import type { Lease } from "./Lease";
import type { MaintenanceRequest } from "./MaintenanceRequest";
import type { OrganizationMember } from "./OrganizationMember";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type WorkOrder = {
    workOrderID: string;
    maintenanceRequestID: string;
    contractorID: string;
    assignedOrganizationMemberID: string;
    leaseID: string;
    leaseRenewalID: string;
    title: string;
    description: string;
    status: string;
    estimatedCost: number;
    finalCost: number;
    currency: string;
    scheduledAt: string;
    startedAt: string;
    completedAt: string;
    cancelledAt: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    maintenanceRequest: MaintenanceRequest;
    contractor: Contractor;
    assignedOrganizationMember: OrganizationMember;
    lease: Lease;
};
