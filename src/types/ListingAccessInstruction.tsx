import type { Listing } from "./Listing";
import type { Lease } from "./Lease";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type ListingAccessInstruction = {
    listingAccessInstructionID: string;
    listingID: string;
    leaseID: string;
    instructionType: string;
    instructions: string;
    secretReference: string;
    availableFrom: string;
    availableUntil: string;
    isActive: boolean;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    listing: Listing;
    lease: Lease;
};
