{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { ListingAmenity } from "../types/ListingAmenity";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type ListingAmenitiesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getListingAmenities = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: ListingAmenitiesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchListingAmenities',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchListingAmenities({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchListingAmenities = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<ListingAmenitiesListParams, 'pageSize' | 'pageNumber'>> & Omit<ListingAmenitiesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<ListingAmenity>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/listingamenity/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch listingAmenities');
  }
};

export const getListingAmenity = async (id?: string): Promise<ListingAmenity> => {
  try {
    const url = `${BASE_URL}api/listingamenity/getListingAmenityById/${id}`;
    const response = await axios.get(url);
    return response.data as ListingAmenity;
  } catch (error) {
    handleApiError(error, 'get listingAmenity');
    throw error;
  }
};

export const createListingAmenity = async (ListingAmenity?: ListingAmenity): Promise<ListingAmenity> => {
  try {
    const url = `${BASE_URL}api/listingamenity/createListingAmenity`;
    const response = await axios.post(url, ListingAmenity);
    return response.data as ListingAmenity;
  } catch (error) {
    handleApiError(error, 'create listingAmenity');
    throw error;
  }
};

export const updateListingAmenity = async (listingAmenity?: ListingAmenity): Promise<ListingAmenity> => {
  try {
    const id = ((listingAmenity as any)?.listingAmenityID ?? '').toString();
    const url = `${BASE_URL}api/listingamenity/updateListingAmenity/${id}`;
    const response = await axios.put(url, listingAmenity);
    return response.data as ListingAmenity;
  } catch (error) {
    handleApiError(error, 'update listingAmenity');
    throw error;
  }
};

export const deleteListingAmenity = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/listingamenity/deleteListingAmenity/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete listingAmenity');
  }
};

