import type { RentalUnit } from "./RentalUnit";
import type { ListingType } from "./ListingType";
import type { Organization } from "./Organization";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type Listing = {
    listingID: string;
    rentalUnitID: string;
    listingTypeID: string;
    organizationID: string;
    title: string;
    description: string;
    checkInDoorCode: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    baseMonthlyRentAmount: number;
    securityDepositAmount: number;
    yearBuilt: number;
    status: string;
    publishedAt: string;
    unpublishedAt: string;
    currency: string;
    availableFrom: string;
    availableTo: string;
    minimumLeaseMonths: number;
    maximumLeaseMonths: number;
    applicationDeadline: string;
    notes: string;
    wIFINetwork: string;
    wIFIPassword: string;
    acceptingApplications: boolean;
    capturedBy: string;
    capturedDate: string;
    updatedDate: string;
    updatedBy: string;
    rentalUnit: RentalUnit;
    listingType: ListingType;
    organization: Organization;
};
