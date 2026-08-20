import type { Organization } from "./Organization";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type Address = {
    addressID: string;
    organizationID: string;
    addressType: string;
    line1: string;
    line2: string;
    city: string;
    provinceCode: string;
    postalCode: string;
    countryCode: string;
    latitude: number;
    longitude: number;
    placeProvider: string;
    placeProviderReferenceID: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    organization: Organization;
};
