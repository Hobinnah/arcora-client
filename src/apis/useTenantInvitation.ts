{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { TenantInvitation } from "../types/TenantInvitation";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type TenantInvitationsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
};

export const getTenantInvitations = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: TenantInvitationsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchTenantInvitations',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchTenantInvitations({ pageSize, pageNumber, searchQuery,
      statusFilter,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchTenantInvitations = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: Required<Pick<TenantInvitationsListParams, 'pageSize' | 'pageNumber'>> & Omit<TenantInvitationsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<TenantInvitation>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/tenantinvitation/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch tenantInvitations');
  }
};

export const getTenantInvitation = async (id?: string): Promise<TenantInvitation> => {
  try {
    const url = `${BASE_URL}api/tenantinvitation/getTenantInvitationById/${id}`;
    const response = await axios.get(url);
    return response.data as TenantInvitation;
  } catch (error) {
    handleApiError(error, 'get tenantInvitation');
    throw error;
  }
};

export const createTenantInvitation = async (TenantInvitation?: TenantInvitation): Promise<TenantInvitation> => {
  try {
    const url = `${BASE_URL}api/tenantinvitation/createTenantInvitation`;
    const response = await axios.post(url, TenantInvitation);
    return response.data as TenantInvitation;
  } catch (error) {
    handleApiError(error, 'create tenantInvitation');
    throw error;
  }
};

export const updateTenantInvitation = async (tenantInvitation?: TenantInvitation): Promise<TenantInvitation> => {
  try {
    const id = ((tenantInvitation as any)?.tenantInvitationID ?? '').toString();
    const url = `${BASE_URL}api/tenantinvitation/updateTenantInvitation/${id}`;
    const response = await axios.put(url, tenantInvitation);
    return response.data as TenantInvitation;
  } catch (error) {
    handleApiError(error, 'update tenantInvitation');
    throw error;
  }
};

export const deleteTenantInvitation = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/tenantinvitation/deleteTenantInvitation/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete tenantInvitation');
  }
};

export const fireTenantInvitationAction = async (id?: string, status?: string): Promise<TenantInvitation> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/tenantinvitation/updateTenantInvitationStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/tenantinvitation/updatetenantinvitationstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/TENANTINVITATION/UpdateTenantInvitationStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as TenantInvitation;
  } catch (error) {
    handleApiError(error, 'fire tenantInvitation action');
    throw error;
  }
};

