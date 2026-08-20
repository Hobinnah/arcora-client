{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { InspectionItem } from "../types/InspectionItem";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type InspectionItemsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getInspectionItems = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: InspectionItemsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchInspectionItems',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchInspectionItems({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchInspectionItems = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<InspectionItemsListParams, 'pageSize' | 'pageNumber'>> & Omit<InspectionItemsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<InspectionItem>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/inspectionitem/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch inspectionItems');
  }
};

export const getInspectionItem = async (id?: string): Promise<InspectionItem> => {
  try {
    const url = `${BASE_URL}api/inspectionitem/getInspectionItemById/${id}`;
    const response = await axios.get(url);
    return response.data as InspectionItem;
  } catch (error) {
    handleApiError(error, 'get inspectionItem');
    throw error;
  }
};

export const createInspectionItem = async (InspectionItem?: InspectionItem): Promise<InspectionItem> => {
  try {
    const url = `${BASE_URL}api/inspectionitem/createInspectionItem`;
    const response = await axios.post(url, InspectionItem);
    return response.data as InspectionItem;
  } catch (error) {
    handleApiError(error, 'create inspectionItem');
    throw error;
  }
};

export const updateInspectionItem = async (inspectionItem?: InspectionItem): Promise<InspectionItem> => {
  try {
    const id = ((inspectionItem as any)?.inspectionItemID ?? '').toString();
    const url = `${BASE_URL}api/inspectionitem/updateInspectionItem/${id}`;
    const response = await axios.put(url, inspectionItem);
    return response.data as InspectionItem;
  } catch (error) {
    handleApiError(error, 'update inspectionItem');
    throw error;
  }
};

export const deleteInspectionItem = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/inspectionitem/deleteInspectionItem/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete inspectionItem');
  }
};

