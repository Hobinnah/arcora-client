{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Inspection } from "../types/Inspection";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type InspectionsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  inspectionType?: string;
};

export const getInspections = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  inspectionType,
  sortBy,
  sortDirection
}: InspectionsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchInspections',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        inspectionType,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchInspections({ pageSize, pageNumber, searchQuery,
      statusFilter,
      inspectionType,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchInspections = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  inspectionType,
  sortBy,
  sortDirection
}: Required<Pick<InspectionsListParams, 'pageSize' | 'pageNumber'>> & Omit<InspectionsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Inspection>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/inspection/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (inspectionType) { url += `&inspectionType=${encodeURIComponent(inspectionType)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch inspections');
  }
};

export const getInspection = async (id?: string): Promise<Inspection> => {
  try {
    const url = `${BASE_URL}api/inspection/getInspectionById/${id}`;
    const response = await axios.get(url);
    return response.data as Inspection;
  } catch (error) {
    handleApiError(error, 'get inspection');
    throw error;
  }
};

export const createInspection = async (Inspection?: Inspection): Promise<Inspection> => {
  try {
    const url = `${BASE_URL}api/inspection/createInspection`;
    const response = await axios.post(url, Inspection);
    return response.data as Inspection;
  } catch (error) {
    handleApiError(error, 'create inspection');
    throw error;
  }
};

export const updateInspection = async (inspection?: Inspection): Promise<Inspection> => {
  try {
    const id = ((inspection as any)?.inspectionID ?? '').toString();
    const url = `${BASE_URL}api/inspection/updateInspection/${id}`;
    const response = await axios.put(url, inspection);
    return response.data as Inspection;
  } catch (error) {
    handleApiError(error, 'update inspection');
    throw error;
  }
};

export const deleteInspection = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/inspection/deleteInspection/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete inspection');
  }
};

export const fireInspectionAction = async (id?: string, status?: string): Promise<Inspection> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/inspection/updateInspectionStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/inspection/updateinspectionstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/INSPECTION/UpdateInspectionStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as Inspection;
  } catch (error) {
    handleApiError(error, 'fire inspection action');
    throw error;
  }
};

