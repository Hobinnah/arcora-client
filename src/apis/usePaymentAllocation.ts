{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { PaymentAllocation } from "../types/PaymentAllocation";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type PaymentAllocationsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getPaymentAllocations = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: PaymentAllocationsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchPaymentAllocations',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchPaymentAllocations({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchPaymentAllocations = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<PaymentAllocationsListParams, 'pageSize' | 'pageNumber'>> & Omit<PaymentAllocationsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<PaymentAllocation>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/paymentallocation/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch paymentAllocations');
  }
};

export const getPaymentAllocation = async (id?: string): Promise<PaymentAllocation> => {
  try {
    const url = `${BASE_URL}api/paymentallocation/getPaymentAllocationById/${id}`;
    const response = await axios.get(url);
    return response.data as PaymentAllocation;
  } catch (error) {
    handleApiError(error, 'get paymentAllocation');
    throw error;
  }
};

export const createPaymentAllocation = async (PaymentAllocation?: PaymentAllocation): Promise<PaymentAllocation> => {
  try {
    const url = `${BASE_URL}api/paymentallocation/createPaymentAllocation`;
    const response = await axios.post(url, PaymentAllocation);
    return response.data as PaymentAllocation;
  } catch (error) {
    handleApiError(error, 'create paymentAllocation');
    throw error;
  }
};

export const updatePaymentAllocation = async (paymentAllocation?: PaymentAllocation): Promise<PaymentAllocation> => {
  try {
    const id = ((paymentAllocation as any)?.paymentAllocationID ?? '').toString();
    const url = `${BASE_URL}api/paymentallocation/updatePaymentAllocation/${id}`;
    const response = await axios.put(url, paymentAllocation);
    return response.data as PaymentAllocation;
  } catch (error) {
    handleApiError(error, 'update paymentAllocation');
    throw error;
  }
};

export const deletePaymentAllocation = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/paymentallocation/deletePaymentAllocation/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete paymentAllocation');
  }
};

