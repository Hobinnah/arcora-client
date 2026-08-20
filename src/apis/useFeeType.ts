{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { FeeType } from "../types/FeeType";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type FeeTypesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getFeeTypes = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: FeeTypesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchFeeTypes',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchFeeTypes({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchFeeTypes = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<FeeTypesListParams, 'pageSize' | 'pageNumber'>> & Omit<FeeTypesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<FeeType>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/feetype/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch feeTypes');
  }
};

export const getFeeType = async (id?: string): Promise<FeeType> => {
  try {
    const url = `${BASE_URL}api/feetype/getFeeTypeById/${id}`;
    const response = await axios.get(url);
    return response.data as FeeType;
  } catch (error) {
    handleApiError(error, 'get feeType');
    throw error;
  }
};

export const createFeeType = async (FeeType?: FeeType): Promise<FeeType> => {
  try {
    const url = `${BASE_URL}api/feetype/createFeeType`;
    const response = await axios.post(url, FeeType);
    return response.data as FeeType;
  } catch (error) {
    handleApiError(error, 'create feeType');
    throw error;
  }
};

export const updateFeeType = async (feeType?: FeeType): Promise<FeeType> => {
  try {
    const id = ((feeType as any)?.feeTypeID ?? '').toString();
    const url = `${BASE_URL}api/feetype/updateFeeType/${id}`;
    const response = await axios.put(url, feeType);
    return response.data as FeeType;
  } catch (error) {
    handleApiError(error, 'update feeType');
    throw error;
  }
};

export const deleteFeeType = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/feetype/deleteFeeType/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete feeType');
  }
};

