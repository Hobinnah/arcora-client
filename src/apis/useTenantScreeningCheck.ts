{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { TenantScreeningCheck } from "../types/TenantScreeningCheck";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type TenantScreeningChecksListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  checkType?: string;
};

export const getTenantScreeningChecks = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  checkType,
  sortBy,
  sortDirection
}: TenantScreeningChecksListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchTenantScreeningChecks',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        checkType,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchTenantScreeningChecks({ pageSize, pageNumber, searchQuery,
      statusFilter,
      checkType,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchTenantScreeningChecks = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  checkType,
  sortBy,
  sortDirection
}: Required<Pick<TenantScreeningChecksListParams, 'pageSize' | 'pageNumber'>> & Omit<TenantScreeningChecksListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<TenantScreeningCheck>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/tenantscreeningcheck/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (checkType) { url += `&checkType=${encodeURIComponent(checkType)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch tenantScreeningChecks');
  }
};

export const getTenantScreeningCheck = async (id?: string): Promise<TenantScreeningCheck> => {
  try {
    const url = `${BASE_URL}api/tenantscreeningcheck/getTenantScreeningCheckById/${id}`;
    const response = await axios.get(url);
    return response.data as TenantScreeningCheck;
  } catch (error) {
    handleApiError(error, 'get tenantScreeningCheck');
    throw error;
  }
};

export const createTenantScreeningCheck = async (TenantScreeningCheck?: TenantScreeningCheck): Promise<TenantScreeningCheck> => {
  try {
    const url = `${BASE_URL}api/tenantscreeningcheck/createTenantScreeningCheck`;
    const response = await axios.post(url, TenantScreeningCheck);
    return response.data as TenantScreeningCheck;
  } catch (error) {
    handleApiError(error, 'create tenantScreeningCheck');
    throw error;
  }
};

export const updateTenantScreeningCheck = async (tenantScreeningCheck?: TenantScreeningCheck): Promise<TenantScreeningCheck> => {
  try {
    const id = ((tenantScreeningCheck as any)?.tenantScreeningCheckID ?? '').toString();
    const url = `${BASE_URL}api/tenantscreeningcheck/updateTenantScreeningCheck/${id}`;
    const response = await axios.put(url, tenantScreeningCheck);
    return response.data as TenantScreeningCheck;
  } catch (error) {
    handleApiError(error, 'update tenantScreeningCheck');
    throw error;
  }
};

export const deleteTenantScreeningCheck = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/tenantscreeningcheck/deleteTenantScreeningCheck/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete tenantScreeningCheck');
  }
};

export const fireTenantScreeningCheckAction = async (id?: string, status?: string): Promise<TenantScreeningCheck> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/tenantscreeningcheck/updateTenantScreeningCheckStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/tenantscreeningcheck/updatetenantscreeningcheckstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/TENANTSCREENINGCHECK/UpdateTenantScreeningCheckStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as TenantScreeningCheck;
  } catch (error) {
    handleApiError(error, 'fire tenantScreeningCheck action');
    throw error;
  }
};

