{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { PaymentMethod } from "../types/PaymentMethod";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type PaymentMethodsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  paymentMethodType?: string;
  verificationStatus?: string;
  isActive?: string;
};

export const getPaymentMethods = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  paymentMethodType,
  verificationStatus,
  isActive,
  sortBy,
  sortDirection
}: PaymentMethodsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchPaymentMethods',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        paymentMethodType,
        verificationStatus,
        isActive,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchPaymentMethods({ pageSize, pageNumber, searchQuery,
      statusFilter,
      paymentMethodType,
      verificationStatus,
      isActive,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchPaymentMethods = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  paymentMethodType,
  verificationStatus,
  isActive,
  sortBy,
  sortDirection
}: Required<Pick<PaymentMethodsListParams, 'pageSize' | 'pageNumber'>> & Omit<PaymentMethodsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<PaymentMethod>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/paymentmethod/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (paymentMethodType) { url += `&paymentMethodType=${encodeURIComponent(paymentMethodType)}`; }
    if (verificationStatus) { url += `&verificationStatus=${encodeURIComponent(verificationStatus)}`; }
    if (isActive) { url += `&isActive=${encodeURIComponent(isActive)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch paymentMethods');
  }
};

export const getPaymentMethod = async (id?: string): Promise<PaymentMethod> => {
  try {
    const url = `${BASE_URL}api/paymentmethod/getPaymentMethodById/${id}`;
    const response = await axios.get(url);
    return response.data as PaymentMethod;
  } catch (error) {
    handleApiError(error, 'get paymentMethod');
    throw error;
  }
};

export const createPaymentMethod = async (PaymentMethod?: PaymentMethod): Promise<PaymentMethod> => {
  try {
    const url = `${BASE_URL}api/paymentmethod/createPaymentMethod`;
    const response = await axios.post(url, PaymentMethod);
    return response.data as PaymentMethod;
  } catch (error) {
    handleApiError(error, 'create paymentMethod');
    throw error;
  }
};

export const updatePaymentMethod = async (paymentMethod?: PaymentMethod): Promise<PaymentMethod> => {
  try {
    const id = ((paymentMethod as any)?.paymentMethodID ?? '').toString();
    const url = `${BASE_URL}api/paymentmethod/updatePaymentMethod/${id}`;
    const response = await axios.put(url, paymentMethod);
    return response.data as PaymentMethod;
  } catch (error) {
    handleApiError(error, 'update paymentMethod');
    throw error;
  }
};

export const deletePaymentMethod = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/paymentmethod/deletePaymentMethod/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete paymentMethod');
  }
};

export const firePaymentMethodAction = async (id?: string, status?: string): Promise<PaymentMethod> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/paymentmethod/updatePaymentMethodStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/paymentmethod/updatepaymentmethodstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/PAYMENTMETHOD/UpdatePaymentMethodStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as PaymentMethod;
  } catch (error) {
    handleApiError(error, 'fire paymentMethod action');
    throw error;
  }
};

