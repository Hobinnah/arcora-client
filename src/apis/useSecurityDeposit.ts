{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { SecurityDeposit } from "../types/SecurityDeposit";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type HostSecurityDeposit = {
  securityDepositID: string;
  leaseID?: string | null;
  tenantID: string;
  organizationID: string;
  requiredAmount: number;
  receivedAmount: number;
  appliedAmount: number;
  returnedAmount: number;
  heldAmount: number;
  currency: string;
  status: string;
  dueDate?: string | null;
  heldAt?: string | null;
  closedAt?: string | null;
  tenantDisplayName?: string | null;
  tenantEmail?: string | null;
  leaseDisplay?: string | null;
  listingDisplay?: string | null;
};

export type HostSecurityDepositList = {
  data: HostSecurityDeposit[];
  totalCount: number;
  summary: {
    heldAmountTotal: number;
    returnsDueAmountTotal: number;
    reviewNeededCount: number;
  };
};

export const fetchHostSecurityDeposits = async ({
  pageSize = 100,
  pageNumber = 1,
  status,
}: {
  pageSize?: number;
  pageNumber?: number;
  status?: string;
} = {}): Promise<HostSecurityDepositList> => {
  try {
    const response = await axios.get<HostSecurityDepositList>(`${BASE_URL}api/hosting/securitydeposits`, {
      params: { pageSize, pageNumber, status },
    });
    if (!Array.isArray(response.data?.data)) {
      throw new Error("The hosting security deposit response was not in the expected format.");
    }
    return response.data;
  } catch (error) {
    handleApiError(error, "fetch hosting security deposits");
    throw error;
  }
};

export const uploadSecurityDepositEvidence = async (
  securityDepositID: string,
  file: File,
): Promise<{ attachmentID: string; fileName: string }> => {
  const formData = new FormData();
  formData.append("File", file);
  try {
    const response = await axios.post(
      `${BASE_URL}api/hosting/securitydeposits/${encodeURIComponent(securityDepositID)}/evidence`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    const attachmentID = response.data?.attachmentID ?? response.data?.AttachmentID;
    if (!attachmentID) throw new Error("Evidence uploaded, but the API did not return its attachment ID.");
    return { attachmentID: String(attachmentID), fileName: response.data?.fileName ?? file.name };
  } catch (error) {
    handleApiError(error, "upload security deposit evidence");
    throw error;
  }
};

export type SecurityDepositDeductionInput = {
  description: string;
  amount: number;
  evidenceAttachmentIDs: string[];
};

export const sendSecurityDepositSettlementNotice = async (
  securityDepositID: string,
  request: { deductions: SecurityDepositDeductionInput[]; currency: string },
  idempotencyKey: string,
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}api/securitydeposit/${encodeURIComponent(securityDepositID)}/settlement-notice`,
      request,
      { headers: { "Idempotency-Key": idempotencyKey } },
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "send security deposit settlement notice");
    throw error;
  }
};

export const returnSecurityDeposit = async (
  securityDepositID: string,
  request: { amount: number; currency: string; idempotencyKey: string },
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}api/securitydeposit/${encodeURIComponent(securityDepositID)}/return`,
      request,
    );
    return response.data as {
      securityDepositID: string;
      refundID: string;
      securityDepositTransactionID: string;
      returnedAmount: number;
      heldAmount: number;
      status: string;
      refundStatus: string;
      idempotentReplay: boolean;
    };
  } catch (error) {
    handleApiError(error, "record security deposit return");
    throw error;
  }
};

export type SecurityDepositsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  userID?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
};

export const getSecurityDeposits = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  userID,
  statusFilter,
  sortBy,
  sortDirection
}: SecurityDepositsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchSecurityDeposits',
      { pageSize, pageNumber, searchQuery,
        userID,
        statusFilter,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchSecurityDeposits({ pageSize, pageNumber, searchQuery,
      userID,
      statusFilter,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchSecurityDeposits = async ({
  pageSize,
  pageNumber,
  searchQuery,
  userID,
  statusFilter,
  sortBy,
  sortDirection
}: Required<Pick<SecurityDepositsListParams, 'pageSize' | 'pageNumber'>> & Omit<SecurityDepositsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<SecurityDeposit>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/securitydeposit/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (userID !== undefined) { url += `&UserID=${userID}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch securityDeposits');
  }
};

export const getSecurityDeposit = async (id?: string): Promise<SecurityDeposit> => {
  try {
    const url = `${BASE_URL}api/securitydeposit/getSecurityDepositById/${id}`;
    const response = await axios.get(url);
    return response.data as SecurityDeposit;
  } catch (error) {
    handleApiError(error, 'get securityDeposit');
    throw error;
  }
};

export const createSecurityDeposit = async (SecurityDeposit?: SecurityDeposit): Promise<SecurityDeposit> => {
  try {
    const url = `${BASE_URL}api/securitydeposit/createSecurityDeposit`;
    const response = await axios.post(url, SecurityDeposit);
    return response.data as SecurityDeposit;
  } catch (error) {
    handleApiError(error, 'create securityDeposit');
    throw error;
  }
};

export const updateSecurityDeposit = async (securityDeposit?: SecurityDeposit): Promise<SecurityDeposit> => {
  try {
    const id = ((securityDeposit as any)?.securityDepositID ?? '').toString();
    const url = `${BASE_URL}api/securitydeposit/updateSecurityDeposit/${id}`;
    const response = await axios.put(url, securityDeposit);
    return response.data as SecurityDeposit;
  } catch (error) {
    handleApiError(error, 'update securityDeposit');
    throw error;
  }
};

export const deleteSecurityDeposit = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/securitydeposit/deleteSecurityDeposit/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete securityDeposit');
  }
};

export const fireSecurityDepositAction = async (id?: string, status?: string): Promise<SecurityDeposit> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/securitydeposit/updateSecurityDepositStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/securitydeposit/updatesecuritydepositstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/SECURITYDEPOSIT/UpdateSecurityDepositStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as SecurityDeposit;
  } catch (error) {
    handleApiError(error, 'fire securityDeposit action');
    throw error;
  }
};
