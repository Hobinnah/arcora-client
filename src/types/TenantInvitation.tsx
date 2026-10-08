import type { Lease } from "./Lease";
import type { RentalApplication } from "./RentalApplication";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type TenantInvitation = {
    emailDeliveryStatus?: "PENDING" | "FAILED" | "SENT" | "CANCELLED" | null;
    emailDeliveryAttempts?: number;
    emailSentAt?: string | null;
    tenantInvitationID: string;
    organizationID?: string;
    listingID: string;
    leaseID: string;
    rentalApplicationID: string;
    name?: string;
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
    startDate?: string | null;
    leaseTermMonths?: number | null;
    price?: number | null;
    securityDepositAmount?: number | null;
    currency?: string | null;
    endDate?: string | null;
    lease: Lease;
    rentalApplication: RentalApplication;
};
