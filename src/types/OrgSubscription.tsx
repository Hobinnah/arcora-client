import type { Organization } from "./Organization";
import type { SubscriptionPlan } from "./SubscriptionPlan";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type OrgSubscription = {
    orgSubscriptionID: string;
    organizationID: string;
    subscriptionPlanID: string;
    status: string;
    billingFrequency: string;
    startedAt: string;
    trialEndsAt: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    cancelledAt: string;
    endedAt: string;
    providerName: string;
    providerCustomerID: string;
    providerSubscriptionID: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    organization: Organization;
    subscriptionPlan: SubscriptionPlan;
};
