{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { LeaseDocuments } from "../types/LeaseDocuments";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type LeaseDocumentUploadInput = {
  file: File;
  listingID?: string;
  tenantID?: string;
  rentalApplicationID?: string;
  capturedBy: string;
  documentType: string;
  documentStatus: string;
  isPrimary: boolean;
};

export const uploadLeaseDocument = async ({
  file,
  listingID,
  tenantID,
  rentalApplicationID,
  capturedBy,
  documentType,
  documentStatus,
  isPrimary,
}: LeaseDocumentUploadInput): Promise<LeaseDocuments> => {
  try {
    const formData = new FormData();
    formData.append('File', file);
    if (listingID) formData.append('ListingID', listingID);
    if (tenantID) formData.append('TenantID', tenantID);
    if (rentalApplicationID) formData.append('RentalApplicationID', rentalApplicationID);
    formData.append('CapturedBy', capturedBy);
    formData.append('DocumentType', documentType);
    formData.append('DocumentStatus', documentStatus);
    formData.append('IsPrimary', String(isPrimary));
    const response = await axios.post(`${BASE_URL}api/leasedocuments/Upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data as LeaseDocuments;
  } catch (error) {
    return handleApiError(error, 'upload lease document');
  }
};

export type LeaseDocumentsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  documentStatus?: string;
  documentType?: string;
};

export const getLeaseDocuments = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  documentStatus,
  documentType,
  sortBy,
  sortDirection
}: LeaseDocumentsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchLeaseDocuments',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        documentStatus,
        documentType,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchLeaseDocuments({ pageSize, pageNumber, searchQuery,
      statusFilter,
      documentStatus,
      documentType,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchLeaseDocuments = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  documentStatus,
  documentType,
  sortBy,
  sortDirection
}: Required<Pick<LeaseDocumentsListParams, 'pageSize' | 'pageNumber'>> & Omit<LeaseDocumentsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<LeaseDocuments>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/leasedocuments/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (documentStatus) { url += `&documentStatus=${encodeURIComponent(documentStatus)}`; }
    if (documentType) { url += `&documentType=${encodeURIComponent(documentType)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch leaseDocuments');
  }
};

export const getLeaseDocumentsById = async (id?: string): Promise<LeaseDocuments> => {
  try {
    const url = `${BASE_URL}api/leasedocuments/getLeaseDocumentsById/${id}`;
    const response = await axios.get(url);
    return response.data as LeaseDocuments;
  } catch (error) {
    handleApiError(error, 'get leaseDocuments');
    throw error;
  }
};

export const createLeaseDocuments = async (LeaseDocuments?: LeaseDocuments): Promise<LeaseDocuments> => {
  try {
    const url = `${BASE_URL}api/leasedocuments/createLeaseDocuments`;
    const response = await axios.post(url, LeaseDocuments);
    return response.data as LeaseDocuments;
  } catch (error) {
    handleApiError(error, 'create leaseDocuments');
    throw error;
  }
};

export const updateLeaseDocuments = async (leaseDocuments?: LeaseDocuments): Promise<LeaseDocuments> => {
  try {
    const id = ((leaseDocuments as any)?.leaseDocumentID ?? '').toString();
    const url = `${BASE_URL}api/leasedocuments/updateLeaseDocuments/${id}`;
    const response = await axios.put(url, leaseDocuments);
    return response.data as LeaseDocuments;
  } catch (error) {
    handleApiError(error, 'update leaseDocuments');
    throw error;
  }
};

export const deleteLeaseDocuments = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/leasedocuments/deleteLeaseDocuments/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete leaseDocuments');
  }
};

export const fireLeaseDocumentsAction = async (id?: string, status?: string): Promise<LeaseDocuments> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/leasedocuments/updateLeaseDocumentsStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/leasedocuments/updateleasedocumentsstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/LEASEDOCUMENTS/UpdateLeaseDocumentsStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as LeaseDocuments;
  } catch (error) {
    handleApiError(error, 'fire leaseDocuments action');
    throw error;
  }
};

