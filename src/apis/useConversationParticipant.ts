{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { ConversationParticipant } from "../types/ConversationParticipant";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type ConversationParticipantsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getConversationParticipants = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: ConversationParticipantsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchConversationParticipants',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchConversationParticipants({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchConversationParticipants = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<ConversationParticipantsListParams, 'pageSize' | 'pageNumber'>> & Omit<ConversationParticipantsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<ConversationParticipant>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/conversationparticipant/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch conversationParticipants');
  }
};

export const getConversationParticipant = async (id?: string): Promise<ConversationParticipant> => {
  try {
    const url = `${BASE_URL}api/conversationparticipant/getConversationParticipantById/${id}`;
    const response = await axios.get(url);
    return response.data as ConversationParticipant;
  } catch (error) {
    handleApiError(error, 'get conversationParticipant');
    throw error;
  }
};

export const createConversationParticipant = async (ConversationParticipant?: ConversationParticipant): Promise<ConversationParticipant> => {
  try {
    const url = `${BASE_URL}api/conversationparticipant/createConversationParticipant`;
    const response = await axios.post(url, ConversationParticipant);
    return response.data as ConversationParticipant;
  } catch (error) {
    handleApiError(error, 'create conversationParticipant');
    throw error;
  }
};

export const updateConversationParticipant = async (conversationParticipant?: ConversationParticipant): Promise<ConversationParticipant> => {
  try {
    const id = ((conversationParticipant as any)?.conversationParticipantID ?? '').toString();
    const url = `${BASE_URL}api/conversationparticipant/updateConversationParticipant/${id}`;
    const response = await axios.put(url, conversationParticipant);
    return response.data as ConversationParticipant;
  } catch (error) {
    handleApiError(error, 'update conversationParticipant');
    throw error;
  }
};

export const deleteConversationParticipant = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/conversationparticipant/deleteConversationParticipant/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete conversationParticipant');
  }
};

