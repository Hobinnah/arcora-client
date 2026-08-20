{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { OrgPayoutAccount } from "../types/OrgPayoutAccount";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type OrgPayoutAccountsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  verificationStatus?: string;
  isActive?: string;
};

export const getOrgPayoutAccounts = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  verificationStatus,
  isActive,
  sortBy,
  sortDirection
}: OrgPayoutAccountsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchOrgPayoutAccounts',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        verificationStatus,
        isActive,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchOrgPayoutAccounts({ pageSize, pageNumber, searchQuery,
      statusFilter,
      verificationStatus,
      isActive,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchOrgPayoutAccounts = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  verificationStatus,
  isActive,
  sortBy,
  sortDirection
}: Required<Pick<OrgPayoutAccountsListParams, 'pageSize' | 'pageNumber'>> & Omit<OrgPayoutAccountsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<OrgPayoutAccount>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/orgpayoutaccount/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (verificationStatus) { url += `&verificationStatus=${encodeURIComponent(verificationStatus)}`; }
    if (isActive) { url += `&isActive=${encodeURIComponent(isActive)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch orgPayoutAccounts');
  }
};

export const getOrgPayoutAccount = async (id?: string): Promise<OrgPayoutAccount> => {
  try {
    const url = `${BASE_URL}api/orgpayoutaccount/getOrgPayoutAccountById/${id}`;
    const response = await axios.get(url);
    return response.data as OrgPayoutAccount;
  } catch (error) {
    handleApiError(error, 'get orgPayoutAccount');
    throw error;
  }
};

export const createOrgPayoutAccount = async (OrgPayoutAccount?: OrgPayoutAccount): Promise<OrgPayoutAccount> => {
  try {
    const url = `${BASE_URL}api/orgpayoutaccount/createOrgPayoutAccount`;
    const response = await axios.post(url, OrgPayoutAccount);
    return response.data as OrgPayoutAccount;
  } catch (error) {
    handleApiError(error, 'create orgPayoutAccount');
    throw error;
  }
};

export const updateOrgPayoutAccount = async (orgPayoutAccount?: OrgPayoutAccount): Promise<OrgPayoutAccount> => {
  try {
    const id = ((orgPayoutAccount as any)?.orgPayoutAccountID ?? '').toString();
    const url = `${BASE_URL}api/orgpayoutaccount/updateOrgPayoutAccount/${id}`;
    const response = await axios.put(url, orgPayoutAccount);
    return response.data as OrgPayoutAccount;
  } catch (error) {
    handleApiError(error, 'update orgPayoutAccount');
    throw error;
  }
};

export const deleteOrgPayoutAccount = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/orgpayoutaccount/deleteOrgPayoutAccount/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete orgPayoutAccount');
  }
};

export const fireOrgPayoutAccountAction = async (id?: string, status?: string): Promise<OrgPayoutAccount> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/orgpayoutaccount/updateOrgPayoutAccountStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/orgpayoutaccount/updateorgpayoutaccountstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/ORGPAYOUTACCOUNT/UpdateOrgPayoutAccountStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as OrgPayoutAccount;
  } catch (error) {
    handleApiError(error, 'fire orgPayoutAccount action');
    throw error;
  }
};

