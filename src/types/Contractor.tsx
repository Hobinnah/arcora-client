import type { Organization } from "./Organization";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type Contractor = {
    contractorID: string;
    organizationID: string;
    companyName: string;
    contactName: string;
    email: string;
    phoneNumber: string;
    categoryID: number;
    status: string;
    notes: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    organization: Organization;
};
