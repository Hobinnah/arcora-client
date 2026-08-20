{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Conversation } from "../types/Conversation";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type ConversationsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  conversationType?: string;
};

export const getConversations = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  conversationType,
  sortBy,
  sortDirection
}: ConversationsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchConversations',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        conversationType,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchConversations({ pageSize, pageNumber, searchQuery,
      statusFilter,
      conversationType,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchConversations = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  conversationType,
  sortBy,
  sortDirection
}: Required<Pick<ConversationsListParams, 'pageSize' | 'pageNumber'>> & Omit<ConversationsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Conversation>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/conversation/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (conversationType) { url += `&conversationType=${encodeURIComponent(conversationType)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch conversations');
  }
};

export const getConversation = async (id?: string): Promise<Conversation> => {
  try {
    const url = `${BASE_URL}api/conversation/getConversationById/${id}`;
    const response = await axios.get(url);
    return response.data as Conversation;
  } catch (error) {
    handleApiError(error, 'get conversation');
    throw error;
  }
};

export const createConversation = async (Conversation?: Conversation): Promise<Conversation> => {
  try {
    const url = `${BASE_URL}api/conversation/createConversation`;
    const response = await axios.post(url, Conversation);
    return response.data as Conversation;
  } catch (error) {
    handleApiError(error, 'create conversation');
    throw error;
  }
};

export const updateConversation = async (conversation?: Conversation): Promise<Conversation> => {
  try {
    const id = ((conversation as any)?.conversationID ?? '').toString();
    const url = `${BASE_URL}api/conversation/updateConversation/${id}`;
    const response = await axios.put(url, conversation);
    return response.data as Conversation;
  } catch (error) {
    handleApiError(error, 'update conversation');
    throw error;
  }
};

export const deleteConversation = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/conversation/deleteConversation/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete conversation');
  }
};

export const fireConversationAction = async (id?: string, status?: string): Promise<Conversation> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/conversation/updateConversationStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/conversation/updateconversationstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/CONVERSATION/UpdateConversationStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as Conversation;
  } catch (error) {
    handleApiError(error, 'fire conversation action');
    throw error;
  }
};

