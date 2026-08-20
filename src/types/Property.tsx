import type { Organization } from "./Organization";
import type { Address } from "./Address";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type Property = {
    propertyID: string;
    organizationID: string;
    addressID: string;
    name: string;
    propertyType: string;
    yearBuilt: number;
    timeZone: string;
    description: string;
    status: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    organization: Organization;
    address: Address;
};
