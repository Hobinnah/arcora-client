{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { WorkOrder } from "../types/WorkOrder";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type WorkOrdersListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  currency?: string;
};

export const getWorkOrders = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  currency,
  sortBy,
  sortDirection
}: WorkOrdersListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchWorkOrders',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        currency,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchWorkOrders({ pageSize, pageNumber, searchQuery,
      statusFilter,
      currency,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchWorkOrders = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  currency,
  sortBy,
  sortDirection
}: Required<Pick<WorkOrdersListParams, 'pageSize' | 'pageNumber'>> & Omit<WorkOrdersListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<WorkOrder>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/workorder/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (currency) { url += `&currency=${encodeURIComponent(currency)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch workOrders');
  }
};

export const getWorkOrder = async (id?: string): Promise<WorkOrder> => {
  try {
    const url = `${BASE_URL}api/workorder/getWorkOrderById/${id}`;
    const response = await axios.get(url);
    return response.data as WorkOrder;
  } catch (error) {
    handleApiError(error, 'get workOrder');
    throw error;
  }
};

export const createWorkOrder = async (WorkOrder?: WorkOrder): Promise<WorkOrder> => {
  try {
    const url = `${BASE_URL}api/workorder/createWorkOrder`;
    const response = await axios.post(url, WorkOrder);
    return response.data as WorkOrder;
  } catch (error) {
    handleApiError(error, 'create workOrder');
    throw error;
  }
};

export const updateWorkOrder = async (workOrder?: WorkOrder): Promise<WorkOrder> => {
  try {
    const id = ((workOrder as any)?.workOrderID ?? '').toString();
    const url = `${BASE_URL}api/workorder/updateWorkOrder/${id}`;
    const response = await axios.put(url, workOrder);
    return response.data as WorkOrder;
  } catch (error) {
    handleApiError(error, 'update workOrder');
    throw error;
  }
};

export const deleteWorkOrder = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/workorder/deleteWorkOrder/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete workOrder');
  }
};

export const fireWorkOrderAction = async (id?: string, status?: string): Promise<WorkOrder> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/workorder/updateWorkOrderStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/workorder/updateworkorderstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/WORKORDER/UpdateWorkOrderStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as WorkOrder;
  } catch (error) {
    handleApiError(error, 'fire workOrder action');
    throw error;
  }
};

