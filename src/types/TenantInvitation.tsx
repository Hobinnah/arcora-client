import type { Lease } from "./Lease";
import type { RentalApplication } from "./RentalApplication";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type TenantInvitation = {
    tenantInvitationID: string;
    listingID: string;
    leaseID: string;
    rentalApplicationID: string;
    invitationPurpose: string;
    email: string;
    phoneNumber: string;
    tokenHash: string;
    status: string;
    expiresAt: string;
    acceptedAt: string;
    revokedAt: string;
    capturedBy: string;
    capturedDate: string;
    lease: Lease;
    rentalApplication: RentalApplication;
};
