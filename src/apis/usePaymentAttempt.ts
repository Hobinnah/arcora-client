{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { PaymentAttempt } from "../types/PaymentAttempt";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type PaymentAttemptsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
};

export const getPaymentAttempts = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: PaymentAttemptsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchPaymentAttempts',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchPaymentAttempts({ pageSize, pageNumber, searchQuery,
      statusFilter,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchPaymentAttempts = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: Required<Pick<PaymentAttemptsListParams, 'pageSize' | 'pageNumber'>> & Omit<PaymentAttemptsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<PaymentAttempt>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/paymentattempt/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch paymentAttempts');
  }
};

export const getPaymentAttempt = async (id?: string): Promise<PaymentAttempt> => {
  try {
    const url = `${BASE_URL}api/paymentattempt/getPaymentAttemptById/${id}`;
    const response = await axios.get(url);
    return response.data as PaymentAttempt;
  } catch (error) {
    handleApiError(error, 'get paymentAttempt');
    throw error;
  }
};

export const createPaymentAttempt = async (PaymentAttempt?: PaymentAttempt): Promise<PaymentAttempt> => {
  try {
    const url = `${BASE_URL}api/paymentattempt/createPaymentAttempt`;
    const response = await axios.post(url, PaymentAttempt);
    return response.data as PaymentAttempt;
  } catch (error) {
    handleApiError(error, 'create paymentAttempt');
    throw error;
  }
};

export const updatePaymentAttempt = async (paymentAttempt?: PaymentAttempt): Promise<PaymentAttempt> => {
  try {
    const id = ((paymentAttempt as any)?.paymentAttemptID ?? '').toString();
    const url = `${BASE_URL}api/paymentattempt/updatePaymentAttempt/${id}`;
    const response = await axios.put(url, paymentAttempt);
    return response.data as PaymentAttempt;
  } catch (error) {
    handleApiError(error, 'update paymentAttempt');
    throw error;
  }
};

export const deletePaymentAttempt = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/paymentattempt/deletePaymentAttempt/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete paymentAttempt');
  }
};

export const firePaymentAttemptAction = async (id?: string, status?: string): Promise<PaymentAttempt> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/paymentattempt/updatePaymentAttemptStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/paymentattempt/updatepaymentattemptstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/PAYMENTATTEMPT/UpdatePaymentAttemptStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as PaymentAttempt;
  } catch (error) {
    handleApiError(error, 'fire paymentAttempt action');
    throw error;
  }
};

