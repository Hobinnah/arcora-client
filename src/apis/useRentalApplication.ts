{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { RentalApplication } from "../types/RentalApplication";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type RentalApplicationsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  screeningStatus?: string;
  tenantID?: string;
  listingID?: string;
  organizationID?: string;
};

export const getRentalApplications = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  screeningStatus,
  tenantID,
  listingID,
  organizationID,
  sortBy,
  sortDirection
}: RentalApplicationsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchRentalApplications',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        screeningStatus,
        tenantID,
        listingID,
        organizationID,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchRentalApplications({ pageSize, pageNumber, searchQuery,
      statusFilter,
      screeningStatus,
      tenantID,
      listingID,
      organizationID,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchRentalApplications = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  screeningStatus,
  tenantID,
  listingID,
  organizationID,
  sortBy,
  sortDirection
}: Required<Pick<RentalApplicationsListParams, 'pageSize' | 'pageNumber'>> & Omit<RentalApplicationsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<RentalApplication>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/rentalapplication/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (screeningStatus) { url += `&screeningStatus=${encodeURIComponent(screeningStatus)}`; }
    if (tenantID) { url += `&tenantID=${encodeURIComponent(tenantID)}`; }
    if (listingID) { url += `&listingID=${encodeURIComponent(listingID)}`; }
    if (organizationID) { url += `&organizationID=${encodeURIComponent(organizationID)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch rentalApplications');
  }
};

export const getRentalApplication = async (id?: string): Promise<RentalApplication> => {
  try {
    const url = `${BASE_URL}api/rentalapplication/getRentalApplicationById/${id}`;
    const response = await axios.get(url);
    return response.data as RentalApplication;
  } catch (error) {
    handleApiError(error, 'get rentalApplication');
    throw error;
  }
};

export const createRentalApplication = async (RentalApplication?: RentalApplication): Promise<RentalApplication> => {
  try {
    const url = `${BASE_URL}api/rentalapplication/createRentalApplication`;
    const response = await axios.post(url, RentalApplication);
    return response.data as RentalApplication;
  } catch (error) {
    handleApiError(error, 'create rentalApplication');
    throw error;
  }
};

export const updateRentalApplication = async (rentalApplication?: RentalApplication): Promise<RentalApplication> => {
  try {
    const id = ((rentalApplication as any)?.rentalApplicationID ?? '').toString();
    const url = `${BASE_URL}api/rentalapplication/updateRentalApplication/${id}`;
    const response = await axios.put(url, rentalApplication);
    return response.data as RentalApplication;
  } catch (error) {
    handleApiError(error, 'update rentalApplication');
    throw error;
  }
};

export const deleteRentalApplication = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/rentalapplication/deleteRentalApplication/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete rentalApplication');
  }
};

export const fireRentalApplicationAction = async (id?: string, status?: string): Promise<RentalApplication> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/rentalapplication/updateRentalApplicationStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/rentalapplication/updaterentalapplicationstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/RENTALAPPLICATION/UpdateRentalApplicationStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as RentalApplication;
  } catch (error) {
    handleApiError(error, 'fire rentalApplication action');
    throw error;
  }
};

