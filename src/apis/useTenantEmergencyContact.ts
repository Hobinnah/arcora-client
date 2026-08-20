{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { TenantEmergencyContact } from "../types/TenantEmergencyContact";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type TenantEmergencyContactsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getTenantEmergencyContacts = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: TenantEmergencyContactsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchTenantEmergencyContacts',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchTenantEmergencyContacts({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchTenantEmergencyContacts = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<TenantEmergencyContactsListParams, 'pageSize' | 'pageNumber'>> & Omit<TenantEmergencyContactsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<TenantEmergencyContact>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/tenantemergencycontact/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch tenantEmergencyContacts');
  }
};

export const getTenantEmergencyContact = async (id?: string): Promise<TenantEmergencyContact> => {
  try {
    const url = `${BASE_URL}api/tenantemergencycontact/getTenantEmergencyContactById/${id}`;
    const response = await axios.get(url);
    return response.data as TenantEmergencyContact;
  } catch (error) {
    handleApiError(error, 'get tenantEmergencyContact');
    throw error;
  }
};

export const createTenantEmergencyContact = async (TenantEmergencyContact?: TenantEmergencyContact): Promise<TenantEmergencyContact> => {
  try {
    const url = `${BASE_URL}api/tenantemergencycontact/createTenantEmergencyContact`;
    const response = await axios.post(url, TenantEmergencyContact);
    return response.data as TenantEmergencyContact;
  } catch (error) {
    handleApiError(error, 'create tenantEmergencyContact');
    throw error;
  }
};

export const updateTenantEmergencyContact = async (tenantEmergencyContact?: TenantEmergencyContact): Promise<TenantEmergencyContact> => {
  try {
    const id = ((tenantEmergencyContact as any)?.tenantEmergencyContactID ?? '').toString();
    const url = `${BASE_URL}api/tenantemergencycontact/updateTenantEmergencyContact/${id}`;
    const response = await axios.put(url, tenantEmergencyContact);
    return response.data as TenantEmergencyContact;
  } catch (error) {
    handleApiError(error, 'update tenantEmergencyContact');
    throw error;
  }
};

export const deleteTenantEmergencyContact = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/tenantemergencycontact/deleteTenantEmergencyContact/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete tenantEmergencyContact');
  }
};

