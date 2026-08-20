{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { ListingRule } from "../types/ListingRule";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type ListingRulesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getListingRules = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: ListingRulesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchListingRules',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchListingRules({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchListingRules = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<ListingRulesListParams, 'pageSize' | 'pageNumber'>> & Omit<ListingRulesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<ListingRule>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/listingrule/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch listingRules');
  }
};

export const getListingRule = async (id?: string): Promise<ListingRule> => {
  try {
    const url = `${BASE_URL}api/listingrule/getListingRuleById/${id}`;
    const response = await axios.get(url);
    return response.data as ListingRule;
  } catch (error) {
    handleApiError(error, 'get listingRule');
    throw error;
  }
};

export const createListingRule = async (ListingRule?: ListingRule): Promise<ListingRule> => {
  try {
    const url = `${BASE_URL}api/listingrule/createListingRule`;
    const response = await axios.post(url, ListingRule);
    return response.data as ListingRule;
  } catch (error) {
    handleApiError(error, 'create listingRule');
    throw error;
  }
};

export const updateListingRule = async (listingRule?: ListingRule): Promise<ListingRule> => {
  try {
    const id = ((listingRule as any)?.listingRuleID ?? '').toString();
    const url = `${BASE_URL}api/listingrule/updateListingRule/${id}`;
    const response = await axios.put(url, listingRule);
    return response.data as ListingRule;
  } catch (error) {
    handleApiError(error, 'update listingRule');
    throw error;
  }
};

export const deleteListingRule = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/listingrule/deleteListingRule/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete listingRule');
  }
};

