{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Organization } from "../types/Organization";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type OrganizationsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  countryCode?: string;
  provinceCode?: string;
};

export const getOrganizations = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  countryCode,
  provinceCode,
  sortBy,
  sortDirection
}: OrganizationsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchOrganizations',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        countryCode,
        provinceCode,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchOrganizations({ pageSize, pageNumber, searchQuery,
      statusFilter,
      countryCode,
      provinceCode,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchOrganizations = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  countryCode,
  provinceCode,
  sortBy,
  sortDirection
}: Required<Pick<OrganizationsListParams, 'pageSize' | 'pageNumber'>> & Omit<OrganizationsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Organization>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/organization/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (countryCode) { url += `&countryCode=${encodeURIComponent(countryCode)}`; }
    if (provinceCode) { url += `&provinceCode=${encodeURIComponent(provinceCode)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch organizations');
  }
};

export const getOrganization = async (id?: string): Promise<Organization> => {
  try {
    const url = `${BASE_URL}api/organization/getOrganizationById/${id}`;
    const response = await axios.get(url);
    return response.data as Organization;
  } catch (error) {
    handleApiError(error, 'get organization');
    throw error;
  }
};

export const createOrganization = async (Organization?: Organization): Promise<Organization> => {
  try {
    const url = `${BASE_URL}api/organization/createOrganization`;
    const response = await axios.post(url, Organization);
    return response.data as Organization;
  } catch (error) {
    handleApiError(error, 'create organization');
    throw error;
  }
};

export const updateOrganization = async (organization?: Organization): Promise<Organization> => {
  try {
    const id = ((organization as any)?.organizationID ?? '').toString();
    const url = `${BASE_URL}api/organization/updateOrganization/${id}`;
    const response = await axios.put(url, organization);
    return response.data as Organization;
  } catch (error) {
    handleApiError(error, 'update organization');
    throw error;
  }
};

export const deleteOrganization = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/organization/deleteOrganization/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete organization');
  }
};

export const fireOrganizationAction = async (id?: string, status?: string): Promise<Organization> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/organization/updateOrganizationStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/organization/updateorganizationstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/ORGANIZATION/UpdateOrganizationStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as Organization;
  } catch (error) {
    handleApiError(error, 'fire organization action');
    throw error;
  }
};

