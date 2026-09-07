import type { Listing } from "./Listing";
import type { OrganizationMember } from "./OrganizationMember";
import type { Tenant } from "./Tenant";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type RentalApplication = {
    rentalApplicationID: string;
    applicationCode: string;
    listingID: string;
    tenantID: string;
    desiredMoveInDate: string;
    desiredMoveOutDate: string;
    requestedLeaseTermMonths: number;
    adultOccupantCount: number;
    childOccupantCount: number;
    petCount: number;
    proposedMonthlyRentAmount: number;
    currency: string;
    status: string;
    screeningStatus: string;
    leaseContractReviewed?: boolean;
    verificationAuthorization?: boolean;
    notes: string;
    submittedAt: string;
    reviewedAt: string;
    reviewedByOrganizationMemberID: string;
    approvedAt: string;
    declinedAt: string;
    declineReason: string;
    expiresAt: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    listing: Listing;
    tenant: Tenant;
    reviewedByOrganizationMember: OrganizationMember;
};
