{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { InvoiceDetail } from "../types/InvoiceDetail";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type InvoiceDetailsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getInvoiceDetails = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: InvoiceDetailsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchInvoiceDetails',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchInvoiceDetails({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchInvoiceDetails = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<InvoiceDetailsListParams, 'pageSize' | 'pageNumber'>> & Omit<InvoiceDetailsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<InvoiceDetail>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/invoicedetail/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch invoiceDetails');
  }
};

export const getInvoiceDetail = async (id?: string): Promise<InvoiceDetail> => {
  try {
    const url = `${BASE_URL}api/invoicedetail/getInvoiceDetailById/${id}`;
    const response = await axios.get(url);
    return response.data as InvoiceDetail;
  } catch (error) {
    handleApiError(error, 'get invoiceDetail');
    throw error;
  }
};

export const createInvoiceDetail = async (InvoiceDetail?: InvoiceDetail): Promise<InvoiceDetail> => {
  try {
    const url = `${BASE_URL}api/invoicedetail/createInvoiceDetail`;
    const response = await axios.post(url, InvoiceDetail);
    return response.data as InvoiceDetail;
  } catch (error) {
    handleApiError(error, 'create invoiceDetail');
    throw error;
  }
};

export const updateInvoiceDetail = async (invoiceDetail?: InvoiceDetail): Promise<InvoiceDetail> => {
  try {
    const id = ((invoiceDetail as any)?.invoiceDetailID ?? '').toString();
    const url = `${BASE_URL}api/invoicedetail/updateInvoiceDetail/${id}`;
    const response = await axios.put(url, invoiceDetail);
    return response.data as InvoiceDetail;
  } catch (error) {
    handleApiError(error, 'update invoiceDetail');
    throw error;
  }
};

export const deleteInvoiceDetail = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/invoicedetail/deleteInvoiceDetail/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete invoiceDetail');
  }
};

