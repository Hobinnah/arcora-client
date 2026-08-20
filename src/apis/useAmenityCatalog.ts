{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { AmenityCatalog } from "../types/AmenityCatalog";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type AmenityCatalogsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  category?: string;
  isActive?: string;
};

export const getAmenityCatalogs = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  category,
  isActive,
  sortBy,
  sortDirection
}: AmenityCatalogsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchAmenityCatalogs',
      { pageSize, pageNumber, searchQuery,
        category,
        isActive,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchAmenityCatalogs({ pageSize, pageNumber, searchQuery,
      category,
      isActive,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchAmenityCatalogs = async ({
  pageSize,
  pageNumber,
  searchQuery,
  category,
  isActive,
  sortBy,
  sortDirection
}: Required<Pick<AmenityCatalogsListParams, 'pageSize' | 'pageNumber'>> & Omit<AmenityCatalogsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<AmenityCatalog>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/amenitycatalog/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (category) { url += `&category=${encodeURIComponent(category)}`; }
    if (isActive) { url += `&isActive=${encodeURIComponent(isActive)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch amenityCatalogs');
  }
};

export const getAmenityCatalog = async (id?: string): Promise<AmenityCatalog> => {
  try {
    const url = `${BASE_URL}api/amenitycatalog/getAmenityCatalogById/${id}`;
    const response = await axios.get(url);
    return response.data as AmenityCatalog;
  } catch (error) {
    handleApiError(error, 'get amenityCatalog');
    throw error;
  }
};

export const createAmenityCatalog = async (AmenityCatalog?: AmenityCatalog): Promise<AmenityCatalog> => {
  try {
    const url = `${BASE_URL}api/amenitycatalog/createAmenityCatalog`;
    const response = await axios.post(url, AmenityCatalog);
    return response.data as AmenityCatalog;
  } catch (error) {
    handleApiError(error, 'create amenityCatalog');
    throw error;
  }
};

export const updateAmenityCatalog = async (amenityCatalog?: AmenityCatalog): Promise<AmenityCatalog> => {
  try {
    const id = ((amenityCatalog as any)?.amenityID ?? '').toString();
    const url = `${BASE_URL}api/amenitycatalog/updateAmenityCatalog/${id}`;
    const response = await axios.put(url, amenityCatalog);
    return response.data as AmenityCatalog;
  } catch (error) {
    handleApiError(error, 'update amenityCatalog');
    throw error;
  }
};

export const deleteAmenityCatalog = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/amenitycatalog/deleteAmenityCatalog/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete amenityCatalog');
  }
};

