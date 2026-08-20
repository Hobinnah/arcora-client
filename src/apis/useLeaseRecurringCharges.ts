{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { LeaseRecurringCharges } from "../types/LeaseRecurringCharges";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type LeaseRecurringChargesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  isActive?: string;
  frequency?: string;
};

export const getLeaseRecurringCharges = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  isActive,
  frequency,
  sortBy,
  sortDirection
}: LeaseRecurringChargesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchLeaseRecurringCharges',
      { pageSize, pageNumber, searchQuery,
        isActive,
        frequency,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchLeaseRecurringCharges({ pageSize, pageNumber, searchQuery,
      isActive,
      frequency,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchLeaseRecurringCharges = async ({
  pageSize,
  pageNumber,
  searchQuery,
  isActive,
  frequency,
  sortBy,
  sortDirection
}: Required<Pick<LeaseRecurringChargesListParams, 'pageSize' | 'pageNumber'>> & Omit<LeaseRecurringChargesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<LeaseRecurringCharges>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/leaserecurringcharges/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (isActive) { url += `&isActive=${encodeURIComponent(isActive)}`; }
    if (frequency) { url += `&frequency=${encodeURIComponent(frequency)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch leaseRecurringCharges');
  }
};

export const getLeaseRecurringCharges = async (id?: string): Promise<LeaseRecurringCharges> => {
  try {
    const url = `${BASE_URL}api/leaserecurringcharges/getLeaseRecurringChargesById/${id}`;
    const response = await axios.get(url);
    return response.data as LeaseRecurringCharges;
  } catch (error) {
    handleApiError(error, 'get leaseRecurringCharges');
    throw error;
  }
};

export const createLeaseRecurringCharges = async (LeaseRecurringCharges?: LeaseRecurringCharges): Promise<LeaseRecurringCharges> => {
  try {
    const url = `${BASE_URL}api/leaserecurringcharges/createLeaseRecurringCharges`;
    const response = await axios.post(url, LeaseRecurringCharges);
    return response.data as LeaseRecurringCharges;
  } catch (error) {
    handleApiError(error, 'create leaseRecurringCharges');
    throw error;
  }
};

export const updateLeaseRecurringCharges = async (leaseRecurringCharges?: LeaseRecurringCharges): Promise<LeaseRecurringCharges> => {
  try {
    const id = ((leaseRecurringCharges as any)?.leaseRecurringChargeID ?? '').toString();
    const url = `${BASE_URL}api/leaserecurringcharges/updateLeaseRecurringCharges/${id}`;
    const response = await axios.put(url, leaseRecurringCharges);
    return response.data as LeaseRecurringCharges;
  } catch (error) {
    handleApiError(error, 'update leaseRecurringCharges');
    throw error;
  }
};

export const deleteLeaseRecurringCharges = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/leaserecurringcharges/deleteLeaseRecurringCharges/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete leaseRecurringCharges');
  }
};

