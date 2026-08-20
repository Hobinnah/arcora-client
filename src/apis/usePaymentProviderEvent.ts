{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { PaymentProviderEvent } from "../types/PaymentProviderEvent";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type PaymentProviderEventsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  processingStatus?: string;
};

export const getPaymentProviderEvents = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  processingStatus,
  sortBy,
  sortDirection
}: PaymentProviderEventsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchPaymentProviderEvents',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        processingStatus,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchPaymentProviderEvents({ pageSize, pageNumber, searchQuery,
      statusFilter,
      processingStatus,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchPaymentProviderEvents = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  processingStatus,
  sortBy,
  sortDirection
}: Required<Pick<PaymentProviderEventsListParams, 'pageSize' | 'pageNumber'>> & Omit<PaymentProviderEventsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<PaymentProviderEvent>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/paymentproviderevent/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (processingStatus) { url += `&processingStatus=${encodeURIComponent(processingStatus)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch paymentProviderEvents');
  }
};

export const getPaymentProviderEvent = async (id?: string): Promise<PaymentProviderEvent> => {
  try {
    const url = `${BASE_URL}api/paymentproviderevent/getPaymentProviderEventById/${id}`;
    const response = await axios.get(url);
    return response.data as PaymentProviderEvent;
  } catch (error) {
    handleApiError(error, 'get paymentProviderEvent');
    throw error;
  }
};

export const createPaymentProviderEvent = async (PaymentProviderEvent?: PaymentProviderEvent): Promise<PaymentProviderEvent> => {
  try {
    const url = `${BASE_URL}api/paymentproviderevent/createPaymentProviderEvent`;
    const response = await axios.post(url, PaymentProviderEvent);
    return response.data as PaymentProviderEvent;
  } catch (error) {
    handleApiError(error, 'create paymentProviderEvent');
    throw error;
  }
};

export const updatePaymentProviderEvent = async (paymentProviderEvent?: PaymentProviderEvent): Promise<PaymentProviderEvent> => {
  try {
    const id = ((paymentProviderEvent as any)?.paymentProviderEventID ?? '').toString();
    const url = `${BASE_URL}api/paymentproviderevent/updatePaymentProviderEvent/${id}`;
    const response = await axios.put(url, paymentProviderEvent);
    return response.data as PaymentProviderEvent;
  } catch (error) {
    handleApiError(error, 'update paymentProviderEvent');
    throw error;
  }
};

export const deletePaymentProviderEvent = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/paymentproviderevent/deletePaymentProviderEvent/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete paymentProviderEvent');
  }
};

export const firePaymentProviderEventAction = async (id?: string, status?: string): Promise<PaymentProviderEvent> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/paymentproviderevent/updatePaymentProviderEventStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/paymentproviderevent/updatepaymentprovidereventstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/PAYMENTPROVIDEREVENT/UpdatePaymentProviderEventStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as PaymentProviderEvent;
  } catch (error) {
    handleApiError(error, 'fire paymentProviderEvent action');
    throw error;
  }
};

