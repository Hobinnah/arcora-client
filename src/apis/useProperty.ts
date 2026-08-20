{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Property } from "../types/Property";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type PropertiesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  propertyType?: string;
};

export const getProperties = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  propertyType,
  sortBy,
  sortDirection
}: PropertiesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchProperties',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        propertyType,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchProperties({ pageSize, pageNumber, searchQuery,
      statusFilter,
      propertyType,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchProperties = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  propertyType,
  sortBy,
  sortDirection
}: Required<Pick<PropertiesListParams, 'pageSize' | 'pageNumber'>> & Omit<PropertiesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Property>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/property/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (propertyType) { url += `&propertyType=${encodeURIComponent(propertyType)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch properties');
  }
};

export const getProperty = async (id?: string): Promise<Property> => {
  try {
    const url = `${BASE_URL}api/property/getPropertyById/${id}`;
    const response = await axios.get(url);
    return response.data as Property;
  } catch (error) {
    handleApiError(error, 'get property');
    throw error;
  }
};

export const createProperty = async (Property?: Property): Promise<Property> => {
  try {
    const url = `${BASE_URL}api/property/createProperty`;
    const response = await axios.post(url, Property);
    return response.data as Property;
  } catch (error) {
    handleApiError(error, 'create property');
    throw error;
  }
};

export const updateProperty = async (property?: Property): Promise<Property> => {
  try {
    const id = ((property as any)?.propertyID ?? '').toString();
    const url = `${BASE_URL}api/property/updateProperty/${id}`;
    const response = await axios.put(url, property);
    return response.data as Property;
  } catch (error) {
    handleApiError(error, 'update property');
    throw error;
  }
};

export const deleteProperty = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/property/deleteProperty/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete property');
  }
};

export const firePropertyAction = async (id?: string, status?: string): Promise<Property> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/property/updatePropertyStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/property/updatepropertystatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/PROPERTY/UpdatePropertyStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as Property;
  } catch (error) {
    handleApiError(error, 'fire property action');
    throw error;
  }
};

