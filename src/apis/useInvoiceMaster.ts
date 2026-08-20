{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { InvoiceMaster } from "../types/InvoiceMaster";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type InvoiceMastersListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  dueDate?: string;
  billingPeriodStart?: string;
  billingPeriodEnd?: string;
};

export const getInvoiceMasters = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  dueDate,
  billingPeriodStart,
  billingPeriodEnd,
  sortBy,
  sortDirection
}: InvoiceMastersListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchInvoiceMasters',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        dueDate,
        billingPeriodStart,
        billingPeriodEnd,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchInvoiceMasters({ pageSize, pageNumber, searchQuery,
      statusFilter,
      dueDate,
      billingPeriodStart,
      billingPeriodEnd,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchInvoiceMasters = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  dueDate,
  billingPeriodStart,
  billingPeriodEnd,
  sortBy,
  sortDirection
}: Required<Pick<InvoiceMastersListParams, 'pageSize' | 'pageNumber'>> & Omit<InvoiceMastersListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<InvoiceMaster>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/invoicemaster/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (dueDate) { url += `&dueDate=${encodeURIComponent(dueDate)}`; }
    if (billingPeriodStart) { url += `&billingPeriodStart=${encodeURIComponent(billingPeriodStart)}`; }
    if (billingPeriodEnd) { url += `&billingPeriodEnd=${encodeURIComponent(billingPeriodEnd)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch invoiceMasters');
  }
};

export const getInvoiceMaster = async (id?: string): Promise<InvoiceMaster> => {
  try {
    const url = `${BASE_URL}api/invoicemaster/getInvoiceMasterById/${id}`;
    const response = await axios.get(url);
    return response.data as InvoiceMaster;
  } catch (error) {
    handleApiError(error, 'get invoiceMaster');
    throw error;
  }
};

export const createInvoiceMaster = async (InvoiceMaster?: InvoiceMaster): Promise<InvoiceMaster> => {
  try {
    const url = `${BASE_URL}api/invoicemaster/createInvoiceMaster`;
    const response = await axios.post(url, InvoiceMaster);
    return response.data as InvoiceMaster;
  } catch (error) {
    handleApiError(error, 'create invoiceMaster');
    throw error;
  }
};

export const updateInvoiceMaster = async (invoiceMaster?: InvoiceMaster): Promise<InvoiceMaster> => {
  try {
    const id = ((invoiceMaster as any)?.invoiceMasterID ?? '').toString();
    const url = `${BASE_URL}api/invoicemaster/updateInvoiceMaster/${id}`;
    const response = await axios.put(url, invoiceMaster);
    return response.data as InvoiceMaster;
  } catch (error) {
    handleApiError(error, 'update invoiceMaster');
    throw error;
  }
};

export const deleteInvoiceMaster = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/invoicemaster/deleteInvoiceMaster/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete invoiceMaster');
  }
};

export const fireInvoiceMasterAction = async (id?: string, status?: string): Promise<InvoiceMaster> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/invoicemaster/updateInvoiceMasterStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/invoicemaster/updateinvoicemasterstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/INVOICEMASTER/UpdateInvoiceMasterStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as InvoiceMaster;
  } catch (error) {
    handleApiError(error, 'fire invoiceMaster action');
    throw error;
  }
};

