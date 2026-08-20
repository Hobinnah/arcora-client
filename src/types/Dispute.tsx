import type { Tenant } from "./Tenant";
import type { Organization } from "./Organization";
import type { Lease } from "./Lease";
import type { InvoiceMaster } from "./InvoiceMaster";
import type { Payment } from "./Payment";
import type { Chargeback } from "./Chargeback";
import type { MaintenanceRequest } from "./MaintenanceRequest";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type Dispute = {
    disputeID: string;
    tenantID: string;
    organizationID: string;
    leaseID: string;
    leaseRenewalID: string;
    invoiceMasterID: string;
    paymentID: string;
    chargebackID: string;
    maintenanceRequestID: string;
    status: string;
    title: string;
    description: string;
    resolutionNotes: string;
    openedAt: string;
    resolvedAt: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    tenant: Tenant;
    organization: Organization;
    lease: Lease;
    invoiceMaster: InvoiceMaster;
    payment: Payment;
    chargeback: Chargeback;
    maintenanceRequest: MaintenanceRequest;
};
