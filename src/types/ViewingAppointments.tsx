import type { Listing } from "./Listing";
import type { User } from "./User";
import type { Tenant } from "./Tenant";
import type { OrganizationMember } from "./OrganizationMember";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type ViewingAppointments = {
    viewingAppointmentID: string;
    listingID: string;
    requestedByUserID: number;
    tenantID: string;
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
    user: User;
    tenant: Tenant;
    organizationMember: OrganizationMember;
};
