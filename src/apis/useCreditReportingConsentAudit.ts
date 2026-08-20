{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { CreditReportingConsentAudit } from "../types/CreditReportingConsentAudit";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type CreditReportingConsentAuditsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getCreditReportingConsentAudits = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: CreditReportingConsentAuditsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchCreditReportingConsentAudits',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchCreditReportingConsentAudits({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchCreditReportingConsentAudits = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<CreditReportingConsentAuditsListParams, 'pageSize' | 'pageNumber'>> & Omit<CreditReportingConsentAuditsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<CreditReportingConsentAudit>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/creditreportingconsentaudit/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch creditReportingConsentAudits');
  }
};

export const getCreditReportingConsentAudit = async (id?: string): Promise<CreditReportingConsentAudit> => {
  try {
    const url = `${BASE_URL}api/creditreportingconsentaudit/getCreditReportingConsentAuditById/${id}`;
    const response = await axios.get(url);
    return response.data as CreditReportingConsentAudit;
  } catch (error) {
    handleApiError(error, 'get creditReportingConsentAudit');
    throw error;
  }
};

export const createCreditReportingConsentAudit = async (CreditReportingConsentAudit?: CreditReportingConsentAudit): Promise<CreditReportingConsentAudit> => {
  try {
    const url = `${BASE_URL}api/creditreportingconsentaudit/createCreditReportingConsentAudit`;
    const response = await axios.post(url, CreditReportingConsentAudit);
    return response.data as CreditReportingConsentAudit;
  } catch (error) {
    handleApiError(error, 'create creditReportingConsentAudit');
    throw error;
  }
};

export const updateCreditReportingConsentAudit = async (creditReportingConsentAudit?: CreditReportingConsentAudit): Promise<CreditReportingConsentAudit> => {
  try {
    const id = ((creditReportingConsentAudit as any)?.consentAuditID ?? '').toString();
    const url = `${BASE_URL}api/creditreportingconsentaudit/updateCreditReportingConsentAudit/${id}`;
    const response = await axios.put(url, creditReportingConsentAudit);
    return response.data as CreditReportingConsentAudit;
  } catch (error) {
    handleApiError(error, 'update creditReportingConsentAudit');
    throw error;
  }
};

export const deleteCreditReportingConsentAudit = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/creditreportingconsentaudit/deleteCreditReportingConsentAudit/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete creditReportingConsentAudit');
  }
};

