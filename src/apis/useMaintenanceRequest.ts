{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { MaintenanceRequest } from "../types/MaintenanceRequest";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type MaintenanceRequestsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  priority?: string;
  categoryID?: string;
};

export const getMaintenanceRequests = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  priority,
  categoryID,
  sortBy,
  sortDirection
}: MaintenanceRequestsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchMaintenanceRequests',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        priority,
        categoryID,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchMaintenanceRequests({ pageSize, pageNumber, searchQuery,
      statusFilter,
      priority,
      categoryID,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchMaintenanceRequests = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  priority,
  categoryID,
  sortBy,
  sortDirection
}: Required<Pick<MaintenanceRequestsListParams, 'pageSize' | 'pageNumber'>> & Omit<MaintenanceRequestsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<MaintenanceRequest>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/maintenancerequest/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (priority) { url += `&priority=${encodeURIComponent(priority)}`; }
    if (categoryID) { url += `&categoryID=${encodeURIComponent(categoryID)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch maintenanceRequests');
  }
};

export const getMaintenanceRequest = async (id?: string): Promise<MaintenanceRequest> => {
  try {
    const url = `${BASE_URL}api/maintenancerequest/getMaintenanceRequestById/${id}`;
    const response = await axios.get(url);
    return response.data as MaintenanceRequest;
  } catch (error) {
    handleApiError(error, 'get maintenanceRequest');
    throw error;
  }
};

export const createMaintenanceRequest = async (MaintenanceRequest?: MaintenanceRequest): Promise<MaintenanceRequest> => {
  try {
    const url = `${BASE_URL}api/maintenancerequest/createMaintenanceRequest`;
    const response = await axios.post(url, MaintenanceRequest);
    return response.data as MaintenanceRequest;
  } catch (error) {
    handleApiError(error, 'create maintenanceRequest');
    throw error;
  }
};

export const updateMaintenanceRequest = async (maintenanceRequest?: MaintenanceRequest): Promise<MaintenanceRequest> => {
  try {
    const id = ((maintenanceRequest as any)?.maintenanceRequestID ?? '').toString();
    const url = `${BASE_URL}api/maintenancerequest/updateMaintenanceRequest/${id}`;
    const response = await axios.put(url, maintenanceRequest);
    return response.data as MaintenanceRequest;
  } catch (error) {
    handleApiError(error, 'update maintenanceRequest');
    throw error;
  }
};

export const deleteMaintenanceRequest = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/maintenancerequest/deleteMaintenanceRequest/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete maintenanceRequest');
  }
};

export const fireMaintenanceRequestAction = async (id?: string, status?: string): Promise<MaintenanceRequest> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/maintenancerequest/updateMaintenanceRequestStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/maintenancerequest/updatemaintenancerequeststatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/MAINTENANCEREQUEST/UpdateMaintenanceRequestStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as MaintenanceRequest;
  } catch (error) {
    handleApiError(error, 'fire maintenanceRequest action');
    throw error;
  }
};

