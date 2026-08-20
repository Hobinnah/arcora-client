{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Listing } from "../types/Listing";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type ListingsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  availableFrom?: string;
  availableTo?: string;
};

export const getListings = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  availableFrom,
  availableTo,
  sortBy,
  sortDirection
}: ListingsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchListings',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        availableFrom,
        availableTo,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchListings({ pageSize, pageNumber, searchQuery,
      statusFilter,
      availableFrom,
      availableTo,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchListings = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  availableFrom,
  availableTo,
  sortBy,
  sortDirection
}: Required<Pick<ListingsListParams, 'pageSize' | 'pageNumber'>> & Omit<ListingsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Listing>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/listing/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (availableFrom) { url += `&availableFrom=${encodeURIComponent(availableFrom)}`; }
    if (availableTo) { url += `&availableTo=${encodeURIComponent(availableTo)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch listings');
  }
};

export const getListing = async (id?: string): Promise<Listing> => {
  try {
    const url = `${BASE_URL}api/listing/getListingById/${id}`;
    const response = await axios.get(url);
    return response.data as Listing;
  } catch (error) {
    handleApiError(error, 'get listing');
    throw error;
  }
};

export const createListing = async (Listing?: Listing): Promise<Listing> => {
  try {
    const url = `${BASE_URL}api/listing/createListing`;
    const response = await axios.post(url, Listing);
    return response.data as Listing;
  } catch (error) {
    handleApiError(error, 'create listing');
    throw error;
  }
};

export const updateListing = async (listing?: Listing): Promise<Listing> => {
  try {
    const id = ((listing as any)?.listingID ?? '').toString();
    const url = `${BASE_URL}api/listing/updateListing/${id}`;
    const response = await axios.put(url, listing);
    return response.data as Listing;
  } catch (error) {
    handleApiError(error, 'update listing');
    throw error;
  }
};

export const deleteListing = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/listing/deleteListing/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete listing');
  }
};

export const fireListingAction = async (id?: string, status?: string): Promise<Listing> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/listing/updateListingStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/listing/updatelistingstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/LISTING/UpdateListingStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as Listing;
  } catch (error) {
    handleApiError(error, 'fire listing action');
    throw error;
  }
};

