{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Payment } from "../types/Payment";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type PaymentsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
};

export const getPayments = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: PaymentsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchPayments',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchPayments({ pageSize, pageNumber, searchQuery,
      statusFilter,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchPayments = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: Required<Pick<PaymentsListParams, 'pageSize' | 'pageNumber'>> & Omit<PaymentsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Payment>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/payment/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch payments');
  }
};

export const getPayment = async (id?: string): Promise<Payment> => {
  try {
    const url = `${BASE_URL}api/payment/getPaymentById/${id}`;
    const response = await axios.get(url);
    return response.data as Payment;
  } catch (error) {
    handleApiError(error, 'get payment');
    throw error;
  }
};

export const createPayment = async (Payment?: Payment): Promise<Payment> => {
  try {
    const url = `${BASE_URL}api/payment/createPayment`;
    const response = await axios.post(url, Payment);
    return response.data as Payment;
  } catch (error) {
    handleApiError(error, 'create payment');
    throw error;
  }
};

export const updatePayment = async (payment?: Payment): Promise<Payment> => {
  try {
    const id = ((payment as any)?.paymentID ?? '').toString();
    const url = `${BASE_URL}api/payment/updatePayment/${id}`;
    const response = await axios.put(url, payment);
    return response.data as Payment;
  } catch (error) {
    handleApiError(error, 'update payment');
    throw error;
  }
};

export const deletePayment = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/payment/deletePayment/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete payment');
  }
};

export const firePaymentAction = async (id?: string, status?: string): Promise<Payment> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/payment/updatePaymentStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/payment/updatepaymentstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/PAYMENT/UpdatePaymentStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as Payment;
  } catch (error) {
    handleApiError(error, 'fire payment action');
    throw error;
  }
};

