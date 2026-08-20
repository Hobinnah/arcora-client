{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Address } from "../types/Address";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type AddressesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  city?: string;
  countryCode?: string;
};

export const getAddresses = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  city,
  countryCode,
  sortBy,
  sortDirection
}: AddressesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchAddresses',
      { pageSize, pageNumber, searchQuery,
        city,
        countryCode,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchAddresses({ pageSize, pageNumber, searchQuery,
      city,
      countryCode,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchAddresses = async ({
  pageSize,
  pageNumber,
  searchQuery,
  city,
  countryCode,
  sortBy,
  sortDirection
}: Required<Pick<AddressesListParams, 'pageSize' | 'pageNumber'>> & Omit<AddressesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Address>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/address/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (city) { url += `&city=${encodeURIComponent(city)}`; }
    if (countryCode) { url += `&countryCode=${encodeURIComponent(countryCode)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch addresses');
  }
};

export const getAddress = async (id?: string): Promise<Address> => {
  try {
    const url = `${BASE_URL}api/address/getAddressById/${id}`;
    const response = await axios.get(url);
    return response.data as Address;
  } catch (error) {
    handleApiError(error, 'get address');
    throw error;
  }
};

export const createAddress = async (Address?: Address): Promise<Address> => {
  try {
    const url = `${BASE_URL}api/address/createAddress`;
    const response = await axios.post(url, Address);
    return response.data as Address;
  } catch (error) {
    handleApiError(error, 'create address');
    throw error;
  }
};

export const updateAddress = async (address?: Address): Promise<Address> => {
  try {
    const id = ((address as any)?.addressID ?? '').toString();
    const url = `${BASE_URL}api/address/updateAddress/${id}`;
    const response = await axios.put(url, address);
    return response.data as Address;
  } catch (error) {
    handleApiError(error, 'update address');
    throw error;
  }
};

export const deleteAddress = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/address/deleteAddress/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete address');
  }
};

