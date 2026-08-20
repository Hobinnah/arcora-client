{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { PayoutItem } from "../types/PayoutItem";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type PayoutItemsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getPayoutItems = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: PayoutItemsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchPayoutItems',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchPayoutItems({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchPayoutItems = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<PayoutItemsListParams, 'pageSize' | 'pageNumber'>> & Omit<PayoutItemsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<PayoutItem>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/payoutitem/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch payoutItems');
  }
};

export const getPayoutItem = async (id?: string): Promise<PayoutItem> => {
  try {
    const url = `${BASE_URL}api/payoutitem/getPayoutItemById/${id}`;
    const response = await axios.get(url);
    return response.data as PayoutItem;
  } catch (error) {
    handleApiError(error, 'get payoutItem');
    throw error;
  }
};

export const createPayoutItem = async (PayoutItem?: PayoutItem): Promise<PayoutItem> => {
  try {
    const url = `${BASE_URL}api/payoutitem/createPayoutItem`;
    const response = await axios.post(url, PayoutItem);
    return response.data as PayoutItem;
  } catch (error) {
    handleApiError(error, 'create payoutItem');
    throw error;
  }
};

export const updatePayoutItem = async (payoutItem?: PayoutItem): Promise<PayoutItem> => {
  try {
    const id = ((payoutItem as any)?.payoutItemID ?? '').toString();
    const url = `${BASE_URL}api/payoutitem/updatePayoutItem/${id}`;
    const response = await axios.put(url, payoutItem);
    return response.data as PayoutItem;
  } catch (error) {
    handleApiError(error, 'update payoutItem');
    throw error;
  }
};

export const deletePayoutItem = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/payoutitem/deletePayoutItem/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete payoutItem');
  }
};

