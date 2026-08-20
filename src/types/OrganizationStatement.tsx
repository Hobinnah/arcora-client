import type { Organization } from "./Organization";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type OrganizationStatement = {
    organizationStatementID: string;
    organizationID: string;
    period: number;
    income: number;
    expenses: number;
    netAmount: number;
    capturedBy: string;
    capturedDate: string;
    organization: Organization;
};
