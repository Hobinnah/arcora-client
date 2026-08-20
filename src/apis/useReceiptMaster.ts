{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { ReceiptMaster } from "../types/ReceiptMaster";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type ReceiptMastersListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getReceiptMasters = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: ReceiptMastersListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchReceiptMasters',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchReceiptMasters({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchReceiptMasters = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<ReceiptMastersListParams, 'pageSize' | 'pageNumber'>> & Omit<ReceiptMastersListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<ReceiptMaster>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/receiptmaster/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch receiptMasters');
  }
};

export const getReceiptMaster = async (id?: string): Promise<ReceiptMaster> => {
  try {
    const url = `${BASE_URL}api/receiptmaster/getReceiptMasterById/${id}`;
    const response = await axios.get(url);
    return response.data as ReceiptMaster;
  } catch (error) {
    handleApiError(error, 'get receiptMaster');
    throw error;
  }
};

export const createReceiptMaster = async (ReceiptMaster?: ReceiptMaster): Promise<ReceiptMaster> => {
  try {
    const url = `${BASE_URL}api/receiptmaster/createReceiptMaster`;
    const response = await axios.post(url, ReceiptMaster);
    return response.data as ReceiptMaster;
  } catch (error) {
    handleApiError(error, 'create receiptMaster');
    throw error;
  }
};

export const updateReceiptMaster = async (receiptMaster?: ReceiptMaster): Promise<ReceiptMaster> => {
  try {
    const id = ((receiptMaster as any)?.receiptMasterID ?? '').toString();
    const url = `${BASE_URL}api/receiptmaster/updateReceiptMaster/${id}`;
    const response = await axios.put(url, receiptMaster);
    return response.data as ReceiptMaster;
  } catch (error) {
    handleApiError(error, 'update receiptMaster');
    throw error;
  }
};

export const deleteReceiptMaster = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/receiptmaster/deleteReceiptMaster/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete receiptMaster');
  }
};

