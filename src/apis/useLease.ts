{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Lease } from "../types/Lease";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type LeaseSigningRequestSigner = {
  name: string;
  email: string;
  role?: string;
  userId?: number;
  tenantId?: string;
  organizationMemberId?: string;
  signatureOrder?: number;
};

export type CreateLeaseSigningRequestInput = {
  leaseContractTemplateId?: string;
  signatories: LeaseSigningRequestSigner[];
  sequential: boolean;
  subject: string;
  message: string;
  returnUrl?: string;
  webhookCallbackUrl?: string | null;
  capturedBy: string;
  forceRegeneratePdf: boolean;
};

export type LeaseSigningRequestResponse = {
  signingRequestId: string;
  status: string;
  leaseId: string;
};

export const createLeaseSigningRequest = async (
  leaseID: string,
  payload: CreateLeaseSigningRequestInput,
): Promise<LeaseSigningRequestResponse> => {
  try {
    const response = await axios.post(
      `${BASE_URL}api/leases/${encodeURIComponent(leaseID)}/signing-requests`,
      payload,
    );
    if (response.status !== 202) {
      throw new Error(`The lease signing request was not queued (HTTP ${response.status}).`);
    }
    if (!response.data?.signingRequestId) {
      throw new Error("The lease signing request was accepted without a request ID.");
    }
    return response.data as LeaseSigningRequestResponse;
  } catch (error) {
    handleApiError(error, "start lease signing request");
    throw error;
  }
};

export type LeaseSigningStatusSignatory = {
  leaseSignatoryId?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  signatureOrder?: number;
  providerSignerId?: string;
  viewedAt?: string | null;
  signedAt?: string | null;
  declinedAt?: string | null;
};

export type LeaseSigningStatus = {
  signingRequestId: string;
  leaseId: string;
  leaseDocumentId?: string;
  status: string;
  providerRequestId?: string | null;
  providerDocumentId?: string | null;
  providerStatus?: string | null;
  documentUrl?: string | null;
  sentForSignatureAt?: string | null;
  fullySignedAt?: string | null;
  refreshedFromProvider?: boolean;
  signatories: LeaseSigningStatusSignatory[];
};

export const getLeaseSigningStatus = async (
  leaseID: string,
  signingRequestID: string,
  refreshFromProvider = true,
): Promise<LeaseSigningStatus> => {
  try {
    const response = await axios.get(
      `${BASE_URL}api/leases/${encodeURIComponent(leaseID)}/signing-requests/${encodeURIComponent(signingRequestID)}`,
      { params: { refreshFromProvider } },
    );
    const data = (response.data ?? {}) as Partial<LeaseSigningStatus>;
    return {
      ...data,
      signingRequestId: data.signingRequestId ?? signingRequestID,
      leaseId: data.leaseId ?? leaseID,
      status: data.status ?? "",
      signatories: Array.isArray(data.signatories) ? data.signatories : [],
    };
  } catch (error) {
    // Let callers distinguish "no such lease/request" from other failures.
    if (axios.isAxiosError(error) && error.response?.status === 404) throw error;
    handleApiError(error, "load lease signing status");
    throw error;
  }
};

export type LeasesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  currency?: string;
  tenantID?: string;
  organizationID?: string;
  listingID?: string;
};

export const getLeases = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  currency,
  tenantID,
  organizationID,
  listingID,
  sortBy,
  sortDirection
}: LeasesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchLeases',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        currency,
        tenantID,
        organizationID,
        listingID,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchLeases({ pageSize, pageNumber, searchQuery,
      statusFilter,
      currency,
      tenantID,
      organizationID,
      listingID,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchLeases = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  currency,
  tenantID,
  organizationID,
  listingID,
  sortBy,
  sortDirection
}: Required<Pick<LeasesListParams, 'pageSize' | 'pageNumber'>> & Omit<LeasesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Lease>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/lease/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (currency) { url += `&currency=${encodeURIComponent(currency)}`; }
    if (tenantID) { url += `&tenantID=${encodeURIComponent(tenantID)}`; }
    if (organizationID) { url += `&organizationID=${encodeURIComponent(organizationID)}`; }
    if (listingID) { url += `&listingID=${encodeURIComponent(listingID)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch leases');
  }
};

export const getLease = async (id?: string): Promise<Lease> => {
  try {
    const url = `${BASE_URL}api/lease/getLeaseById/${id}`;
    const response = await axios.get(url);
    return response.data as Lease;
  } catch (error) {
    handleApiError(error, 'get lease');
    throw error;
  }
};

export const createLease = async (Lease?: Lease): Promise<Lease> => {
  try {
    const url = `${BASE_URL}api/lease/createLease`;
    const response = await axios.post(url, Lease);
    return response.data as Lease;
  } catch (error) {
    handleApiError(error, 'create lease');
    throw error;
  }
};

export const updateLease = async (lease?: Lease): Promise<Lease> => {
  try {
    const id = ((lease as any)?.leaseID ?? '').toString();
    const url = `${BASE_URL}api/lease/updateLease/${id}`;
    const response = await axios.put(url, lease);
    return response.data as Lease;
  } catch (error) {
    handleApiError(error, 'update lease');
    throw error;
  }
};

export const deleteLease = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/lease/deleteLease/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete lease');
  }
};

export const fireLeaseAction = async (id?: string, status?: string): Promise<Lease> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/lease/updateLeaseStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/lease/updateleasestatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/LEASE/UpdateLeaseStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as Lease;
  } catch (error) {
    handleApiError(error, 'fire lease action');
    throw error;
  }
};
