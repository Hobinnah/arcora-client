import type { Listing } from "./Listing";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type ListingPhoto = {
    listingPhotoID: string;
    listingID: string;
    url: string;
    location: string;
    caption: string;
    altText: string;
    displayOrder: number;
    isCoverPhoto: boolean;
    capturedDate: string;
    capturedBy: string;
    listing: Listing;
};
