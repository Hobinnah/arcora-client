{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { LeaseDocExtractedTerm } from "../types/LeaseDocExtractedTerm";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type LeaseDocExtractedTermsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  extractionStatus?: string;
};

export const getLeaseDocExtractedTerms = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  extractionStatus,
  sortBy,
  sortDirection
}: LeaseDocExtractedTermsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchLeaseDocExtractedTerms',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        extractionStatus,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchLeaseDocExtractedTerms({ pageSize, pageNumber, searchQuery,
      statusFilter,
      extractionStatus,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchLeaseDocExtractedTerms = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  extractionStatus,
  sortBy,
  sortDirection
}: Required<Pick<LeaseDocExtractedTermsListParams, 'pageSize' | 'pageNumber'>> & Omit<LeaseDocExtractedTermsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<LeaseDocExtractedTerm>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/leasedocextractedterm/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (extractionStatus) { url += `&extractionStatus=${encodeURIComponent(extractionStatus)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch leaseDocExtractedTerms');
  }
};

export const getLeaseDocExtractedTerm = async (id?: string): Promise<LeaseDocExtractedTerm> => {
  try {
    const url = `${BASE_URL}api/leasedocextractedterm/getLeaseDocExtractedTermById/${id}`;
    const response = await axios.get(url);
    return response.data as LeaseDocExtractedTerm;
  } catch (error) {
    handleApiError(error, 'get leaseDocExtractedTerm');
    throw error;
  }
};

export const createLeaseDocExtractedTerm = async (LeaseDocExtractedTerm?: LeaseDocExtractedTerm): Promise<LeaseDocExtractedTerm> => {
  try {
    const url = `${BASE_URL}api/leasedocextractedterm/createLeaseDocExtractedTerm`;
    const response = await axios.post(url, LeaseDocExtractedTerm);
    return response.data as LeaseDocExtractedTerm;
  } catch (error) {
    handleApiError(error, 'create leaseDocExtractedTerm');
    throw error;
  }
};

export const updateLeaseDocExtractedTerm = async (leaseDocExtractedTerm?: LeaseDocExtractedTerm): Promise<LeaseDocExtractedTerm> => {
  try {
    const id = ((leaseDocExtractedTerm as any)?.leaseDocExtractedTermID ?? '').toString();
    const url = `${BASE_URL}api/leasedocextractedterm/updateLeaseDocExtractedTerm/${id}`;
    const response = await axios.put(url, leaseDocExtractedTerm);
    return response.data as LeaseDocExtractedTerm;
  } catch (error) {
    handleApiError(error, 'update leaseDocExtractedTerm');
    throw error;
  }
};

export const deleteLeaseDocExtractedTerm = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/leasedocextractedterm/deleteLeaseDocExtractedTerm/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete leaseDocExtractedTerm');
  }
};

export const fireLeaseDocExtractedTermAction = async (id?: string, status?: string): Promise<LeaseDocExtractedTerm> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/leasedocextractedterm/updateLeaseDocExtractedTermStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/leasedocextractedterm/updateleasedocextractedtermstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/LEASEDOCEXTRACTEDTERM/UpdateLeaseDocExtractedTermStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as LeaseDocExtractedTerm;
  } catch (error) {
    handleApiError(error, 'fire leaseDocExtractedTerm action');
    throw error;
  }
};

