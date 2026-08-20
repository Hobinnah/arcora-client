{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Refund } from "../types/Refund";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type RefundsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  requestedAt?: string;
};

export const getRefunds = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  requestedAt,
  sortBy,
  sortDirection
}: RefundsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchRefunds',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        requestedAt,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchRefunds({ pageSize, pageNumber, searchQuery,
      statusFilter,
      requestedAt,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchRefunds = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  requestedAt,
  sortBy,
  sortDirection
}: Required<Pick<RefundsListParams, 'pageSize' | 'pageNumber'>> & Omit<RefundsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Refund>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/refund/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (requestedAt) { url += `&requestedAt=${encodeURIComponent(requestedAt)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch refunds');
  }
};

export const getRefund = async (id?: string): Promise<Refund> => {
  try {
    const url = `${BASE_URL}api/refund/getRefundById/${id}`;
    const response = await axios.get(url);
    return response.data as Refund;
  } catch (error) {
    handleApiError(error, 'get refund');
    throw error;
  }
};

export const createRefund = async (Refund?: Refund): Promise<Refund> => {
  try {
    const url = `${BASE_URL}api/refund/createRefund`;
    const response = await axios.post(url, Refund);
    return response.data as Refund;
  } catch (error) {
    handleApiError(error, 'create refund');
    throw error;
  }
};

export const updateRefund = async (refund?: Refund): Promise<Refund> => {
  try {
    const id = ((refund as any)?.refundID ?? '').toString();
    const url = `${BASE_URL}api/refund/updateRefund/${id}`;
    const response = await axios.put(url, refund);
    return response.data as Refund;
  } catch (error) {
    handleApiError(error, 'update refund');
    throw error;
  }
};

export const deleteRefund = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/refund/deleteRefund/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete refund');
  }
};

export const fireRefundAction = async (id?: string, status?: string): Promise<Refund> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/refund/updateRefundStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/refund/updaterefundstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/REFUND/UpdateRefundStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as Refund;
  } catch (error) {
    handleApiError(error, 'fire refund action');
    throw error;
  }
};

