{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { TenancyType } from "../types/TenancyType";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type TenancyTypesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  isActive?: string;
};

export const getTenancyTypes = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  isActive,
  sortBy,
  sortDirection
}: TenancyTypesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchTenancyTypes',
      { pageSize, pageNumber, searchQuery,
        isActive,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchTenancyTypes({ pageSize, pageNumber, searchQuery,
      isActive,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchTenancyTypes = async ({
  pageSize,
  pageNumber,
  searchQuery,
  isActive,
  sortBy,
  sortDirection
}: Required<Pick<TenancyTypesListParams, 'pageSize' | 'pageNumber'>> & Omit<TenancyTypesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<TenancyType>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/tenancytype/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (isActive) { url += `&isActive=${encodeURIComponent(isActive)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch tenancyTypes');
  }
};

export const getTenancyType = async (id?: string): Promise<TenancyType> => {
  try {
    const url = `${BASE_URL}api/tenancytype/getTenancyTypeById/${id}`;
    const response = await axios.get(url);
    return response.data as TenancyType;
  } catch (error) {
    handleApiError(error, 'get tenancyType');
    throw error;
  }
};

export const createTenancyType = async (TenancyType?: TenancyType): Promise<TenancyType> => {
  try {
    const url = `${BASE_URL}api/tenancytype/createTenancyType`;
    const response = await axios.post(url, TenancyType);
    return response.data as TenancyType;
  } catch (error) {
    handleApiError(error, 'create tenancyType');
    throw error;
  }
};

export const updateTenancyType = async (tenancyType?: TenancyType): Promise<TenancyType> => {
  try {
    const id = ((tenancyType as any)?.tenancyTypeID ?? '').toString();
    const url = `${BASE_URL}api/tenancytype/updateTenancyType/${id}`;
    const response = await axios.put(url, tenancyType);
    return response.data as TenancyType;
  } catch (error) {
    handleApiError(error, 'update tenancyType');
    throw error;
  }
};

export const deleteTenancyType = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/tenancytype/deleteTenancyType/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete tenancyType');
  }
};

