{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { ListingPolicy } from "../types/ListingPolicy";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type ListingPoliciesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getListingPolicies = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: ListingPoliciesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchListingPolicies',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchListingPolicies({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchListingPolicies = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<ListingPoliciesListParams, 'pageSize' | 'pageNumber'>> & Omit<ListingPoliciesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<ListingPolicy>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/listingpolicy/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch listingPolicies');
  }
};

export const getListingPolicy = async (id?: string): Promise<ListingPolicy> => {
  try {
    const url = `${BASE_URL}api/listingpolicy/getListingPolicyById/${id}`;
    const response = await axios.get(url);
    return response.data as ListingPolicy;
  } catch (error) {
    handleApiError(error, 'get listingPolicy');
    throw error;
  }
};

export const createListingPolicy = async (ListingPolicy?: ListingPolicy): Promise<ListingPolicy> => {
  try {
    const url = `${BASE_URL}api/listingpolicy/createListingPolicy`;
    const response = await axios.post(url, ListingPolicy);
    return response.data as ListingPolicy;
  } catch (error) {
    handleApiError(error, 'create listingPolicy');
    throw error;
  }
};

export const updateListingPolicy = async (listingPolicy?: ListingPolicy): Promise<ListingPolicy> => {
  try {
    const id = ((listingPolicy as any)?.listingPolicyID ?? '').toString();
    const url = `${BASE_URL}api/listingpolicy/updateListingPolicy/${id}`;
    const response = await axios.put(url, listingPolicy);
    return response.data as ListingPolicy;
  } catch (error) {
    handleApiError(error, 'update listingPolicy');
    throw error;
  }
};

export const deleteListingPolicy = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/listingpolicy/deleteListingPolicy/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete listingPolicy');
  }
};

