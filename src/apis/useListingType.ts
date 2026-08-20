{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { ListingType } from "../types/ListingType";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type ListingTypesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getListingTypes = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: ListingTypesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchListingTypes',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchListingTypes({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchListingTypes = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<ListingTypesListParams, 'pageSize' | 'pageNumber'>> & Omit<ListingTypesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<ListingType>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/listingtype/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch listingTypes');
  }
};

export const getListingType = async (id?: string): Promise<ListingType> => {
  try {
    const url = `${BASE_URL}api/listingtype/getListingTypeById/${id}`;
    const response = await axios.get(url);
    return response.data as ListingType;
  } catch (error) {
    handleApiError(error, 'get listingType');
    throw error;
  }
};

export const createListingType = async (ListingType?: ListingType): Promise<ListingType> => {
  try {
    const url = `${BASE_URL}api/listingtype/createListingType`;
    const response = await axios.post(url, ListingType);
    return response.data as ListingType;
  } catch (error) {
    handleApiError(error, 'create listingType');
    throw error;
  }
};

export const updateListingType = async (listingType?: ListingType): Promise<ListingType> => {
  try {
    const id = ((listingType as any)?.listingTypeID ?? '').toString();
    const url = `${BASE_URL}api/listingtype/updateListingType/${id}`;
    const response = await axios.put(url, listingType);
    return response.data as ListingType;
  } catch (error) {
    handleApiError(error, 'update listingType');
    throw error;
  }
};

export const deleteListingType = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/listingtype/deleteListingType/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete listingType');
  }
};

