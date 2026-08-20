import type { Lease } from "./Lease";
import type { MaintenanceRequest } from "./MaintenanceRequest";
import type { Dispute } from "./Dispute";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type Conversation = {
    conversationID: string;
    conversationType: string;
    leaseID: string;
    leaseRenewalID: string;
    maintenanceRequestID: string;
    disputeID: string;
    subject: string;
    status: string;
    lastMessageAt: string;
    closedAt: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    lease: Lease;
    maintenanceRequest: MaintenanceRequest;
    dispute: Dispute;
};
