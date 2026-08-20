{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { LedgerTransaction } from "../types/LedgerTransaction";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type LedgerTransactionsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  transactionDate?: string;
};

export const getLedgerTransactions = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  transactionDate,
  sortBy,
  sortDirection
}: LedgerTransactionsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchLedgerTransactions',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        transactionDate,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchLedgerTransactions({ pageSize, pageNumber, searchQuery,
      statusFilter,
      transactionDate,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchLedgerTransactions = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  transactionDate,
  sortBy,
  sortDirection
}: Required<Pick<LedgerTransactionsListParams, 'pageSize' | 'pageNumber'>> & Omit<LedgerTransactionsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<LedgerTransaction>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/ledgertransaction/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (transactionDate) { url += `&transactionDate=${encodeURIComponent(transactionDate)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch ledgerTransactions');
  }
};

export const getLedgerTransaction = async (id?: string): Promise<LedgerTransaction> => {
  try {
    const url = `${BASE_URL}api/ledgertransaction/getLedgerTransactionById/${id}`;
    const response = await axios.get(url);
    return response.data as LedgerTransaction;
  } catch (error) {
    handleApiError(error, 'get ledgerTransaction');
    throw error;
  }
};

export const createLedgerTransaction = async (LedgerTransaction?: LedgerTransaction): Promise<LedgerTransaction> => {
  try {
    const url = `${BASE_URL}api/ledgertransaction/createLedgerTransaction`;
    const response = await axios.post(url, LedgerTransaction);
    return response.data as LedgerTransaction;
  } catch (error) {
    handleApiError(error, 'create ledgerTransaction');
    throw error;
  }
};

export const updateLedgerTransaction = async (ledgerTransaction?: LedgerTransaction): Promise<LedgerTransaction> => {
  try {
    const id = ((ledgerTransaction as any)?.ledgerTransactionID ?? '').toString();
    const url = `${BASE_URL}api/ledgertransaction/updateLedgerTransaction/${id}`;
    const response = await axios.put(url, ledgerTransaction);
    return response.data as LedgerTransaction;
  } catch (error) {
    handleApiError(error, 'update ledgerTransaction');
    throw error;
  }
};

export const deleteLedgerTransaction = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/ledgertransaction/deleteLedgerTransaction/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete ledgerTransaction');
  }
};

export const fireLedgerTransactionAction = async (id?: string, status?: string): Promise<LedgerTransaction> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/ledgertransaction/updateLedgerTransactionStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/ledgertransaction/updateledgertransactionstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/LEDGERTRANSACTION/UpdateLedgerTransactionStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as LedgerTransaction;
  } catch (error) {
    handleApiError(error, 'fire ledgerTransaction action');
    throw error;
  }
};

