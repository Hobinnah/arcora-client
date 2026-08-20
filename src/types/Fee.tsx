import type { FeeType } from "./FeeType";
import type { Organization } from "./Organization";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type Fee = {
    feeID: string;
    feeTypeID: number;
    organizationID: string;
    code: string;
    name: string;
    calculationType: string;
    fixedAmount: number;
    percentageRate: number;
    minimumFeeAmount: number;
    maximumFeeAmount: number;
    currency: string;
    isTaxable: boolean;
    effectiveFrom: string;
    effectiveTo: string;
    isActive: boolean;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    feeType: FeeType;
    organization: Organization;
};
