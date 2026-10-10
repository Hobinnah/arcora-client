{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { TenantInvitation } from "../types/TenantInvitation";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export const acceptedInvitationStorageKey = 'arcora:accepted-tenant-invitation';

export type TenantInvitationsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
};

export type CreateTenantInvitationInput = Pick<
  TenantInvitation,
  'listingID' | 'invitationPurpose' | 'email' | 'phoneNumber' | 'status'
> & {
  name?: string;
  organizationID?: string;
  leaseID?: string;
  startDate?: string | null;
  leaseTermMonths?: number | null;
  price?: number | null;
  securityDepositAmount?: number | null;
  currency?: string | null;
  rentalApplicationID?: string | null;
  tokenHash?: string;
  expiresAt?: string | null;
  capturedBy?: string;
  capturedDate?: string;
};

export const getTenantInvitations = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: TenantInvitationsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchTenantInvitations',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchTenantInvitations({ pageSize, pageNumber, searchQuery,
      statusFilter,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchTenantInvitations = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: Required<Pick<TenantInvitationsListParams, 'pageSize' | 'pageNumber'>> & Omit<TenantInvitationsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<TenantInvitation>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/tenantinvitation/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch tenantInvitations');
  }
};

export const fetchTenantInvitationsByOrganization = async (
  organizationID: string,
): Promise<TenantInvitation[]> => {
  try {
    const response = await axios.get<TenantInvitation[]>(`${BASE_URL}api/tenantinvitation/by-organization`, {
      params: { organizationID },
    });
    if (!Array.isArray(response.data)) {
      throw new Error("The invitation list response was not in the expected format.");
    }
    return response.data;
  } catch (error) {
    handleApiError(error, "fetch tenant invitations by organization");
    throw error;
  }
};

export const retryTenantInvitationEmail = async (id: string): Promise<TenantInvitation> => {
  try {
    const response = await axios.post<TenantInvitation>(
      `${BASE_URL}api/tenantinvitation/${encodeURIComponent(id)}/retry-email`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<{ detail?: string }>(error) && typeof error.response?.data?.detail === "string") {
      throw new Error(error.response.data.detail);
    }
    handleApiError(error, "retry invitation email");
    throw error;
  }
};

export const getAcceptedInvitationForMe = async (id: string): Promise<TenantInvitation> => {
  try {
    const response = await axios.get<TenantInvitation>(
      `${BASE_URL}api/tenantinvitation/${encodeURIComponent(id)}/for-me`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<{ detail?: string }>(error) && typeof error.response?.data?.detail === "string") {
      throw new Error(error.response.data.detail);
    }
    handleApiError(error, "load accepted invitation");
    throw error;
  }
};

export const getTenantInvitation = async (id?: string): Promise<TenantInvitation> => {
  try {
    const url = `${BASE_URL}api/tenantinvitation/getTenantInvitationById/${id}`;
    const response = await axios.get(url);
    return response.data as TenantInvitation;
  } catch (error) {
    handleApiError(error, 'get tenantInvitation');
    throw error;
  }
};

export const createTenantInvitation = async (TenantInvitation: CreateTenantInvitationInput): Promise<TenantInvitation> => {
  try {
    const url = `${BASE_URL}api/tenantinvitation/createTenantInvitation`;
    const response = await axios.post<{ success: boolean; message?: string; tenantInvitation?: TenantInvitation }>(url, TenantInvitation);
    if (!response.data.success || !response.data.tenantInvitation) {
      throw new Error(response.data.message || "The invitation creation response was invalid.");
    }
    return response.data.tenantInvitation;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      throw error;
    }
    handleApiError(error, 'create tenantInvitation');
    throw error;
  }
};

export type TenantInvitationResponseResult = {
  tenantInvitationID?: string | null;
  status?: string | null;
};

