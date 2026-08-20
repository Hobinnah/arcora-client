{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { LedgerEntry } from "../types/LedgerEntry";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type LedgerEntriesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getLedgerEntries = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: LedgerEntriesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchLedgerEntries',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchLedgerEntries({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchLedgerEntries = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<LedgerEntriesListParams, 'pageSize' | 'pageNumber'>> & Omit<LedgerEntriesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<LedgerEntry>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/ledgerentry/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch ledgerEntries');
  }
};

export const getLedgerEntry = async (id?: string): Promise<LedgerEntry> => {
  try {
    const url = `${BASE_URL}api/ledgerentry/getLedgerEntryById/${id}`;
    const response = await axios.get(url);
    return response.data as LedgerEntry;
  } catch (error) {
    handleApiError(error, 'get ledgerEntry');
    throw error;
  }
};

export const createLedgerEntry = async (LedgerEntry?: LedgerEntry): Promise<LedgerEntry> => {
  try {
    const url = `${BASE_URL}api/ledgerentry/createLedgerEntry`;
    const response = await axios.post(url, LedgerEntry);
    return response.data as LedgerEntry;
  } catch (error) {
    handleApiError(error, 'create ledgerEntry');
    throw error;
  }
};

export const updateLedgerEntry = async (ledgerEntry?: LedgerEntry): Promise<LedgerEntry> => {
  try {
    const id = ((ledgerEntry as any)?.ledgerEntryID ?? '').toString();
    const url = `${BASE_URL}api/ledgerentry/updateLedgerEntry/${id}`;
    const response = await axios.put(url, ledgerEntry);
    return response.data as LedgerEntry;
  } catch (error) {
    handleApiError(error, 'update ledgerEntry');
    throw error;
  }
};

export const deleteLedgerEntry = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/ledgerentry/deleteLedgerEntry/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete ledgerEntry');
  }
};

