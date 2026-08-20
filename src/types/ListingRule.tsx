import type { Listing } from "./Listing";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type ListingRule = {
    listingRuleID: string;
    listingID: string;
    ruleType: string;
    ruleTitle: string;
    ruleDescription: string;
    isAllowed: boolean;
    effectiveFrom: string;
    effectiveTo: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    listing: Listing;
};
