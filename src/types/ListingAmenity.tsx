import type { Listing } from "./Listing";
import type { AmenityCatalog } from "./AmenityCatalog";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type ListingAmenity = {
    listingAmenityID: string;
    listingID: string;
    amenityID: string;
    notes: string;
    capturedDate: string;
    capturedBy: string;
    listing: Listing;
    amenityCatalog: AmenityCatalog;
};
