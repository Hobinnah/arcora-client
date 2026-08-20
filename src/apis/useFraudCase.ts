{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { FraudCase } from "../types/FraudCase";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type FraudCasesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
};

export const getFraudCases = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: FraudCasesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchFraudCases',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchFraudCases({ pageSize, pageNumber, searchQuery,
      statusFilter,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchFraudCases = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: Required<Pick<FraudCasesListParams, 'pageSize' | 'pageNumber'>> & Omit<FraudCasesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<FraudCase>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/fraudcase/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch fraudCases');
  }
};

export const getFraudCase = async (id?: string): Promise<FraudCase> => {
  try {
    const url = `${BASE_URL}api/fraudcase/getFraudCaseById/${id}`;
    const response = await axios.get(url);
    return response.data as FraudCase;
  } catch (error) {
    handleApiError(error, 'get fraudCase');
    throw error;
  }
};

export const createFraudCase = async (FraudCase?: FraudCase): Promise<FraudCase> => {
  try {
    const url = `${BASE_URL}api/fraudcase/createFraudCase`;
    const response = await axios.post(url, FraudCase);
    return response.data as FraudCase;
  } catch (error) {
    handleApiError(error, 'create fraudCase');
    throw error;
  }
};

export const updateFraudCase = async (fraudCase?: FraudCase): Promise<FraudCase> => {
  try {
    const id = ((fraudCase as any)?.fraudCaseID ?? '').toString();
    const url = `${BASE_URL}api/fraudcase/updateFraudCase/${id}`;
    const response = await axios.put(url, fraudCase);
    return response.data as FraudCase;
  } catch (error) {
    handleApiError(error, 'update fraudCase');
    throw error;
  }
};

export const deleteFraudCase = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/fraudcase/deleteFraudCase/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete fraudCase');
  }
};

export const fireFraudCaseAction = async (id?: string, status?: string): Promise<FraudCase> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/fraudcase/updateFraudCaseStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/fraudcase/updatefraudcasestatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/FRAUDCASE/UpdateFraudCaseStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as FraudCase;
  } catch (error) {
    handleApiError(error, 'fire fraudCase action');
    throw error;
  }
};

