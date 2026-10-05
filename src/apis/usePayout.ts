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
  period?: EarningsPeriod;
};

export type EarningsPeriod = 'This month' | 'Last 3 months' | 'Year to date';
export type EarningsSummary = {
  organizationID: string;
  period: EarningsPeriod;
  periodStart: string;
  periodEnd: string;
  rentCollected: number;
  serviceFees: number;
  pastDue: number;
  netEarnings: number;
};
export type ListingEarningsBreakdown = {
  listingID: string;
  listingName: string;
  rentCollected: number;
  serviceFees: number;
  netEarnings: number;
};
export type EarningsTransaction = {
  transactionDate: string;
  transactionType: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  referenceNumber: string;
  payoutID: number | null;
  paymentID: number | null;
  invoiceMasterID: number | null;
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
  period,
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
        period,
        to,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchPayouts({ pageSize, pageNumber, searchQuery,
      statusFilter,
      requestedAt,
      organizationID,
      from,
      period,
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
  period,
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
    if (period) { url += `&period=${encodeURIComponent(period)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch payouts');
  }
};

export const getEarningsSummary = async (organizationID: string, period?: EarningsPeriod): Promise<EarningsSummary> => {
  try {
    const params = period ? `?period=${encodeURIComponent(period)}` : '';
    const response = await axios.get(`${BASE_URL}api/payout/getEarningsSummary/${organizationID}${params}`);
    return response.data as EarningsSummary;
  } catch (error) {
    handleApiError(error, 'get earnings summary');
    throw error;
  }
};

export const getListingBreakdown = async (organizationID: string, period?: EarningsPeriod): Promise<ListingEarningsBreakdown[]> => {
  try {
    const params = period ? `?period=${encodeURIComponent(period)}` : '';
    const response = await axios.get(`${BASE_URL}api/payout/getListingBreakdown/${organizationID}${params}`);
    return (Array.isArray(response.data) ? response.data : response.data?.data) ?? [];
  } catch (error) {
    handleApiError(error, 'get listing earnings breakdown');
    throw error;
  }
};

export const exportEarningsStatement = async (organizationID: string, period?: EarningsPeriod, format: 'json' | 'csv' = 'json'): Promise<EarningsTransaction[] | Blob> => {
  try {
    const params = new URLSearchParams({ format });
    if (period) params.set('period', period);
    const response = await axios.get(`${BASE_URL}api/payout/exportStatement/${organizationID}?${params.toString()}`, {
      responseType: format === 'csv' ? 'blob' : 'json',
    });
    return format === 'csv' ? response.data as Blob : ((Array.isArray(response.data) ? response.data : response.data?.data) ?? []) as EarningsTransaction[];
  } catch (error) {
    handleApiError(error, 'export earnings statement');
    throw error;
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

