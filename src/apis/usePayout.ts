{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Payout } from "../types/Payout";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type PayoutsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  requestedAt?: string;
  organizationID?: string;
  from?: string;
  to?: string;
};

export const getPayouts = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  requestedAt,
  organizationID,
  from,
  to,
  sortBy,
  sortDirection
}: PayoutsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchPayouts',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        requestedAt,
        organizationID,
        from,
        to,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchPayouts({ pageSize, pageNumber, searchQuery,
      statusFilter,
      requestedAt,
      organizationID,
      from,
      to,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchPayouts = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  requestedAt,
  organizationID,
  from,
  to,
  sortBy,
  sortDirection
}: Required<Pick<PayoutsListParams, 'pageSize' | 'pageNumber'>> & Omit<PayoutsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Payout>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/payout/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (requestedAt) { url += `&requestedAt=${encodeURIComponent(requestedAt)}`; }
    if (organizationID) { url += `&organizationID=${encodeURIComponent(organizationID)}`; }
    if (from) { url += `&from=${encodeURIComponent(from)}`; }
    if (to) { url += `&to=${encodeURIComponent(to)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch payouts');
  }
};

export const getPayout = async (id?: string): Promise<Payout> => {
  try {
    const url = `${BASE_URL}api/payout/getPayoutById/${id}`;
    const response = await axios.get(url);
    return response.data as Payout;
  } catch (error) {
    handleApiError(error, 'get payout');
    throw error;
  }
};

export const createPayout = async (Payout?: Payout): Promise<Payout> => {
  try {
    const url = `${BASE_URL}api/payout/createPayout`;
    const response = await axios.post(url, Payout);
    return response.data as Payout;
  } catch (error) {
    handleApiError(error, 'create payout');
    throw error;
  }
};

export const updatePayout = async (payout?: Payout): Promise<Payout> => {
  try {
    const id = ((payout as any)?.payoutID ?? '').toString();
    const url = `${BASE_URL}api/payout/updatePayout/${id}`;
    const response = await axios.put(url, payout);
    return response.data as Payout;
  } catch (error) {
    handleApiError(error, 'update payout');
    throw error;
  }
};

export const deletePayout = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/payout/deletePayout/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete payout');
  }
};

export const firePayoutAction = async (id?: string, status?: string): Promise<Payout> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/payout/updatePayoutStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/payout/updatepayoutstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/PAYOUT/UpdatePayoutStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as Payout;
  } catch (error) {
    handleApiError(error, 'fire payout action');
    throw error;
  }
};

