import { createOrganization, getOrganization, updateOrganization } from "./useOrganization";
import { fetchOrganizationMembers } from "./useOrganizationMember";
import type { Organization } from "../types/Organization";

export const CANADA_PROVINCES = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
];

export type LandlordOrganizationDraft = {
  legalName: string;
  displayName: string;
  isPersonal: boolean;
  businessNumber: string;
  provinceCode: string;
  defaultCurrency: string;
  timeZone: string;
  lateFeeEnabled: boolean;
  autoInvoiceGeneration: boolean;
  autoPaymentRetry: boolean;
  requireBackgroundCheck: boolean;
};

export const hasLandlordOrganization = async (userID: number): Promise<boolean> => {
  const { data } = await fetchOrganizationMembers({ pageSize: 200, pageNumber: 0 });
  return data.some((row) => Number(row.userID) === userID);
};

export const getLandlordOrganization = async (userID: number): Promise<Organization | null> => {
  const { data } = await fetchOrganizationMembers({ pageSize: 200, pageNumber: 0 });
  const membership = data.find((row) => Number(row.userID) === userID);
  if (!membership) return null;
  if (membership.organization?.organizationID) return membership.organization;
  return getOrganization(membership.organizationID);
};

export const saveLandlordOrganization = async (organization: Organization): Promise<Organization> => {
  return updateOrganization(organization);
};


export const createLandlordOrganization = async (draft: LandlordOrganizationDraft, capturedBy: string): Promise<Organization> => {
  const now = new Date().toISOString();
  const organization = await createOrganization({
    organizationID: null,
    legalName: draft.legalName,
    displayName: draft.displayName,
    businessNumber: draft.isPersonal ? "" : draft.businessNumber,
    countryCode: "CA",
    provinceCode: draft.provinceCode,
    isPersonal: draft.isPersonal,
    status: "ACTIVE",
    defaultCurrency: draft.defaultCurrency,
    timeZone: draft.timeZone,
    invoicePrefix: "",
    receiptPrefix: "",
    lateFeeEnabled: draft.lateFeeEnabled,
    autoInvoiceGeneration: draft.autoInvoiceGeneration,
    autoPaymentRetry: draft.autoPaymentRetry,
    paymentProvider: "",
    brandLogoUrl: "",
    requireBackgroundCheck: draft.requireBackgroundCheck,
    rankingScore: 0,
    capturedDate: now,
    capturedBy,
    updatedDate: null,
    updatedBy: "",
  } as unknown as Organization);
  return organization;
};
