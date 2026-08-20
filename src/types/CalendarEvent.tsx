import type { Listing } from "./Listing";
import type { Lease } from "./Lease";
import type { RentalApplication } from "./RentalApplication";
import type { ReservationHold } from "./ReservationHold";
import type { MaintenanceRequest } from "./MaintenanceRequest";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type CalendarEvent = {
    calendarEventID: string;
    listingID: string;
    leaseID: string;
    rentalApplicationID: string;
    reservationHoldID: string;
    maintenanceRequestID: string;
    eventType: string;
    status: string;
    startAt: string;
    endAt: string;
    isAllDay: boolean;
    title: string;
    occupantName: string;
    occupantCount: number;
    sourceSystem: string;
    sourceReferenceID: string;
    externalCalendarID: string;
    blocksAvailability: boolean;
    notes: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    listing: Listing;
    lease: Lease;
    rentalApplication: RentalApplication;
    reservationHold: ReservationHold;
    maintenanceRequest: MaintenanceRequest;
};
