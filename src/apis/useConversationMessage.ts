{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { ConversationMessage } from "../types/ConversationMessage";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type ConversationMessagesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getConversationMessages = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: ConversationMessagesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchConversationMessages',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchConversationMessages({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchConversationMessages = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<ConversationMessagesListParams, 'pageSize' | 'pageNumber'>> & Omit<ConversationMessagesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<ConversationMessage>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/conversationmessage/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch conversationMessages');
  }
};

export const getConversationMessage = async (id?: string): Promise<ConversationMessage> => {
  try {
    const url = `${BASE_URL}api/conversationmessage/getConversationMessageById/${id}`;
    const response = await axios.get(url);
    return response.data as ConversationMessage;
  } catch (error) {
    handleApiError(error, 'get conversationMessage');
    throw error;
  }
};

export const createConversationMessage = async (ConversationMessage?: ConversationMessage): Promise<ConversationMessage> => {
  try {
    const url = `${BASE_URL}api/conversationmessage/createConversationMessage`;
    const response = await axios.post(url, ConversationMessage);
    return response.data as ConversationMessage;
  } catch (error) {
    handleApiError(error, 'create conversationMessage');
    throw error;
  }
};

export const updateConversationMessage = async (conversationMessage?: ConversationMessage): Promise<ConversationMessage> => {
  try {
    const id = ((conversationMessage as any)?.conversationMessageID ?? '').toString();
    const url = `${BASE_URL}api/conversationmessage/updateConversationMessage/${id}`;
    const response = await axios.put(url, conversationMessage);
    return response.data as ConversationMessage;
  } catch (error) {
    handleApiError(error, 'update conversationMessage');
    throw error;
  }
};

export const deleteConversationMessage = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/conversationmessage/deleteConversationMessage/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete conversationMessage');
  }
};

