import type { Listing } from "./Listing";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type ListingTermPrice = {
    listingTermPriceID: string;
    listingID: string;
    leaseTermMonths: number;
    monthlyRentAmount: number;
    securityDepositAmount: number;
    effectiveFrom: string;
    effectiveTo: string;
    isActive: boolean;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    listing: Listing;
};
