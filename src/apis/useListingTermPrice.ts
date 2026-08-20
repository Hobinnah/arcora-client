{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { ListingTermPrice } from "../types/ListingTermPrice";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type ListingTermPricesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  isActive?: string;
  leaseTermMonths?: string;
};

export const getListingTermPrices = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  isActive,
  leaseTermMonths,
  sortBy,
  sortDirection
}: ListingTermPricesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchListingTermPrices',
      { pageSize, pageNumber, searchQuery,
        isActive,
        leaseTermMonths,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchListingTermPrices({ pageSize, pageNumber, searchQuery,
      isActive,
      leaseTermMonths,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchListingTermPrices = async ({
  pageSize,
  pageNumber,
  searchQuery,
  isActive,
  leaseTermMonths,
  sortBy,
  sortDirection
}: Required<Pick<ListingTermPricesListParams, 'pageSize' | 'pageNumber'>> & Omit<ListingTermPricesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<ListingTermPrice>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/listingtermprice/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (isActive) { url += `&isActive=${encodeURIComponent(isActive)}`; }
    if (leaseTermMonths) { url += `&leaseTermMonths=${encodeURIComponent(leaseTermMonths)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch listingTermPrices');
  }
};

export const getListingTermPrice = async (id?: string): Promise<ListingTermPrice> => {
  try {
    const url = `${BASE_URL}api/listingtermprice/getListingTermPriceById/${id}`;
    const response = await axios.get(url);
    return response.data as ListingTermPrice;
  } catch (error) {
    handleApiError(error, 'get listingTermPrice');
    throw error;
  }
};

export const createListingTermPrice = async (ListingTermPrice?: ListingTermPrice): Promise<ListingTermPrice> => {
  try {
    const url = `${BASE_URL}api/listingtermprice/createListingTermPrice`;
    const response = await axios.post(url, ListingTermPrice);
    return response.data as ListingTermPrice;
  } catch (error) {
    handleApiError(error, 'create listingTermPrice');
    throw error;
  }
};

export const updateListingTermPrice = async (listingTermPrice?: ListingTermPrice): Promise<ListingTermPrice> => {
  try {
    const id = ((listingTermPrice as any)?.listingTermPriceID ?? '').toString();
    const url = `${BASE_URL}api/listingtermprice/updateListingTermPrice/${id}`;
    const response = await axios.put(url, listingTermPrice);
    return response.data as ListingTermPrice;
  } catch (error) {
    handleApiError(error, 'update listingTermPrice');
    throw error;
  }
};

export const deleteListingTermPrice = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/listingtermprice/deleteListingTermPrice/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete listingTermPrice');
  }
};

