{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { ReservationHold } from "../types/ReservationHold";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type ReservationHoldsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
};

export const getReservationHolds = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: ReservationHoldsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchReservationHolds',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchReservationHolds({ pageSize, pageNumber, searchQuery,
      statusFilter,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchReservationHolds = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection
}: Required<Pick<ReservationHoldsListParams, 'pageSize' | 'pageNumber'>> & Omit<ReservationHoldsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<ReservationHold>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/reservationhold/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch reservationHolds');
  }
};

export const getReservationHold = async (id?: string): Promise<ReservationHold> => {
  try {
    const url = `${BASE_URL}api/reservationhold/getReservationHoldById/${id}`;
    const response = await axios.get(url);
    return response.data as ReservationHold;
  } catch (error) {
    handleApiError(error, 'get reservationHold');
    throw error;
  }
};

export const createReservationHold = async (ReservationHold?: ReservationHold): Promise<ReservationHold> => {
  try {
    const url = `${BASE_URL}api/reservationhold/createReservationHold`;
    const response = await axios.post(url, ReservationHold);
    return response.data as ReservationHold;
  } catch (error) {
    handleApiError(error, 'create reservationHold');
    throw error;
  }
};

export const updateReservationHold = async (reservationHold?: ReservationHold): Promise<ReservationHold> => {
  try {
    const id = ((reservationHold as any)?.reservationHoldID ?? '').toString();
    const url = `${BASE_URL}api/reservationhold/updateReservationHold/${id}`;
    const response = await axios.put(url, reservationHold);
    return response.data as ReservationHold;
  } catch (error) {
    handleApiError(error, 'update reservationHold');
    throw error;
  }
};

export const deleteReservationHold = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/reservationhold/deleteReservationHold/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete reservationHold');
  }
};

export const fireReservationHoldAction = async (id?: string, status?: string): Promise<ReservationHold> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/reservationhold/updateReservationHoldStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/reservationhold/updatereservationholdstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/RESERVATIONHOLD/UpdateReservationHoldStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as ReservationHold;
  } catch (error) {
    handleApiError(error, 'fire reservationHold action');
    throw error;
  }
};

