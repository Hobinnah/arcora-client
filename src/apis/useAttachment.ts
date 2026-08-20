{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Attachment } from "../types/Attachment";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type AttachmentsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getAttachments = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: AttachmentsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchAttachments',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchAttachments({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchAttachments = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<AttachmentsListParams, 'pageSize' | 'pageNumber'>> & Omit<AttachmentsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Attachment>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/attachment/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch attachments');
  }
};

export const getAttachment = async (id?: string): Promise<Attachment> => {
  try {
    const url = `${BASE_URL}api/attachment/getAttachmentById/${id}`;
    const response = await axios.get(url);
    return response.data as Attachment;
  } catch (error) {
    handleApiError(error, 'get attachment');
    throw error;
  }
};

export const createAttachment = async (Attachment?: Attachment): Promise<Attachment> => {
  try {
    const url = `${BASE_URL}api/attachment/createAttachment`;
    const response = await axios.post(url, Attachment);
    return response.data as Attachment;
  } catch (error) {
    handleApiError(error, 'create attachment');
    throw error;
  }
};

export const updateAttachment = async (attachment?: Attachment): Promise<Attachment> => {
  try {
    const id = ((attachment as any)?.attachmentID ?? '').toString();
    const url = `${BASE_URL}api/attachment/updateAttachment/${id}`;
    const response = await axios.put(url, attachment);
    return response.data as Attachment;
  } catch (error) {
    handleApiError(error, 'update attachment');
    throw error;
  }
};

export const deleteAttachment = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/attachment/deleteAttachment/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete attachment');
  }
};

