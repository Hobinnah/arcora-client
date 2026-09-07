import type { Category } from "./Category";
import type { Lease } from "./Lease";
import type { Listing } from "./Listing";
import type { Property } from "./Property";
import type { RentalUnit } from "./RentalUnit";
import type { Tenant } from "./Tenant";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type MaintenanceRequest = {
    maintenanceRequestID: string;
    propertyID: string;
    rentalUnitID: string;
    listingID: string;
    leaseID: string;
    leaseRenewalID: string;
    submittedByTenantID: string;
    categoryID: number;
    priority: string;
    status: string;
    title: string;
    description: string;
    permissionToEnter: boolean;
    submittedAt: string;
    acknowledgedAt: string;
    scheduledAt: string;
    completedAt: string;
    cancelledAt: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    property: Property;
    rentalUnit: RentalUnit;
    listing: Listing;
    lease: Lease;
    submittedByTenant: Tenant;
    category: Category;
};
