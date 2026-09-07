import type { AmenityCatalog } from "./AmenityCatalog";
import type { Listing } from "./Listing";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type ListingAmenity = {
    listingAmenityID: string;
    listingID: string;
    amenityID: string;
    notes: string;
    capturedDate: string;
    capturedBy: string;
    listing: Listing;
    amenityAmenityCatalog: AmenityCatalog;
};
