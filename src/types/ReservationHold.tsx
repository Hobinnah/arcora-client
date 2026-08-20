import type { Listing } from "./Listing";
import type { RentalApplication } from "./RentalApplication";
import type { Tenant } from "./Tenant";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type ReservationHold = {
    reservationHoldID: string;
    listingID: string;
    rentalApplicationID: string;
    tenantID: string;
    startDate: string;
    endDate: string;
    holdReason: string;
    status: string;
    expiresAt: string;
    releasedAt: string;
    convertedToLeaseAt: string;
    capturedDate: string;
    capturedBy: string;
    listing: Listing;
    rentalApplication: RentalApplication;
    tenant: Tenant;
};
