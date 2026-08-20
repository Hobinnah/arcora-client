{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Lease } from "../types/Lease";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type LeasesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  currency?: string;
};

export const getLeases = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  currency,
  sortBy,
  sortDirection
}: LeasesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchLeases',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        currency,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchLeases({ pageSize, pageNumber, searchQuery,
      statusFilter,
      currency,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchLeases = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  currency,
  sortBy,
  sortDirection
}: Required<Pick<LeasesListParams, 'pageSize' | 'pageNumber'>> & Omit<LeasesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Lease>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/lease/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (currency) { url += `&currency=${encodeURIComponent(currency)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch leases');
  }
};

export const getLease = async (id?: string): Promise<Lease> => {
  try {
    const url = `${BASE_URL}api/lease/getLeaseById/${id}`;
    const response = await axios.get(url);
    return response.data as Lease;
  } catch (error) {
    handleApiError(error, 'get lease');
    throw error;
  }
};

export const createLease = async (Lease?: Lease): Promise<Lease> => {
  try {
    const url = `${BASE_URL}api/lease/createLease`;
    const response = await axios.post(url, Lease);
    return response.data as Lease;
  } catch (error) {
    handleApiError(error, 'create lease');
    throw error;
  }
};

export const updateLease = async (lease?: Lease): Promise<Lease> => {
  try {
    const id = ((lease as any)?.leaseID ?? '').toString();
    const url = `${BASE_URL}api/lease/updateLease/${id}`;
    const response = await axios.put(url, lease);
    return response.data as Lease;
  } catch (error) {
    handleApiError(error, 'update lease');
    throw error;
  }
};

export const deleteLease = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/lease/deleteLease/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete lease');
  }
};

export const fireLeaseAction = async (id?: string, status?: string): Promise<Lease> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/lease/updateLeaseStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/lease/updateleasestatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/LEASE/UpdateLeaseStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as Lease;
  } catch (error) {
    handleApiError(error, 'fire lease action');
    throw error;
  }
};

