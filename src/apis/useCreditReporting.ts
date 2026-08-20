{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { CreditReporting } from "../types/CreditReporting";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type CreditReportingsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  providerStatus?: string;
};

export const getCreditReportings = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  providerStatus,
  sortBy,
  sortDirection
}: CreditReportingsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchCreditReportings',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        providerStatus,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchCreditReportings({ pageSize, pageNumber, searchQuery,
      statusFilter,
      providerStatus,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchCreditReportings = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  providerStatus,
  sortBy,
  sortDirection
}: Required<Pick<CreditReportingsListParams, 'pageSize' | 'pageNumber'>> & Omit<CreditReportingsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<CreditReporting>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/creditreporting/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (providerStatus) { url += `&providerStatus=${encodeURIComponent(providerStatus)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch creditReportings');
  }
};

export const getCreditReporting = async (id?: string): Promise<CreditReporting> => {
  try {
    const url = `${BASE_URL}api/creditreporting/getCreditReportingById/${id}`;
    const response = await axios.get(url);
    return response.data as CreditReporting;
  } catch (error) {
    handleApiError(error, 'get creditReporting');
    throw error;
  }
};

export const createCreditReporting = async (CreditReporting?: CreditReporting): Promise<CreditReporting> => {
  try {
    const url = `${BASE_URL}api/creditreporting/createCreditReporting`;
    const response = await axios.post(url, CreditReporting);
    return response.data as CreditReporting;
  } catch (error) {
    handleApiError(error, 'create creditReporting');
    throw error;
  }
};

export const updateCreditReporting = async (creditReporting?: CreditReporting): Promise<CreditReporting> => {
  try {
    const id = ((creditReporting as any)?.creditReportingID ?? '').toString();
    const url = `${BASE_URL}api/creditreporting/updateCreditReporting/${id}`;
    const response = await axios.put(url, creditReporting);
    return response.data as CreditReporting;
  } catch (error) {
    handleApiError(error, 'update creditReporting');
    throw error;
  }
};

export const deleteCreditReporting = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/creditreporting/deleteCreditReporting/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete creditReporting');
  }
};

export const fireCreditReportingAction = async (id?: string, status?: string): Promise<CreditReporting> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/creditreporting/updateCreditReportingStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/creditreporting/updatecreditreportingstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/CREDITREPORTING/UpdateCreditReportingStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as CreditReporting;
  } catch (error) {
    handleApiError(error, 'fire creditReporting action');
    throw error;
  }
};

