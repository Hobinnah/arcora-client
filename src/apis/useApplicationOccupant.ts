{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { ApplicationOccupant } from "../types/ApplicationOccupant";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type ApplicationOccupantsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  occupantType?: string;
};

export const getApplicationOccupants = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  occupantType,
  sortBy,
  sortDirection
}: ApplicationOccupantsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchApplicationOccupants',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        occupantType,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchApplicationOccupants({ pageSize, pageNumber, searchQuery,
      statusFilter,
      occupantType,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchApplicationOccupants = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  occupantType,
  sortBy,
  sortDirection
}: Required<Pick<ApplicationOccupantsListParams, 'pageSize' | 'pageNumber'>> & Omit<ApplicationOccupantsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<ApplicationOccupant>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/applicationoccupant/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (occupantType) { url += `&occupantType=${encodeURIComponent(occupantType)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch applicationOccupants');
  }
};

export const getApplicationOccupant = async (id?: string): Promise<ApplicationOccupant> => {
  try {
    const url = `${BASE_URL}api/applicationoccupant/getApplicationOccupantById/${id}`;
    const response = await axios.get(url);
    return response.data as ApplicationOccupant;
  } catch (error) {
    handleApiError(error, 'get applicationOccupant');
    throw error;
  }
};

export const createApplicationOccupant = async (ApplicationOccupant?: ApplicationOccupant): Promise<ApplicationOccupant> => {
  try {
    const url = `${BASE_URL}api/applicationoccupant/createApplicationOccupant`;
    const response = await axios.post(url, ApplicationOccupant);
    return response.data as ApplicationOccupant;
  } catch (error) {
    handleApiError(error, 'create applicationOccupant');
    throw error;
  }
};

export const updateApplicationOccupant = async (applicationOccupant?: ApplicationOccupant): Promise<ApplicationOccupant> => {
  try {
    const id = ((applicationOccupant as any)?.applicationOccupantID ?? '').toString();
    const url = `${BASE_URL}api/applicationoccupant/updateApplicationOccupant/${id}`;
    const response = await axios.put(url, applicationOccupant);
    return response.data as ApplicationOccupant;
  } catch (error) {
    handleApiError(error, 'update applicationOccupant');
    throw error;
  }
};

export const deleteApplicationOccupant = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/applicationoccupant/deleteApplicationOccupant/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete applicationOccupant');
  }
};

export const fireApplicationOccupantAction = async (id?: string, status?: string): Promise<ApplicationOccupant> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/applicationoccupant/updateApplicationOccupantStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/applicationoccupant/updateapplicationoccupantstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/APPLICATIONOCCUPANT/UpdateApplicationOccupantStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as ApplicationOccupant;
  } catch (error) {
    handleApiError(error, 'fire applicationOccupant action');
    throw error;
  }
};

