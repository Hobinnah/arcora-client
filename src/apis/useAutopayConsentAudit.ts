{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { AutopayConsentAudit } from "../types/AutopayConsentAudit";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type AutopayConsentAuditsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  action?: string;
  actionAt?: string;
};

export const getAutopayConsentAudits = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  action,
  actionAt,
  sortBy,
  sortDirection
}: AutopayConsentAuditsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchAutopayConsentAudits',
      { pageSize, pageNumber, searchQuery,
        action,
        actionAt,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchAutopayConsentAudits({ pageSize, pageNumber, searchQuery,
      action,
      actionAt,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchAutopayConsentAudits = async ({
  pageSize,
  pageNumber,
  searchQuery,
  action,
  actionAt,
  sortBy,
  sortDirection
}: Required<Pick<AutopayConsentAuditsListParams, 'pageSize' | 'pageNumber'>> & Omit<AutopayConsentAuditsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<AutopayConsentAudit>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/autopayconsentaudit/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (action) { url += `&action=${encodeURIComponent(action)}`; }
    if (actionAt) { url += `&actionAt=${encodeURIComponent(actionAt)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch autopayConsentAudits');
  }
};

export const getAutopayConsentAudit = async (id?: string): Promise<AutopayConsentAudit> => {
  try {
    const url = `${BASE_URL}api/autopayconsentaudit/getAutopayConsentAuditById/${id}`;
    const response = await axios.get(url);
    return response.data as AutopayConsentAudit;
  } catch (error) {
    handleApiError(error, 'get autopayConsentAudit');
    throw error;
  }
};

export const createAutopayConsentAudit = async (AutopayConsentAudit?: AutopayConsentAudit): Promise<AutopayConsentAudit> => {
  try {
    const url = `${BASE_URL}api/autopayconsentaudit/createAutopayConsentAudit`;
    const response = await axios.post(url, AutopayConsentAudit);
    return response.data as AutopayConsentAudit;
  } catch (error) {
    handleApiError(error, 'create autopayConsentAudit');
    throw error;
  }
};

export const updateAutopayConsentAudit = async (autopayConsentAudit?: AutopayConsentAudit): Promise<AutopayConsentAudit> => {
  try {
    const id = ((autopayConsentAudit as any)?.autopayConsentAuditID ?? '').toString();
    const url = `${BASE_URL}api/autopayconsentaudit/updateAutopayConsentAudit/${id}`;
    const response = await axios.put(url, autopayConsentAudit);
    return response.data as AutopayConsentAudit;
  } catch (error) {
    handleApiError(error, 'update autopayConsentAudit');
    throw error;
  }
};

export const deleteAutopayConsentAudit = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/autopayconsentaudit/deleteAutopayConsentAudit/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete autopayConsentAudit');
  }
};

