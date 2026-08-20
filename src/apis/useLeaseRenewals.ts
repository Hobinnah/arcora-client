{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { LeaseRenewals } from "../types/LeaseRenewals";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type LeaseRenewalsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  startDate?: string;
};

export const getLeaseRenewals = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  startDate,
  sortBy,
  sortDirection
}: LeaseRenewalsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchLeaseRenewals',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        startDate,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchLeaseRenewals({ pageSize, pageNumber, searchQuery,
      statusFilter,
      startDate,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchLeaseRenewals = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  startDate,
  sortBy,
  sortDirection
}: Required<Pick<LeaseRenewalsListParams, 'pageSize' | 'pageNumber'>> & Omit<LeaseRenewalsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<LeaseRenewals>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/leaserenewals/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (startDate) { url += `&startDate=${encodeURIComponent(startDate)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch leaseRenewals');
  }
};

export const getLeaseRenewals = async (id?: string): Promise<LeaseRenewals> => {
  try {
    const url = `${BASE_URL}api/leaserenewals/getLeaseRenewalsById/${id}`;
    const response = await axios.get(url);
    return response.data as LeaseRenewals;
  } catch (error) {
    handleApiError(error, 'get leaseRenewals');
    throw error;
  }
};

export const createLeaseRenewals = async (LeaseRenewals?: LeaseRenewals): Promise<LeaseRenewals> => {
  try {
    const url = `${BASE_URL}api/leaserenewals/createLeaseRenewals`;
    const response = await axios.post(url, LeaseRenewals);
    return response.data as LeaseRenewals;
  } catch (error) {
    handleApiError(error, 'create leaseRenewals');
    throw error;
  }
};

export const updateLeaseRenewals = async (leaseRenewals?: LeaseRenewals): Promise<LeaseRenewals> => {
  try {
    const id = ((leaseRenewals as any)?.leaseRenewalID ?? '').toString();
    const url = `${BASE_URL}api/leaserenewals/updateLeaseRenewals/${id}`;
    const response = await axios.put(url, leaseRenewals);
    return response.data as LeaseRenewals;
  } catch (error) {
    handleApiError(error, 'update leaseRenewals');
    throw error;
  }
};

export const deleteLeaseRenewals = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/leaserenewals/deleteLeaseRenewals/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete leaseRenewals');
  }
};

export const fireLeaseRenewalsAction = async (id?: string, status?: string): Promise<LeaseRenewals> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/leaserenewals/updateLeaseRenewalsStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/leaserenewals/updateleaserenewalsstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/LEASERENEWALS/UpdateLeaseRenewalsStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as LeaseRenewals;
  } catch (error) {
    handleApiError(error, 'fire leaseRenewals action');
    throw error;
  }
};

