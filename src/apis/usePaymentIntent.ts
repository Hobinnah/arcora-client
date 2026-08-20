{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { PaymentIntent } from "../types/PaymentIntent";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type PaymentIntentsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
};

export const getPaymentIntents = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: PaymentIntentsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchPaymentIntents',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchPaymentIntents({ pageSize, pageNumber, searchQuery,
      statusFilter,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchPaymentIntents = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: Required<Pick<PaymentIntentsListParams, 'pageSize' | 'pageNumber'>> & Omit<PaymentIntentsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<PaymentIntent>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/paymentintent/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch paymentIntents');
  }
};

export const getPaymentIntent = async (id?: string): Promise<PaymentIntent> => {
  try {
    const url = `${BASE_URL}api/paymentintent/getPaymentIntentById/${id}`;
    const response = await axios.get(url);
    return response.data as PaymentIntent;
  } catch (error) {
    handleApiError(error, 'get paymentIntent');
    throw error;
  }
};

export const createPaymentIntent = async (PaymentIntent?: PaymentIntent): Promise<PaymentIntent> => {
  try {
    const url = `${BASE_URL}api/paymentintent/createPaymentIntent`;
    const response = await axios.post(url, PaymentIntent);
    return response.data as PaymentIntent;
  } catch (error) {
    handleApiError(error, 'create paymentIntent');
    throw error;
  }
};

export const updatePaymentIntent = async (paymentIntent?: PaymentIntent): Promise<PaymentIntent> => {
  try {
    const id = ((paymentIntent as any)?.paymentIntentID ?? '').toString();
    const url = `${BASE_URL}api/paymentintent/updatePaymentIntent/${id}`;
    const response = await axios.put(url, paymentIntent);
    return response.data as PaymentIntent;
  } catch (error) {
    handleApiError(error, 'update paymentIntent');
    throw error;
  }
};

export const deletePaymentIntent = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/paymentintent/deletePaymentIntent/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete paymentIntent');
  }
};

export const firePaymentIntentAction = async (id?: string, status?: string): Promise<PaymentIntent> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/paymentintent/updatePaymentIntentStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/paymentintent/updatepaymentintentstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/PAYMENTINTENT/UpdatePaymentIntentStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as PaymentIntent;
  } catch (error) {
    handleApiError(error, 'fire paymentIntent action');
    throw error;
  }
};

