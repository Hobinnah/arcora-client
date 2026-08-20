{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Fee } from "../types/Fee";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type FeesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  isActive?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
};

export const getFees = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  isActive,
  effectiveFrom,
  effectiveTo,
  sortBy,
  sortDirection
}: FeesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchFees',
      { pageSize, pageNumber, searchQuery,
        isActive,
        effectiveFrom,
        effectiveTo,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchFees({ pageSize, pageNumber, searchQuery,
      isActive,
      effectiveFrom,
      effectiveTo,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchFees = async ({
  pageSize,
  pageNumber,
  searchQuery,
  isActive,
  effectiveFrom,
  effectiveTo,
  sortBy,
  sortDirection
}: Required<Pick<FeesListParams, 'pageSize' | 'pageNumber'>> & Omit<FeesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Fee>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/fee/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (isActive) { url += `&isActive=${encodeURIComponent(isActive)}`; }
    if (effectiveFrom) { url += `&effectiveFrom=${encodeURIComponent(effectiveFrom)}`; }
    if (effectiveTo) { url += `&effectiveTo=${encodeURIComponent(effectiveTo)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch fees');
  }
};

export const getFee = async (id?: string): Promise<Fee> => {
  try {
    const url = `${BASE_URL}api/fee/getFeeById/${id}`;
    const response = await axios.get(url);
    return response.data as Fee;
  } catch (error) {
    handleApiError(error, 'get fee');
    throw error;
  }
};

export const createFee = async (Fee?: Fee): Promise<Fee> => {
  try {
    const url = `${BASE_URL}api/fee/createFee`;
    const response = await axios.post(url, Fee);
    return response.data as Fee;
  } catch (error) {
    handleApiError(error, 'create fee');
    throw error;
  }
};

export const updateFee = async (fee?: Fee): Promise<Fee> => {
  try {
    const id = ((fee as any)?.feeID ?? '').toString();
    const url = `${BASE_URL}api/fee/updateFee/${id}`;
    const response = await axios.put(url, fee);
    return response.data as Fee;
  } catch (error) {
    handleApiError(error, 'update fee');
    throw error;
  }
};

export const deleteFee = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/fee/deleteFee/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete fee');
  }
};

