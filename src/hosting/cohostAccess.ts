import type { AuthResponse } from "../types/AuthResponse";
import type { OrganizationMember } from "../types/OrganizationMember";

export type HostingPermission = "overview" | "calendar" | "messages" | "listings" | "applications" | "manage";

const normalizeAccess = (roleName?: string) => roleName?.trim().toLowerCase() || "";

export const activeOrganizationMemberships = (currentUser?: AuthResponse | null) =>
  (currentUser?.memberOrganizations ?? []).filter((member) => member.status?.toUpperCase() === "ACTIVE");

export const memberHasHostingPermission = (member: OrganizationMember, permission: HostingPermission) => {
  if (member.isPrimaryOwner) return true;
  const access = normalizeAccess(member.roleName);
  if (access === "full access") return true;
  if (permission === "overview" || permission === "calendar") {
    return access === "calendar access" || access === "calendar and message access";
  }
  if (permission === "messages") return access === "calendar and message access";
  return false;
};

export const hasHostingPermission = (currentUser: AuthResponse | null | undefined, permission: HostingPermission) => {
  const memberships = activeOrganizationMemberships(currentUser);
  if (memberships.length > 0) return memberships.some((member) => memberHasHostingPermission(member, permission));
  const roles = [...(currentUser?.roles ?? []), ...(currentUser?.user?.roles ?? [])]
    .flatMap((role) => role.split(","))
    .map((role) => role.trim().toLowerCase());
  return roles.includes("host") || roles.includes("landlord") || roles.includes("admin");
};
