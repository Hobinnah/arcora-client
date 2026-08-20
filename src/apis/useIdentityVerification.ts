{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { IdentityVerification } from "../types/IdentityVerification";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type IdentityVerificationsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
};

export const getIdentityVerifications = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: IdentityVerificationsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchIdentityVerifications',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchIdentityVerifications({ pageSize, pageNumber, searchQuery,
      statusFilter,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchIdentityVerifications = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: Required<Pick<IdentityVerificationsListParams, 'pageSize' | 'pageNumber'>> & Omit<IdentityVerificationsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<IdentityVerification>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/identityverification/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch identityVerifications');
  }
};

export const getIdentityVerification = async (id?: string): Promise<IdentityVerification> => {
  try {
    const url = `${BASE_URL}api/identityverification/getIdentityVerificationById/${id}`;
    const response = await axios.get(url);
    return response.data as IdentityVerification;
  } catch (error) {
    handleApiError(error, 'get identityVerification');
    throw error;
  }
};

export const createIdentityVerification = async (IdentityVerification?: IdentityVerification): Promise<IdentityVerification> => {
  try {
    const url = `${BASE_URL}api/identityverification/createIdentityVerification`;
    const response = await axios.post(url, IdentityVerification);
    return response.data as IdentityVerification;
  } catch (error) {
    handleApiError(error, 'create identityVerification');
    throw error;
  }
};

export const updateIdentityVerification = async (identityVerification?: IdentityVerification): Promise<IdentityVerification> => {
  try {
    const id = ((identityVerification as any)?.identityVerificationID ?? '').toString();
    const url = `${BASE_URL}api/identityverification/updateIdentityVerification/${id}`;
    const response = await axios.put(url, identityVerification);
    return response.data as IdentityVerification;
  } catch (error) {
    handleApiError(error, 'update identityVerification');
    throw error;
  }
};

export const deleteIdentityVerification = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/identityverification/deleteIdentityVerification/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete identityVerification');
  }
};

export const fireIdentityVerificationAction = async (id?: string, status?: string): Promise<IdentityVerification> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/identityverification/updateIdentityVerificationStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/identityverification/updateidentityverificationstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/IDENTITYVERIFICATION/UpdateIdentityVerificationStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as IdentityVerification;
  } catch (error) {
    handleApiError(error, 'fire identityVerification action');
    throw error;
  }
};

