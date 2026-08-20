{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Contractor } from "../types/Contractor";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type ContractorsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  categoryID?: string;
};

export const getContractors = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  categoryID,
  sortBy,
  sortDirection
}: ContractorsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchContractors',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        categoryID,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchContractors({ pageSize, pageNumber, searchQuery,
      statusFilter,
      categoryID,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchContractors = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  categoryID,
  sortBy,
  sortDirection
}: Required<Pick<ContractorsListParams, 'pageSize' | 'pageNumber'>> & Omit<ContractorsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Contractor>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/contractor/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (categoryID) { url += `&categoryID=${encodeURIComponent(categoryID)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch contractors');
  }
};

export const getContractor = async (id?: string): Promise<Contractor> => {
  try {
    const url = `${BASE_URL}api/contractor/getContractorById/${id}`;
    const response = await axios.get(url);
    return response.data as Contractor;
  } catch (error) {
    handleApiError(error, 'get contractor');
    throw error;
  }
};

export const createContractor = async (Contractor?: Contractor): Promise<Contractor> => {
  try {
    const url = `${BASE_URL}api/contractor/createContractor`;
    const response = await axios.post(url, Contractor);
    return response.data as Contractor;
  } catch (error) {
    handleApiError(error, 'create contractor');
    throw error;
  }
};

export const updateContractor = async (contractor?: Contractor): Promise<Contractor> => {
  try {
    const id = ((contractor as any)?.contractorID ?? '').toString();
    const url = `${BASE_URL}api/contractor/updateContractor/${id}`;
    const response = await axios.put(url, contractor);
    return response.data as Contractor;
  } catch (error) {
    handleApiError(error, 'update contractor');
    throw error;
  }
};

export const deleteContractor = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/contractor/deleteContractor/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete contractor');
  }
};

export const fireContractorAction = async (id?: string, status?: string): Promise<Contractor> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/contractor/updateContractorStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/contractor/updatecontractorstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/CONTRACTOR/UpdateContractorStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as Contractor;
  } catch (error) {
    handleApiError(error, 'fire contractor action');
    throw error;
  }
};

