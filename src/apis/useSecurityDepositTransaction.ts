{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { SecurityDepositTransaction } from "../types/SecurityDepositTransaction";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type SecurityDepositTransactionsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getSecurityDepositTransactions = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: SecurityDepositTransactionsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchSecurityDepositTransactions',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchSecurityDepositTransactions({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchSecurityDepositTransactions = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<SecurityDepositTransactionsListParams, 'pageSize' | 'pageNumber'>> & Omit<SecurityDepositTransactionsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<SecurityDepositTransaction>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/securitydeposittransaction/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch securityDepositTransactions');
  }
};

export const getSecurityDepositTransaction = async (id?: string): Promise<SecurityDepositTransaction> => {
  try {
    const url = `${BASE_URL}api/securitydeposittransaction/getSecurityDepositTransactionById/${id}`;
    const response = await axios.get(url);
    return response.data as SecurityDepositTransaction;
  } catch (error) {
    handleApiError(error, 'get securityDepositTransaction');
    throw error;
  }
};

export const createSecurityDepositTransaction = async (SecurityDepositTransaction?: SecurityDepositTransaction): Promise<SecurityDepositTransaction> => {
  try {
    const url = `${BASE_URL}api/securitydeposittransaction/createSecurityDepositTransaction`;
    const response = await axios.post(url, SecurityDepositTransaction);
    return response.data as SecurityDepositTransaction;
  } catch (error) {
    handleApiError(error, 'create securityDepositTransaction');
    throw error;
  }
};

export const updateSecurityDepositTransaction = async (securityDepositTransaction?: SecurityDepositTransaction): Promise<SecurityDepositTransaction> => {
  try {
    const id = ((securityDepositTransaction as any)?.securityDepositTransactionID ?? '').toString();
    const url = `${BASE_URL}api/securitydeposittransaction/updateSecurityDepositTransaction/${id}`;
    const response = await axios.put(url, securityDepositTransaction);
    return response.data as SecurityDepositTransaction;
  } catch (error) {
    handleApiError(error, 'update securityDepositTransaction');
    throw error;
  }
};

export const deleteSecurityDepositTransaction = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/securitydeposittransaction/deleteSecurityDepositTransaction/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete securityDepositTransaction');
  }
};

