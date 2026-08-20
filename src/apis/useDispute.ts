{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Dispute } from "../types/Dispute";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type DisputesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
};

export const getDisputes = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: DisputesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchDisputes',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchDisputes({ pageSize, pageNumber, searchQuery,
      statusFilter,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchDisputes = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: Required<Pick<DisputesListParams, 'pageSize' | 'pageNumber'>> & Omit<DisputesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Dispute>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/dispute/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch disputes');
  }
};

export const getDispute = async (id?: string): Promise<Dispute> => {
  try {
    const url = `${BASE_URL}api/dispute/getDisputeById/${id}`;
    const response = await axios.get(url);
    return response.data as Dispute;
  } catch (error) {
    handleApiError(error, 'get dispute');
    throw error;
  }
};

export const createDispute = async (Dispute?: Dispute): Promise<Dispute> => {
  try {
    const url = `${BASE_URL}api/dispute/createDispute`;
    const response = await axios.post(url, Dispute);
    return response.data as Dispute;
  } catch (error) {
    handleApiError(error, 'create dispute');
    throw error;
  }
};

export const updateDispute = async (dispute?: Dispute): Promise<Dispute> => {
  try {
    const id = ((dispute as any)?.disputeID ?? '').toString();
    const url = `${BASE_URL}api/dispute/updateDispute/${id}`;
    const response = await axios.put(url, dispute);
    return response.data as Dispute;
  } catch (error) {
    handleApiError(error, 'update dispute');
    throw error;
  }
};

export const deleteDispute = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/dispute/deleteDispute/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete dispute');
  }
};

export const fireDisputeAction = async (id?: string, status?: string): Promise<Dispute> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/dispute/updateDisputeStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/dispute/updatedisputestatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/DISPUTE/UpdateDisputeStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as Dispute;
  } catch (error) {
    handleApiError(error, 'fire dispute action');
    throw error;
  }
};

