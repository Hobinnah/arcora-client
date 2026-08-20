{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { OrganizationMember } from "../types/OrganizationMember";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type OrganizationMembersListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  roleName?: string;
};

export const getOrganizationMembers = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  roleName,
  sortBy,
  sortDirection
}: OrganizationMembersListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchOrganizationMembers',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        roleName,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchOrganizationMembers({ pageSize, pageNumber, searchQuery,
      statusFilter,
      roleName,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchOrganizationMembers = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  roleName,
  sortBy,
  sortDirection
}: Required<Pick<OrganizationMembersListParams, 'pageSize' | 'pageNumber'>> & Omit<OrganizationMembersListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<OrganizationMember>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/organizationmember/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (roleName) { url += `&roleName=${encodeURIComponent(roleName)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch organizationMembers');
  }
};

export const getOrganizationMember = async (id?: string): Promise<OrganizationMember> => {
  try {
    const url = `${BASE_URL}api/organizationmember/getOrganizationMemberById/${id}`;
    const response = await axios.get(url);
    return response.data as OrganizationMember;
  } catch (error) {
    handleApiError(error, 'get organizationMember');
    throw error;
  }
};

export const createOrganizationMember = async (OrganizationMember?: OrganizationMember): Promise<OrganizationMember> => {
  try {
    const url = `${BASE_URL}api/organizationmember/createOrganizationMember`;
    const response = await axios.post(url, OrganizationMember);
    return response.data as OrganizationMember;
  } catch (error) {
    handleApiError(error, 'create organizationMember');
    throw error;
  }
};

export const updateOrganizationMember = async (organizationMember?: OrganizationMember): Promise<OrganizationMember> => {
  try {
    const id = ((organizationMember as any)?.organizationMemberID ?? '').toString();
    const url = `${BASE_URL}api/organizationmember/updateOrganizationMember/${id}`;
    const response = await axios.put(url, organizationMember);
    return response.data as OrganizationMember;
  } catch (error) {
    handleApiError(error, 'update organizationMember');
    throw error;
  }
};

export const deleteOrganizationMember = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/organizationmember/deleteOrganizationMember/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete organizationMember');
  }
};

export const fireOrganizationMemberAction = async (id?: string, status?: string): Promise<OrganizationMember> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/organizationmember/updateOrganizationMemberStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/organizationmember/updateorganizationmemberstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/ORGANIZATIONMEMBER/UpdateOrganizationMemberStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as OrganizationMember;
  } catch (error) {
    handleApiError(error, 'fire organizationMember action');
    throw error;
  }
};

