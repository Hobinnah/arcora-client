import type { Inspection } from "./Inspection";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type InspectionItem = {
    inspectionItemID: string;
    inspectionID: string;
    area: string;
    itemName: string;
    condition: string;
    notes: string;
    requiresRepair: boolean;
    estimatedRepairCost: number;
    capturedDate: string;
    capturedBy: string;
    inspection: Inspection;
};
