import type { Property } from "./Property";
import type { RentalUnit } from "./RentalUnit";
import type { Lease } from "./Lease";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type Inspection = {
    inspectionID: string;
    propertyID: string;
    rentalUnitID: string;
    leaseID: string;
    leaseRenewalID: string;
    inspectionType: string;
    status: string;
    scheduledFor: string;
    startedAt: string;
    completedAt: string;
    overallCondition: string;
    notes: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    property: Property;
    rentalUnit: RentalUnit;
    lease: Lease;
};
