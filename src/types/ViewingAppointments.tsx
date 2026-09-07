import type { Listing } from "./Listing";
import type { OrganizationMember } from "./OrganizationMember";
import type { Tenant } from "./Tenant";
import type { User } from "./User";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type ViewingAppointments = {
    viewingAppointmentID: string;
    listingID: string;
    requestedByUserID: number;
    tenantID: string;
    rentalApplicationID: string;
    assignedOrganizationMemberID: string;
    scheduledFor: string;
    durationMinutes: number;
    timeZone: string;
    status: string;
    viewingType: string;
    meetingUrl: string;
    notes: string;
    cancelledAt: string;
    cancellationReason: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    listing: Listing;
    requestedByUser: User;
    tenant: Tenant;
    assignedOrganizationMember: OrganizationMember;
};
