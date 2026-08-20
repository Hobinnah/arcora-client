{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { OrganizationStatement } from "../types/OrganizationStatement";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type OrganizationStatementsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  period?: string;
};

export const getOrganizationStatements = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  period,
  sortBy,
  sortDirection
}: OrganizationStatementsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchOrganizationStatements',
      { pageSize, pageNumber, searchQuery,
        period,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchOrganizationStatements({ pageSize, pageNumber, searchQuery,
      period,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchOrganizationStatements = async ({
  pageSize,
  pageNumber,
  searchQuery,
  period,
  sortBy,
  sortDirection
}: Required<Pick<OrganizationStatementsListParams, 'pageSize' | 'pageNumber'>> & Omit<OrganizationStatementsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<OrganizationStatement>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/organizationstatement/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (period) { url += `&period=${encodeURIComponent(period)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch organizationStatements');
  }
};

export const getOrganizationStatement = async (id?: string): Promise<OrganizationStatement> => {
  try {
    const url = `${BASE_URL}api/organizationstatement/getOrganizationStatementById/${id}`;
    const response = await axios.get(url);
    return response.data as OrganizationStatement;
  } catch (error) {
    handleApiError(error, 'get organizationStatement');
    throw error;
  }
};

export const createOrganizationStatement = async (OrganizationStatement?: OrganizationStatement): Promise<OrganizationStatement> => {
  try {
    const url = `${BASE_URL}api/organizationstatement/createOrganizationStatement`;
    const response = await axios.post(url, OrganizationStatement);
    return response.data as OrganizationStatement;
  } catch (error) {
    handleApiError(error, 'create organizationStatement');
    throw error;
  }
};

export const updateOrganizationStatement = async (organizationStatement?: OrganizationStatement): Promise<OrganizationStatement> => {
  try {
    const id = ((organizationStatement as any)?.organizationStatementID ?? '').toString();
    const url = `${BASE_URL}api/organizationstatement/updateOrganizationStatement/${id}`;
    const response = await axios.put(url, organizationStatement);
    return response.data as OrganizationStatement;
  } catch (error) {
    handleApiError(error, 'update organizationStatement');
    throw error;
  }
};

export const deleteOrganizationStatement = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/organizationstatement/deleteOrganizationStatement/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete organizationStatement');
  }
};