export const respondToTenantInvitation = async (
  token: string,
  response: 'ACCEPT' | 'DECLINE',
): Promise<TenantInvitationResponseResult> => {
  try {
    const result = await axios.post(`${BASE_URL}api/tenantinvitation/respond`, undefined, {
      params: { token, response },
    });
    const data = result.data;
    if (!data || typeof data !== 'object') return {};
    const invitation = data.tenantInvitation ?? data.TenantInvitation ?? data;
    return {
      tenantInvitationID: invitation?.tenantInvitationID ?? invitation?.tenantInvitationId ?? data.invitationID ?? data.invitationId ?? null,
      status: invitation?.status ?? data.status ?? null,
    };
  } catch (error) {
    handleApiError(error, 'respond to tenant invitation');
    throw error;
  }
};

export type CreateLeaseFromInvitationResult = {
  leaseID: string;
  status?: string | null;
};

// Server uses the persisted invitation quote; the client only identifies the invitation and tenant.
export const createLeaseFromTenantInvitation = async (
  tenantInvitationID: string,
  tenantID: string,
): Promise<CreateLeaseFromInvitationResult> => {
  try {
    const url = `${BASE_URL}api/tenantinvitation/${encodeURIComponent(tenantInvitationID)}/createLease`;
    const response = await axios.post(url, { tenantID });
    const data = response.data ?? {};
    const leaseID = data.leaseID ?? data.leaseId ?? data.lease?.leaseID;
    if (!leaseID) throw new Error('The lease was created, but no lease ID was returned.');
    return { leaseID: String(leaseID), status: data.status ?? data.lease?.status ?? null };
  } catch (error) {
    if (axios.isAxiosError<{ detail?: string }>(error) && typeof error.response?.data?.detail === "string") {
      throw new Error(error.response.data.detail);
    }
    handleApiError(error, 'create lease from tenant invitation');
    throw error;
  }
};

export type PendingTenantInvitation = {
  tenantInvitationID: string;
  listingID?: string | null;
  name?: string | null;
  email?: string | null;
  status?: string | null;
  expiresAt?: string | null;
  acceptedAt?: string | null;
  startDate?: string | null;
  leaseTermMonths?: number | null;
  price?: number | null;
  securityDepositAmount?: number | null;
  currency?: string | null;
  endDate?: string | null;
};

// Accepted invitations for the signed-in tenant that do not have a lease yet.
export const fetchPendingInvitationsForMe = async (accessToken?: string): Promise<PendingTenantInvitation[]> => {
  const response = await axios.get(`${BASE_URL}api/tenantinvitation/pending-for-me`, accessToken
    ? { headers: { Authorization: `Bearer ${accessToken}` } }
    : undefined);
  const data = Array.isArray(response.data) ? response.data : [];
  return data
    .map((item: any) => ({
      ...item,
      tenantInvitationID: String(item?.tenantInvitationID ?? item?.tenantInvitationId ?? ''),
    }))
    .filter((item: PendingTenantInvitation) => item.tenantInvitationID);
};

export const updateTenantInvitation = async (tenantInvitation?: TenantInvitation): Promise<TenantInvitation> => {
  try {
    const id = ((tenantInvitation as any)?.tenantInvitationID ?? '').toString();
    const url = `${BASE_URL}api/tenantinvitation/updateTenantInvitation/${id}`;
    const response = await axios.put(url, tenantInvitation);
    return response.data as TenantInvitation;
  } catch (error) {
    handleApiError(error, 'update tenantInvitation');
    throw error;
  }
};

export const deleteTenantInvitation = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/tenantinvitation/deleteTenantInvitation/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete tenantInvitation');
  }
};

export const fireTenantInvitationAction = async (id?: string, status?: string): Promise<TenantInvitation> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/tenantinvitation/updateTenantInvitationStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/tenantinvitation/updatetenantinvitationstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/TENANTINVITATION/UpdateTenantInvitationStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as TenantInvitation;
  } catch (error) {
    handleApiError(error, 'fire tenantInvitation action');
    throw error;
  }
};
