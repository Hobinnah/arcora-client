{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { ViewingAppointments } from "../types/ViewingAppointments";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type ViewingAppointmentsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  viewingType?: string;
};

export const getViewingAppointments = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  viewingType,
  sortBy,
  sortDirection
}: ViewingAppointmentsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchViewingAppointments',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        viewingType,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchViewingAppointments({ pageSize, pageNumber, searchQuery,
      statusFilter,
      viewingType,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchViewingAppointments = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  viewingType,
  sortBy,
  sortDirection
}: Required<Pick<ViewingAppointmentsListParams, 'pageSize' | 'pageNumber'>> & Omit<ViewingAppointmentsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<ViewingAppointments>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/viewingappointments/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (viewingType) { url += `&viewingType=${encodeURIComponent(viewingType)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch viewingAppointments');
  }
};

export const getViewingAppointments = async (id?: string): Promise<ViewingAppointments> => {
  try {
    const url = `${BASE_URL}api/viewingappointments/getViewingAppointmentsById/${id}`;
    const response = await axios.get(url);
    return response.data as ViewingAppointments;
  } catch (error) {
    handleApiError(error, 'get viewingAppointments');
    throw error;
  }
};

export const createViewingAppointments = async (ViewingAppointments?: ViewingAppointments): Promise<ViewingAppointments> => {
  try {
    const url = `${BASE_URL}api/viewingappointments/createViewingAppointments`;
    const response = await axios.post(url, ViewingAppointments);
    return response.data as ViewingAppointments;
  } catch (error) {
    handleApiError(error, 'create viewingAppointments');
    throw error;
  }
};

export const updateViewingAppointments = async (viewingAppointments?: ViewingAppointments): Promise<ViewingAppointments> => {
  try {
    const id = ((viewingAppointments as any)?.viewingAppointmentID ?? '').toString();
    const url = `${BASE_URL}api/viewingappointments/updateViewingAppointments/${id}`;
    const response = await axios.put(url, viewingAppointments);
    return response.data as ViewingAppointments;
  } catch (error) {
    handleApiError(error, 'update viewingAppointments');
    throw error;
  }
};

export const deleteViewingAppointments = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/viewingappointments/deleteViewingAppointments/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete viewingAppointments');
  }
};

export const fireViewingAppointmentsAction = async (id?: string, status?: string): Promise<ViewingAppointments> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/viewingappointments/updateViewingAppointmentsStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/viewingappointments/updateviewingappointmentsstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/VIEWINGAPPOINTMENTS/UpdateViewingAppointmentsStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as ViewingAppointments;
  } catch (error) {
    handleApiError(error, 'fire viewingAppointments action');
    throw error;
  }
};

