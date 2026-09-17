import { fetchOrganizationMembers } from "../apis/useOrganizationMember";
import type { OrganizationMember } from "../types/OrganizationMember";

// Landlord viewing their own hosting pages: resolve their membership from the auth user id.
export const getCurrentOrganizationMember = async (userID?: number): Promise<OrganizationMember | null> => {
  if (!userID) return null;
  const { data } = await fetchOrganizationMembers({ pageSize: 200, pageNumber: 0 });
  return data.find((member) => member.userID === userID) ?? null;
};

// Tenant submit flow: which landlord-side member to attach/alert for a given listing's organization.
export const getNotifiableOrganizationMember = async (organizationID?: string | null): Promise<OrganizationMember | null> => {
  if (!organizationID) return null;
  const { data } = await fetchOrganizationMembers({ pageSize: 200, pageNumber: 0 });
  const forOrg = data.filter((member) => member.organizationID === organizationID);
  return forOrg.find((member) => member.isPrimaryOwner) ?? forOrg.find((member) => member.status === "ACTIVE") ?? forOrg[0] ?? null;
};
