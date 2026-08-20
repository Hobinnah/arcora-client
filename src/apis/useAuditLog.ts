{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { AuditLog } from "../types/AuditLog";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type AuditLogsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getAuditLogs = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: AuditLogsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchAuditLogs',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchAuditLogs({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchAuditLogs = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<AuditLogsListParams, 'pageSize' | 'pageNumber'>> & Omit<AuditLogsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<AuditLog>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/auditlog/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch auditLogs');
  }
};

export const getAuditLog = async (id?: string): Promise<AuditLog> => {
  try {
    const url = `${BASE_URL}api/auditlog/getAuditLogById/${id}`;
    const response = await axios.get(url);
    return response.data as AuditLog;
  } catch (error) {
    handleApiError(error, 'get auditLog');
    throw error;
  }
};

export const createAuditLog = async (AuditLog?: AuditLog): Promise<AuditLog> => {
  try {
    const url = `${BASE_URL}api/auditlog/createAuditLog`;
    const response = await axios.post(url, AuditLog);
    return response.data as AuditLog;
  } catch (error) {
    handleApiError(error, 'create auditLog');
    throw error;
  }
};

export const updateAuditLog = async (auditLog?: AuditLog): Promise<AuditLog> => {
  try {
    const id = ((auditLog as any)?.auditLogID ?? '').toString();
    const url = `${BASE_URL}api/auditlog/updateAuditLog/${id}`;
    const response = await axios.put(url, auditLog);
    return response.data as AuditLog;
  } catch (error) {
    handleApiError(error, 'update auditLog');
    throw error;
  }
};

export const deleteAuditLog = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/auditlog/deleteAuditLog/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete auditLog');
  }
};

