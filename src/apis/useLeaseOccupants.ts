{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { LeaseOccupants } from "../types/LeaseOccupants";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type LeaseOccupantsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  occupantType?: string;
};

export const getLeaseOccupants = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  occupantType,
  sortBy,
  sortDirection
}: LeaseOccupantsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchLeaseOccupants',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        occupantType,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchLeaseOccupants({ pageSize, pageNumber, searchQuery,
      statusFilter,
      occupantType,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchLeaseOccupants = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  occupantType,
  sortBy,
  sortDirection
}: Required<Pick<LeaseOccupantsListParams, 'pageSize' | 'pageNumber'>> & Omit<LeaseOccupantsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<LeaseOccupants>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/leaseoccupants/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (occupantType) { url += `&occupantType=${encodeURIComponent(occupantType)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch leaseOccupants');
  }
};

export const getLeaseOccupantsById = async (id?: string): Promise<LeaseOccupants> => {
  try {
    const url = `${BASE_URL}api/leaseoccupants/getLeaseOccupantsById/${id}`;
    const response = await axios.get(url);
    return response.data as LeaseOccupants;
  } catch (error) {
    handleApiError(error, 'get leaseOccupants');
    throw error;
  }
};

export const createLeaseOccupants = async (LeaseOccupants?: LeaseOccupants): Promise<LeaseOccupants> => {
  try {
    const url = `${BASE_URL}api/leaseoccupants/createLeaseOccupants`;
    const response = await axios.post(url, LeaseOccupants);
    return response.data as LeaseOccupants;
  } catch (error) {
    handleApiError(error, 'create leaseOccupants');
    throw error;
  }
};

export const updateLeaseOccupants = async (leaseOccupants?: LeaseOccupants): Promise<LeaseOccupants> => {
  try {
    const id = ((leaseOccupants as any)?.leaseOccupantID ?? '').toString();
    const url = `${BASE_URL}api/leaseoccupants/updateLeaseOccupants/${id}`;
    const response = await axios.put(url, leaseOccupants);
    return response.data as LeaseOccupants;
  } catch (error) {
    handleApiError(error, 'update leaseOccupants');
    throw error;
  }
};

export const deleteLeaseOccupants = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/leaseoccupants/deleteLeaseOccupants/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete leaseOccupants');
  }
};

export const fireLeaseOccupantsAction = async (id?: string, status?: string): Promise<LeaseOccupants> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/leaseoccupants/updateLeaseOccupantsStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/leaseoccupants/updateleaseoccupantsstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/LEASEOCCUPANTS/UpdateLeaseOccupantsStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as LeaseOccupants;
  } catch (error) {
    handleApiError(error, 'fire leaseOccupants action');
    throw error;
  }
};

