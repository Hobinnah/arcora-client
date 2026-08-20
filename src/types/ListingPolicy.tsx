import type { Listing } from "./Listing";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type ListingPolicy = {
    listingPolicyID: string;
    listingID: string;
    allowsPets: boolean;
    allowsSmoking: boolean;
    allowsChildren: boolean;
    maximumOccupants: number;
    furnished: boolean;
    parkingIncluded: boolean;
    utilitiesIncluded: boolean;
    minimumCreditScore: number;
    requiresBackgroundCheck: boolean;
    applicationInstructions: string;
    capturedDate: string;
    capturedBy: string;
    listing: Listing;
};
