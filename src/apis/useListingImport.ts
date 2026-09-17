import { env } from "../env";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Address } from "../types/Address";
import type { Property } from "../types/Property";
import type { RentalUnit } from "../types/RentalUnit";
import type { Listing } from "../types/Listing";
import type { ListingPhoto } from "../types/ListingPhoto";
import type { Organization } from "../types/Organization";
import { fetchOrganizationMembers } from "./useOrganizationMember";
import { getOrganization } from "./useOrganization";

axios.defaults.withCredentials = false;

const BASE_URL = env.API_BASE_URL;

// Reuse the app's entity types for the create payload; relation objects and
// server-assigned fields (IDs, audit fields) are optional since they don't
// exist yet at creation time and the server fills/ignores them.
export type AddressImportPayload = Partial<Omit<Address, "organization">>;
export type PropertyImportPayload = Partial<Omit<Property, "organization" | "address">> & { address: AddressImportPayload };
export type RentalUnitImportPayload = Partial<Omit<RentalUnit, "property" | "unitType">>;
export type ListingImportPayload = Partial<Omit<Listing,
  "rentalUnit" | "listingType" | "organization" | "reviewList" | "listingTermPrices" |
  "listingAccessInstructions" | "listingPhotos" | "listingAmenities" | "listingRules" |
  "listingPolicies" | "calendarEvents"
>> & {
  // Listing.tsx (auto-generated) doesn't yet include this field; add it here until regenerated.
  isPetFriendly?: boolean;
};
export type ListingPhotoImportPayload = Partial<Omit<ListingPhoto, "listing">>;

export type UnitImportPayload = {
  rentalUnit: RentalUnitImportPayload;
  unitTypeName: string;
  listing: ListingImportPayload;
  listingTypeName: string;
  selectedAmenities: string[];
  listingPhotos: ListingPhotoImportPayload[];
};

export type ListingImportRequest = {
  property: PropertyImportPayload;
  units: UnitImportPayload[];
  safetyDetails?: Record<string, string> | null;
};

export type ListingImportUnitResult = {
  unitNumber: string;
  rentalUnitID: string;
  listingID: string;
};

export type ListingImportResult = {
  addressID: string | null;
  propertyID: string;
  units: ListingImportUnitResult[];
};

export const resolveOrganizationForUser = async (userID: number | string): Promise<Organization> => {
  const members = await fetchOrganizationMembers({ pageSize: 200, pageNumber: 0 });
  const member = members.data.find((item) => String(item.userID) === String(userID));
  if (!member) throw new Error("No organization membership found for this account.");
  if (member.organization) return member.organization;
  if (!member.organizationID) throw new Error("The organization membership has no organization ID.");
  return getOrganization(member.organizationID);
};

export const importListing = async (request: ListingImportRequest): Promise<ListingImportResult> => {
  try {
    const url = `${BASE_URL}api/listing/PublishListing`;
    if (import.meta.env.DEV) {
      console.info("[ListingImport] PublishListing payload", request);
    }
    const response = await axios.post(url, request, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data as ListingImportResult;
  } catch (error) {
    handleApiError(error, "import listing");
    throw error;
  }
};

