import type { Property } from "./Property";
import type { UnitType } from "./UnitType";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type RentalUnit = {
    rentalUnitID: string;
    propertyID: string;
    unitTypeID: string;
    unitNumber: string;
    floorNumber: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    maximumOccupants: number;
    notes: string;
    status: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    property: Property;
    unitType: UnitType;
};
