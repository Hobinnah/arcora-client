{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { SecurityDeposit } from "../types/SecurityDeposit";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type SecurityDepositsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
};

export const getSecurityDeposits = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: SecurityDepositsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchSecurityDeposits',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchSecurityDeposits({ pageSize, pageNumber, searchQuery,
      statusFilter,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchSecurityDeposits = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: Required<Pick<SecurityDepositsListParams, 'pageSize' | 'pageNumber'>> & Omit<SecurityDepositsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<SecurityDeposit>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/securitydeposit/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch securityDeposits');
  }
};

export const getSecurityDeposit = async (id?: string): Promise<SecurityDeposit> => {
  try {
    const url = `${BASE_URL}api/securitydeposit/getSecurityDepositById/${id}`;
    const response = await axios.get(url);
    return response.data as SecurityDeposit;
  } catch (error) {
    handleApiError(error, 'get securityDeposit');
    throw error;
  }
};

export const createSecurityDeposit = async (SecurityDeposit?: SecurityDeposit): Promise<SecurityDeposit> => {
  try {
    const url = `${BASE_URL}api/securitydeposit/createSecurityDeposit`;
    const response = await axios.post(url, SecurityDeposit);
    return response.data as SecurityDeposit;
  } catch (error) {
    handleApiError(error, 'create securityDeposit');
    throw error;
  }
};

export const updateSecurityDeposit = async (securityDeposit?: SecurityDeposit): Promise<SecurityDeposit> => {
  try {
    const id = ((securityDeposit as any)?.securityDepositID ?? '').toString();
    const url = `${BASE_URL}api/securitydeposit/updateSecurityDeposit/${id}`;
    const response = await axios.put(url, securityDeposit);
    return response.data as SecurityDeposit;
  } catch (error) {
    handleApiError(error, 'update securityDeposit');
    throw error;
  }
};

export const deleteSecurityDeposit = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/securitydeposit/deleteSecurityDeposit/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete securityDeposit');
  }
};

export const fireSecurityDepositAction = async (id?: string, status?: string): Promise<SecurityDeposit> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/securitydeposit/updateSecurityDepositStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/securitydeposit/updatesecuritydepositstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/SECURITYDEPOSIT/UpdateSecurityDepositStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as SecurityDeposit;
  } catch (error) {
    handleApiError(error, 'fire securityDeposit action');
    throw error;
  }
};

