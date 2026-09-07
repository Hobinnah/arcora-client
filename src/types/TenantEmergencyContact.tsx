import type { Tenant } from "./Tenant";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type TenantEmergencyContact = {
    tenantEmergencyContactID: string;
    tenantID: string;
    rentalApplicationID: string;
    name: string;
    relationship: string;
    phoneNumber: string;
    email: string;
    isPrimary: boolean;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    tenant: Tenant;
};
