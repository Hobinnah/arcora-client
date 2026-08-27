{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { LeaseSignatories } from "../types/LeaseSignatories";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type LeaseSignatoriesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
};

export const getLeaseSignatories = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: LeaseSignatoriesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchLeaseSignatories',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchLeaseSignatories({ pageSize, pageNumber, searchQuery,
      statusFilter,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchLeaseSignatories = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: Required<Pick<LeaseSignatoriesListParams, 'pageSize' | 'pageNumber'>> & Omit<LeaseSignatoriesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<LeaseSignatories>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/leasesignatories/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch leaseSignatories');
  }
};

export const getLeaseSignatoriesById = async (id?: string): Promise<LeaseSignatories> => {
  try {
    const url = `${BASE_URL}api/leasesignatories/getLeaseSignatoriesById/${id}`;
    const response = await axios.get(url);
    return response.data as LeaseSignatories;
  } catch (error) {
    handleApiError(error, 'get leaseSignatories');
    throw error;
  }
};

export const createLeaseSignatories = async (LeaseSignatories?: LeaseSignatories): Promise<LeaseSignatories> => {
  try {
    const url = `${BASE_URL}api/leasesignatories/createLeaseSignatories`;
    const response = await axios.post(url, LeaseSignatories);
    return response.data as LeaseSignatories;
  } catch (error) {
    handleApiError(error, 'create leaseSignatories');
    throw error;
  }
};

export const updateLeaseSignatories = async (leaseSignatories?: LeaseSignatories): Promise<LeaseSignatories> => {
  try {
    const id = ((leaseSignatories as any)?.leaseSignatoryID ?? '').toString();
    const url = `${BASE_URL}api/leasesignatories/updateLeaseSignatories/${id}`;
    const response = await axios.put(url, leaseSignatories);
    return response.data as LeaseSignatories;
  } catch (error) {
    handleApiError(error, 'update leaseSignatories');
    throw error;
  }
};

export const deleteLeaseSignatories = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/leasesignatories/deleteLeaseSignatories/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete leaseSignatories');
  }
};

export const fireLeaseSignatoriesAction = async (id?: string, status?: string): Promise<LeaseSignatories> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/leasesignatories/updateLeaseSignatoriesStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/leasesignatories/updateleasesignatoriesstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/LEASESIGNATORIES/UpdateLeaseSignatoriesStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as LeaseSignatories;
  } catch (error) {
    handleApiError(error, 'fire leaseSignatories action');
    throw error;
  }
};

