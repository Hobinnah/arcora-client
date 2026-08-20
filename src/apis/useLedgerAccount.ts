{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { LedgerAccount } from "../types/LedgerAccount";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type LedgerAccountsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  isActive?: string;
  accountCategory?: string;
};

export const getLedgerAccounts = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  isActive,
  accountCategory,
  sortBy,
  sortDirection
}: LedgerAccountsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchLedgerAccounts',
      { pageSize, pageNumber, searchQuery,
        isActive,
        accountCategory,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchLedgerAccounts({ pageSize, pageNumber, searchQuery,
      isActive,
      accountCategory,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchLedgerAccounts = async ({
  pageSize,
  pageNumber,
  searchQuery,
  isActive,
  accountCategory,
  sortBy,
  sortDirection
}: Required<Pick<LedgerAccountsListParams, 'pageSize' | 'pageNumber'>> & Omit<LedgerAccountsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<LedgerAccount>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/ledgeraccount/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (isActive) { url += `&isActive=${encodeURIComponent(isActive)}`; }
    if (accountCategory) { url += `&accountCategory=${encodeURIComponent(accountCategory)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch ledgerAccounts');
  }
};

export const getLedgerAccount = async (id?: string): Promise<LedgerAccount> => {
  try {
    const url = `${BASE_URL}api/ledgeraccount/getLedgerAccountById/${id}`;
    const response = await axios.get(url);
    return response.data as LedgerAccount;
  } catch (error) {
    handleApiError(error, 'get ledgerAccount');
    throw error;
  }
};

export const createLedgerAccount = async (LedgerAccount?: LedgerAccount): Promise<LedgerAccount> => {
  try {
    const url = `${BASE_URL}api/ledgeraccount/createLedgerAccount`;
    const response = await axios.post(url, LedgerAccount);
    return response.data as LedgerAccount;
  } catch (error) {
    handleApiError(error, 'create ledgerAccount');
    throw error;
  }
};

export const updateLedgerAccount = async (ledgerAccount?: LedgerAccount): Promise<LedgerAccount> => {
  try {
    const id = ((ledgerAccount as any)?.ledgerAccountID ?? '').toString();
    const url = `${BASE_URL}api/ledgeraccount/updateLedgerAccount/${id}`;
    const response = await axios.put(url, ledgerAccount);
    return response.data as LedgerAccount;
  } catch (error) {
    handleApiError(error, 'update ledgerAccount');
    throw error;
  }
};

export const deleteLedgerAccount = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/ledgeraccount/deleteLedgerAccount/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete ledgerAccount');
  }
};

