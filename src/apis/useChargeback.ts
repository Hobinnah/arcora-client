{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Chargeback } from "../types/Chargeback";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type ChargebacksListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
};

export const getChargebacks = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: ChargebacksListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchChargebacks',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchChargebacks({ pageSize, pageNumber, searchQuery,
      statusFilter,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchChargebacks = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: Required<Pick<ChargebacksListParams, 'pageSize' | 'pageNumber'>> & Omit<ChargebacksListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Chargeback>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/chargeback/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch chargebacks');
  }
};

export const getChargeback = async (id?: string): Promise<Chargeback> => {
  try {
    const url = `${BASE_URL}api/chargeback/getChargebackById/${id}`;
    const response = await axios.get(url);
    return response.data as Chargeback;
  } catch (error) {
    handleApiError(error, 'get chargeback');
    throw error;
  }
};

export const createChargeback = async (Chargeback?: Chargeback): Promise<Chargeback> => {
  try {
    const url = `${BASE_URL}api/chargeback/createChargeback`;
    const response = await axios.post(url, Chargeback);
    return response.data as Chargeback;
  } catch (error) {
    handleApiError(error, 'create chargeback');
    throw error;
  }
};

export const updateChargeback = async (chargeback?: Chargeback): Promise<Chargeback> => {
  try {
    const id = ((chargeback as any)?.chargebackID ?? '').toString();
    const url = `${BASE_URL}api/chargeback/updateChargeback/${id}`;
    const response = await axios.put(url, chargeback);
    return response.data as Chargeback;
  } catch (error) {
    handleApiError(error, 'update chargeback');
    throw error;
  }
};

export const deleteChargeback = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/chargeback/deleteChargeback/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete chargeback');
  }
};

export const fireChargebackAction = async (id?: string, status?: string): Promise<Chargeback> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/chargeback/updateChargebackStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/chargeback/updatechargebackstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/CHARGEBACK/UpdateChargebackStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as Chargeback;
  } catch (error) {
    handleApiError(error, 'fire chargeback action');
    throw error;
  }
};

