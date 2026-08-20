{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { PaymentReminder } from "../types/PaymentReminder";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type PaymentRemindersListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  channel?: string;
};

export const getPaymentReminders = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  channel,
  sortBy,
  sortDirection
}: PaymentRemindersListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchPaymentReminders',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        channel,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchPaymentReminders({ pageSize, pageNumber, searchQuery,
      statusFilter,
      channel,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchPaymentReminders = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  channel,
  sortBy,
  sortDirection
}: Required<Pick<PaymentRemindersListParams, 'pageSize' | 'pageNumber'>> & Omit<PaymentRemindersListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<PaymentReminder>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/paymentreminder/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (channel) { url += `&channel=${encodeURIComponent(channel)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch paymentReminders');
  }
};

export const getPaymentReminder = async (id?: string): Promise<PaymentReminder> => {
  try {
    const url = `${BASE_URL}api/paymentreminder/getPaymentReminderById/${id}`;
    const response = await axios.get(url);
    return response.data as PaymentReminder;
  } catch (error) {
    handleApiError(error, 'get paymentReminder');
    throw error;
  }
};

export const createPaymentReminder = async (PaymentReminder?: PaymentReminder): Promise<PaymentReminder> => {
  try {
    const url = `${BASE_URL}api/paymentreminder/createPaymentReminder`;
    const response = await axios.post(url, PaymentReminder);
    return response.data as PaymentReminder;
  } catch (error) {
    handleApiError(error, 'create paymentReminder');
    throw error;
  }
};

export const updatePaymentReminder = async (paymentReminder?: PaymentReminder): Promise<PaymentReminder> => {
  try {
    const id = ((paymentReminder as any)?.paymentReminderID ?? '').toString();
    const url = `${BASE_URL}api/paymentreminder/updatePaymentReminder/${id}`;
    const response = await axios.put(url, paymentReminder);
    return response.data as PaymentReminder;
  } catch (error) {
    handleApiError(error, 'update paymentReminder');
    throw error;
  }
};

export const deletePaymentReminder = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/paymentreminder/deletePaymentReminder/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete paymentReminder');
  }
};

export const firePaymentReminderAction = async (id?: string, status?: string): Promise<PaymentReminder> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/paymentreminder/updatePaymentReminderStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/paymentreminder/updatepaymentreminderstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/PAYMENTREMINDER/UpdatePaymentReminderStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as PaymentReminder;
  } catch (error) {
    handleApiError(error, 'fire paymentReminder action');
    throw error;
  }
};

