{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { TaxRate } from "../types/TaxRate";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type TaxRatesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  isActive?: string;
  countryCode?: string;
  provinceCode?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
};

export const getTaxRates = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  isActive,
  countryCode,
  provinceCode,
  effectiveFrom,
  effectiveTo,
  sortBy,
  sortDirection
}: TaxRatesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchTaxRates',
      { pageSize, pageNumber, searchQuery,
        isActive,
        countryCode,
        provinceCode,
        effectiveFrom,
        effectiveTo,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchTaxRates({ pageSize, pageNumber, searchQuery,
      isActive,
      countryCode,
      provinceCode,
      effectiveFrom,
      effectiveTo,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchTaxRates = async ({
  pageSize,
  pageNumber,
  searchQuery,
  isActive,
  countryCode,
  provinceCode,
  effectiveFrom,
  effectiveTo,
  sortBy,
  sortDirection
}: Required<Pick<TaxRatesListParams, 'pageSize' | 'pageNumber'>> & Omit<TaxRatesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<TaxRate>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/taxrate/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (isActive) { url += `&isActive=${encodeURIComponent(isActive)}`; }
    if (countryCode) { url += `&countryCode=${encodeURIComponent(countryCode)}`; }
    if (provinceCode) { url += `&provinceCode=${encodeURIComponent(provinceCode)}`; }
    if (effectiveFrom) { url += `&effectiveFrom=${encodeURIComponent(effectiveFrom)}`; }
    if (effectiveTo) { url += `&effectiveTo=${encodeURIComponent(effectiveTo)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch taxRates');
  }
};

export const getTaxRate = async (id?: string): Promise<TaxRate> => {
  try {
    const url = `${BASE_URL}api/taxrate/getTaxRateById/${id}`;
    const response = await axios.get(url);
    return response.data as TaxRate;
  } catch (error) {
    handleApiError(error, 'get taxRate');
    throw error;
  }
};

export const createTaxRate = async (TaxRate?: TaxRate): Promise<TaxRate> => {
  try {
    const url = `${BASE_URL}api/taxrate/createTaxRate`;
    const response = await axios.post(url, TaxRate);
    return response.data as TaxRate;
  } catch (error) {
    handleApiError(error, 'create taxRate');
    throw error;
  }
};

export const updateTaxRate = async (taxRate?: TaxRate): Promise<TaxRate> => {
  try {
    const id = ((taxRate as any)?.taxID ?? '').toString();
    const url = `${BASE_URL}api/taxrate/updateTaxRate/${id}`;
    const response = await axios.put(url, taxRate);
    return response.data as TaxRate;
  } catch (error) {
    handleApiError(error, 'update taxRate');
    throw error;
  }
};

export const deleteTaxRate = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/taxrate/deleteTaxRate/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete taxRate');
  }
};

