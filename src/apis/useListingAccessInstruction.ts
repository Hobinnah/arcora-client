{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { ListingAccessInstruction } from "../types/ListingAccessInstruction";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type ListingAccessInstructionsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  isActive?: string;
  instructionType?: string;
};

export const getListingAccessInstructions = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  isActive,
  instructionType,
  sortBy,
  sortDirection
}: ListingAccessInstructionsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchListingAccessInstructions',
      { pageSize, pageNumber, searchQuery,
        isActive,
        instructionType,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchListingAccessInstructions({ pageSize, pageNumber, searchQuery,
      isActive,
      instructionType,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchListingAccessInstructions = async ({
  pageSize,
  pageNumber,
  searchQuery,
  isActive,
  instructionType,
  sortBy,
  sortDirection
}: Required<Pick<ListingAccessInstructionsListParams, 'pageSize' | 'pageNumber'>> & Omit<ListingAccessInstructionsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<ListingAccessInstruction>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/listingaccessinstruction/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (isActive) { url += `&isActive=${encodeURIComponent(isActive)}`; }
    if (instructionType) { url += `&instructionType=${encodeURIComponent(instructionType)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch listingAccessInstructions');
  }
};

export const getListingAccessInstruction = async (id?: string): Promise<ListingAccessInstruction> => {
  try {
    const url = `${BASE_URL}api/listingaccessinstruction/getListingAccessInstructionById/${id}`;
    const response = await axios.get(url);
    return response.data as ListingAccessInstruction;
  } catch (error) {
    handleApiError(error, 'get listingAccessInstruction');
    throw error;
  }
};

export const createListingAccessInstruction = async (ListingAccessInstruction?: ListingAccessInstruction): Promise<ListingAccessInstruction> => {
  try {
    const url = `${BASE_URL}api/listingaccessinstruction/createListingAccessInstruction`;
    const response = await axios.post(url, ListingAccessInstruction);
    return response.data as ListingAccessInstruction;
  } catch (error) {
    handleApiError(error, 'create listingAccessInstruction');
    throw error;
  }
};

export const updateListingAccessInstruction = async (listingAccessInstruction?: ListingAccessInstruction): Promise<ListingAccessInstruction> => {
  try {
    const id = ((listingAccessInstruction as any)?.listingAccessInstructionID ?? '').toString();
    const url = `${BASE_URL}api/listingaccessinstruction/updateListingAccessInstruction/${id}`;
    const response = await axios.put(url, listingAccessInstruction);
    return response.data as ListingAccessInstruction;
  } catch (error) {
    handleApiError(error, 'update listingAccessInstruction');
    throw error;
  }
};

export const deleteListingAccessInstruction = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/listingaccessinstruction/deleteListingAccessInstruction/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete listingAccessInstruction');
  }
};

