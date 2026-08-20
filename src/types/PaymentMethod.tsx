import type { Tenant } from "./Tenant";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type PaymentMethod = {
    paymentMethodID: string;
    tenantID: string;
    paymentMethodType: string;
    displayName: string;
    accountLast4: string;
    cardBrand: string;
    bankName: string;
    expiryMonth: number;
    expiryYear: number;
    providerName: string;
    providerCustomerID: string;
    providerPaymentMethodID: string;
    verificationStatus: string;
    verifiedAt: string;
    isDefault: boolean;
    isActive: boolean;
    capturedBy: string;
    capturedDate: string;
    updatedDate: string;
    updatedBy: string;
    tenant: Tenant;
};
