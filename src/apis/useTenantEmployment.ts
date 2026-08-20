{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { TenantEmployment } from "../types/TenantEmployment";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type TenantEmploymentsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  verificationStatus?: string;
  isCurrent?: string;
};

export const getTenantEmployments = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  verificationStatus,
  isCurrent,
  sortBy,
  sortDirection
}: TenantEmploymentsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchTenantEmployments',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        verificationStatus,
        isCurrent,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchTenantEmployments({ pageSize, pageNumber, searchQuery,
      statusFilter,
      verificationStatus,
      isCurrent,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchTenantEmployments = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  verificationStatus,
  isCurrent,
  sortBy,
  sortDirection
}: Required<Pick<TenantEmploymentsListParams, 'pageSize' | 'pageNumber'>> & Omit<TenantEmploymentsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<TenantEmployment>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/tenantemployment/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (verificationStatus) { url += `&verificationStatus=${encodeURIComponent(verificationStatus)}`; }
    if (isCurrent) { url += `&isCurrent=${encodeURIComponent(isCurrent)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch tenantEmployments');
  }
};

export const getTenantEmployment = async (id?: string): Promise<TenantEmployment> => {
  try {
    const url = `${BASE_URL}api/tenantemployment/getTenantEmploymentById/${id}`;
    const response = await axios.get(url);
    return response.data as TenantEmployment;
  } catch (error) {
    handleApiError(error, 'get tenantEmployment');
    throw error;
  }
};

export const createTenantEmployment = async (TenantEmployment?: TenantEmployment): Promise<TenantEmployment> => {
  try {
    const url = `${BASE_URL}api/tenantemployment/createTenantEmployment`;
    const response = await axios.post(url, TenantEmployment);
    return response.data as TenantEmployment;
  } catch (error) {
    handleApiError(error, 'create tenantEmployment');
    throw error;
  }
};

export const updateTenantEmployment = async (tenantEmployment?: TenantEmployment): Promise<TenantEmployment> => {
  try {
    const id = ((tenantEmployment as any)?.tenantEmploymentID ?? '').toString();
    const url = `${BASE_URL}api/tenantemployment/updateTenantEmployment/${id}`;
    const response = await axios.put(url, tenantEmployment);
    return response.data as TenantEmployment;
  } catch (error) {
    handleApiError(error, 'update tenantEmployment');
    throw error;
  }
};

export const deleteTenantEmployment = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/tenantemployment/deleteTenantEmployment/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete tenantEmployment');
  }
};

export const fireTenantEmploymentAction = async (id?: string, status?: string): Promise<TenantEmployment> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/tenantemployment/updateTenantEmploymentStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/tenantemployment/updatetenantemploymentstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/TENANTEMPLOYMENT/UpdateTenantEmploymentStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as TenantEmployment;
  } catch (error) {
    handleApiError(error, 'fire tenantEmployment action');
    throw error;
  }
};

