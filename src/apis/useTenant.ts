{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Tenant } from "../types/Tenant";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type TenantsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  profileStatus?: string;
};

export const getTenants = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  profileStatus,
  sortBy,
  sortDirection
}: TenantsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchTenants',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        profileStatus,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchTenants({ pageSize, pageNumber, searchQuery,
      statusFilter,
      profileStatus,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchTenants = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  profileStatus,
  sortBy,
  sortDirection
}: Required<Pick<TenantsListParams, 'pageSize' | 'pageNumber'>> & Omit<TenantsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Tenant>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/tenant/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (profileStatus) { url += `&profileStatus=${encodeURIComponent(profileStatus)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch tenants');
  }
};

export const getTenant = async (id?: string): Promise<Tenant> => {
  try {
    const url = `${BASE_URL}api/tenant/getTenantById/${id}`;
    const response = await axios.get(url);
    return response.data as Tenant;
  } catch (error) {
    handleApiError(error, 'get tenant');
    throw error;
  }
};

export const createTenant = async (Tenant?: Tenant): Promise<Tenant> => {
  try {
    const url = `${BASE_URL}api/tenant/createTenant`;
    const response = await axios.post(url, Tenant);
    return response.data as Tenant;
  } catch (error) {
    handleApiError(error, 'create tenant');
    throw error;
  }
};

export const updateTenant = async (tenant?: Tenant): Promise<Tenant> => {
  try {
    const id = ((tenant as any)?.tenantID ?? '').toString();
    const url = `${BASE_URL}api/tenant/updateTenant/${id}`;
    const response = await axios.put(url, tenant);
    return response.data as Tenant;
  } catch (error) {
    handleApiError(error, 'update tenant');
    throw error;
  }
};

export const deleteTenant = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/tenant/deleteTenant/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete tenant');
  }
};

export const fireTenantAction = async (id?: string, status?: string): Promise<Tenant> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/tenant/updateTenantStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/tenant/updatetenantstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/TENANT/UpdateTenantStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as Tenant;
  } catch (error) {
    handleApiError(error, 'fire tenant action');
    throw error;
  }
};

