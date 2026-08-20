{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { RentalUnit } from "../types/RentalUnit";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type RentalUnitsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  unitTypeID?: string;
};

export const getRentalUnits = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  unitTypeID,
  sortBy,
  sortDirection
}: RentalUnitsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchRentalUnits',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        unitTypeID,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchRentalUnits({ pageSize, pageNumber, searchQuery,
      statusFilter,
      unitTypeID,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchRentalUnits = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  unitTypeID,
  sortBy,
  sortDirection
}: Required<Pick<RentalUnitsListParams, 'pageSize' | 'pageNumber'>> & Omit<RentalUnitsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<RentalUnit>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/rentalunit/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (unitTypeID) { url += `&unitTypeID=${encodeURIComponent(unitTypeID)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch rentalUnits');
  }
};

export const getRentalUnit = async (id?: string): Promise<RentalUnit> => {
  try {
    const url = `${BASE_URL}api/rentalunit/getRentalUnitById/${id}`;
    const response = await axios.get(url);
    return response.data as RentalUnit;
  } catch (error) {
    handleApiError(error, 'get rentalUnit');
    throw error;
  }
};

export const createRentalUnit = async (RentalUnit?: RentalUnit): Promise<RentalUnit> => {
  try {
    const url = `${BASE_URL}api/rentalunit/createRentalUnit`;
    const response = await axios.post(url, RentalUnit);
    return response.data as RentalUnit;
  } catch (error) {
    handleApiError(error, 'create rentalUnit');
    throw error;
  }
};

export const updateRentalUnit = async (rentalUnit?: RentalUnit): Promise<RentalUnit> => {
  try {
    const id = ((rentalUnit as any)?.rentalUnitID ?? '').toString();
    const url = `${BASE_URL}api/rentalunit/updateRentalUnit/${id}`;
    const response = await axios.put(url, rentalUnit);
    return response.data as RentalUnit;
  } catch (error) {
    handleApiError(error, 'update rentalUnit');
    throw error;
  }
};

export const deleteRentalUnit = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/rentalunit/deleteRentalUnit/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete rentalUnit');
  }
};

export const fireRentalUnitAction = async (id?: string, status?: string): Promise<RentalUnit> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/rentalunit/updateRentalUnitStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/rentalunit/updaterentalunitstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/RENTALUNIT/UpdateRentalUnitStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as RentalUnit;
  } catch (error) {
    handleApiError(error, 'fire rentalUnit action');
    throw error;
  }
};

