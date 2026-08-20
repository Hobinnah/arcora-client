{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { AutopayMandate } from "../types/AutopayMandate";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type AutopayMandatesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  mandateType?: string;
  frequency?: string;
};

export const getAutopayMandates = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  mandateType,
  frequency,
  sortBy,
  sortDirection
}: AutopayMandatesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchAutopayMandates',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        mandateType,
        frequency,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchAutopayMandates({ pageSize, pageNumber, searchQuery,
      statusFilter,
      mandateType,
      frequency,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchAutopayMandates = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  mandateType,
  frequency,
  sortBy,
  sortDirection
}: Required<Pick<AutopayMandatesListParams, 'pageSize' | 'pageNumber'>> & Omit<AutopayMandatesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<AutopayMandate>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/autopaymandate/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (mandateType) { url += `&mandateType=${encodeURIComponent(mandateType)}`; }
    if (frequency) { url += `&frequency=${encodeURIComponent(frequency)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch autopayMandates');
  }
};

export const getAutopayMandate = async (id?: string): Promise<AutopayMandate> => {
  try {
    const url = `${BASE_URL}api/autopaymandate/getAutopayMandateById/${id}`;
    const response = await axios.get(url);
    return response.data as AutopayMandate;
  } catch (error) {
    handleApiError(error, 'get autopayMandate');
    throw error;
  }
};

export const createAutopayMandate = async (AutopayMandate?: AutopayMandate): Promise<AutopayMandate> => {
  try {
    const url = `${BASE_URL}api/autopaymandate/createAutopayMandate`;
    const response = await axios.post(url, AutopayMandate);
    return response.data as AutopayMandate;
  } catch (error) {
    handleApiError(error, 'create autopayMandate');
    throw error;
  }
};

export const updateAutopayMandate = async (autopayMandate?: AutopayMandate): Promise<AutopayMandate> => {
  try {
    const id = ((autopayMandate as any)?.autopayMandateID ?? '').toString();
    const url = `${BASE_URL}api/autopaymandate/updateAutopayMandate/${id}`;
    const response = await axios.put(url, autopayMandate);
    return response.data as AutopayMandate;
  } catch (error) {
    handleApiError(error, 'update autopayMandate');
    throw error;
  }
};

export const deleteAutopayMandate = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/autopaymandate/deleteAutopayMandate/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete autopayMandate');
  }
};

export const fireAutopayMandateAction = async (id?: string, status?: string): Promise<AutopayMandate> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/autopaymandate/updateAutopayMandateStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/autopaymandate/updateautopaymandatestatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/AUTOPAYMANDATE/UpdateAutopayMandateStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as AutopayMandate;
  } catch (error) {
    handleApiError(error, 'fire autopayMandate action');
    throw error;
  }
};

