{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { CreditReportingEnrollment } from "../types/CreditReportingEnrollment";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type CreditReportingEnrollmentsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
};

export const getCreditReportingEnrollments = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: CreditReportingEnrollmentsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchCreditReportingEnrollments',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchCreditReportingEnrollments({ pageSize, pageNumber, searchQuery,
      statusFilter,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchCreditReportingEnrollments = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: Required<Pick<CreditReportingEnrollmentsListParams, 'pageSize' | 'pageNumber'>> & Omit<CreditReportingEnrollmentsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<CreditReportingEnrollment>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/creditreportingenrollment/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch creditReportingEnrollments');
  }
};

export const getCreditReportingEnrollment = async (id?: string): Promise<CreditReportingEnrollment> => {
  try {
    const url = `${BASE_URL}api/creditreportingenrollment/getCreditReportingEnrollmentById/${id}`;
    const response = await axios.get(url);
    return response.data as CreditReportingEnrollment;
  } catch (error) {
    handleApiError(error, 'get creditReportingEnrollment');
    throw error;
  }
};

export const createCreditReportingEnrollment = async (CreditReportingEnrollment?: CreditReportingEnrollment): Promise<CreditReportingEnrollment> => {
  try {
    const url = `${BASE_URL}api/creditreportingenrollment/createCreditReportingEnrollment`;
    const response = await axios.post(url, CreditReportingEnrollment);
    return response.data as CreditReportingEnrollment;
  } catch (error) {
    handleApiError(error, 'create creditReportingEnrollment');
    throw error;
  }
};

export const updateCreditReportingEnrollment = async (creditReportingEnrollment?: CreditReportingEnrollment): Promise<CreditReportingEnrollment> => {
  try {
    const id = ((creditReportingEnrollment as any)?.creditReportingEnrollmentID ?? '').toString();
    const url = `${BASE_URL}api/creditreportingenrollment/updateCreditReportingEnrollment/${id}`;
    const response = await axios.put(url, creditReportingEnrollment);
    return response.data as CreditReportingEnrollment;
  } catch (error) {
    handleApiError(error, 'update creditReportingEnrollment');
    throw error;
  }
};

export const deleteCreditReportingEnrollment = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/creditreportingenrollment/deleteCreditReportingEnrollment/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete creditReportingEnrollment');
  }
};

export const fireCreditReportingEnrollmentAction = async (id?: string, status?: string): Promise<CreditReportingEnrollment> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/creditreportingenrollment/updateCreditReportingEnrollmentStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/creditreportingenrollment/updatecreditreportingenrollmentstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/CREDITREPORTINGENROLLMENT/UpdateCreditReportingEnrollmentStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as CreditReportingEnrollment;
  } catch (error) {
    handleApiError(error, 'fire creditReportingEnrollment action');
    throw error;
  }
};

