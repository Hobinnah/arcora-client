{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { UnitType } from "../types/UnitType";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type UnitTypesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getUnitTypes = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: UnitTypesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchUnitTypes',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchUnitTypes({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchUnitTypes = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<UnitTypesListParams, 'pageSize' | 'pageNumber'>> & Omit<UnitTypesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<UnitType>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/unittype/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch unitTypes');
  }
};

export const getUnitType = async (id?: string): Promise<UnitType> => {
  try {
    const url = `${BASE_URL}api/unittype/getUnitTypeById/${id}`;
    const response = await axios.get(url);
    return response.data as UnitType;
  } catch (error) {
    handleApiError(error, 'get unitType');
    throw error;
  }
};

export const createUnitType = async (UnitType?: UnitType): Promise<UnitType> => {
  try {
    const url = `${BASE_URL}api/unittype/createUnitType`;
    const response = await axios.post(url, UnitType);
    return response.data as UnitType;
  } catch (error) {
    handleApiError(error, 'create unitType');
    throw error;
  }
};

export const updateUnitType = async (unitType?: UnitType): Promise<UnitType> => {
  try {
    const id = ((unitType as any)?.unitTypeID ?? '').toString();
    const url = `${BASE_URL}api/unittype/updateUnitType/${id}`;
    const response = await axios.put(url, unitType);
    return response.data as UnitType;
  } catch (error) {
    handleApiError(error, 'update unitType');
    throw error;
  }
};

export const deleteUnitType = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/unittype/deleteUnitType/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete unitType');
  }
};

