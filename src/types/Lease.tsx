import type { Organization } from "./Organization";
import type { Listing } from "./Listing";
import type { RentalUnit } from "./RentalUnit";
import type { TenancyType } from "./TenancyType";
import type { Tenant } from "./Tenant";
import type { RentalApplication } from "./RentalApplication";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type Lease = {
    leaseID: string;
    organizationID: string;
    listingID: string;
    rentalUnitID: string;
    tenancyTypeID: number;
    tenantID: string;
    rentalApplicationID: string;
    leaseCode: string;
    leaseNumber: string;
    status: string;
    startDate: string;
    endDate: string;
    leaseTermMonths: number;
    baseRentAmount: number;
    currency: string;
    gracePeriodDays: number;
    lateFeeFixedAmount: number;
    lateFeePercentage: number;
    autoRenew: boolean;
    renewalNoticeDays: number;
    signedAt: string;
    activatedAt: string;
    actualMoveInAt: string;
    actualMoveOutAt: string;
    terminatedAt: string;
    terminationReason: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    organization: Organization;
    listing: Listing;
    rentalUnit: RentalUnit;
    tenancyType: TenancyType;
    tenant: Tenant;
    rentalApplication: RentalApplication;
};
