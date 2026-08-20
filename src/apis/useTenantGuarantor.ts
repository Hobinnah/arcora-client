{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { TenantGuarantor } from "../types/TenantGuarantor";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type TenantGuarantorsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
};

export const getTenantGuarantors = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: TenantGuarantorsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchTenantGuarantors',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchTenantGuarantors({ pageSize, pageNumber, searchQuery,
      statusFilter,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchTenantGuarantors = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: Required<Pick<TenantGuarantorsListParams, 'pageSize' | 'pageNumber'>> & Omit<TenantGuarantorsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<TenantGuarantor>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/tenantguarantor/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch tenantGuarantors');
  }
};

export const getTenantGuarantor = async (id?: string): Promise<TenantGuarantor> => {
  try {
    const url = `${BASE_URL}api/tenantguarantor/getTenantGuarantorById/${id}`;
    const response = await axios.get(url);
    return response.data as TenantGuarantor;
  } catch (error) {
    handleApiError(error, 'get tenantGuarantor');
    throw error;
  }
};

export const createTenantGuarantor = async (TenantGuarantor?: TenantGuarantor): Promise<TenantGuarantor> => {
  try {
    const url = `${BASE_URL}api/tenantguarantor/createTenantGuarantor`;
    const response = await axios.post(url, TenantGuarantor);
    return response.data as TenantGuarantor;
  } catch (error) {
    handleApiError(error, 'create tenantGuarantor');
    throw error;
  }
};

export const updateTenantGuarantor = async (tenantGuarantor?: TenantGuarantor): Promise<TenantGuarantor> => {
  try {
    const id = ((tenantGuarantor as any)?.tenantGuarantorID ?? '').toString();
    const url = `${BASE_URL}api/tenantguarantor/updateTenantGuarantor/${id}`;
    const response = await axios.put(url, tenantGuarantor);
    return response.data as TenantGuarantor;
  } catch (error) {
    handleApiError(error, 'update tenantGuarantor');
    throw error;
  }
};

export const deleteTenantGuarantor = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/tenantguarantor/deleteTenantGuarantor/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete tenantGuarantor');
  }
};

export const fireTenantGuarantorAction = async (id?: string, status?: string): Promise<TenantGuarantor> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/tenantguarantor/updateTenantGuarantorStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/tenantguarantor/updatetenantguarantorstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/TENANTGUARANTOR/UpdateTenantGuarantorStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as TenantGuarantor;
  } catch (error) {
    handleApiError(error, 'fire tenantGuarantor action');
    throw error;
  }
};

