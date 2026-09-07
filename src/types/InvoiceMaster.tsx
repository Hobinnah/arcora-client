import type { Lease } from "./Lease";
import type { Organization } from "./Organization";
import type { Tenant } from "./Tenant";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type InvoiceMaster = {
    invoiceMasterID: string;
    leaseID: string;
    leaseRenewalID: string;
    organizationID: string;
    tenantID: string;
    invoiceNumber: string;
    billingPeriodStart: string;
    billingPeriodEnd: string;
    dueDate: string;
    subtotalAmount: number;
    taxAmount: number;
    discountAmount: number;
    lateFeeAmount: number;
    adjustmentAmount: number;
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    currency: string;
    status: string;
    issuedAt: string;
    paidAt: string;
    voidedAt: string;
    voidReason: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    lease: Lease;
    leaseRenewalLease: Lease;
    organization: Organization;
    tenant: Tenant;
};
