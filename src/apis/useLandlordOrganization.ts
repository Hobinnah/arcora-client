import { createOrganization, getOrganization, updateOrganization } from "./useOrganization";
import { createOrganizationMember, fetchOrganizationMembers } from "./useOrganizationMember";
import type { Organization } from "../types/Organization";
import type { OrganizationMember } from "../types/OrganizationMember";

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


export const createLandlordOrganization = async (draft: LandlordOrganizationDraft, userID: number): Promise<Organization> => {
  const now = new Date().toISOString();
  const organization = await createOrganization({
    organizationID: "",
    legalName: draft.legalName,
    displayName: draft.displayName,
    businessNumber: draft.isPersonal ? "" : draft.businessNumber,
    countryCode: "CA",
    provinceCode: draft.provinceCode,
    isPersonal: draft.isPersonal,
    status: "DRAFT",
    defaultCurrency: draft.defaultCurrency,
    timeZone: "",
    invoicePrefix: "",
    receiptPrefix: "",
    lateFeeEnabled: false,
    autoInvoiceGeneration: true,
    autoPaymentRetry: true,
    paymentProvider: "",
    brandLogoUrl: "",
    requireBackgroundCheck: false,
    rankingScore: 0,
    capturedDate: now,
    capturedBy: "",
    updatedDate: now,
    updatedBy: "",
  });
  await createOrganizationMember({
    organizationMemberID: "",
    organizationID: organization.organizationID,
    userID,
    roleName: "OWNER",
    status: "ACTIVE",
    isPrimaryOwner: true,
    invitedAt: now,
    acceptedAt: now,
    deactivatedAt: "",
    capturedDate: now,
    capturedBy: "",
    updatedDate: now,
    updatedBy: "",
    organization,
  } as OrganizationMember);
  return organization;
};
