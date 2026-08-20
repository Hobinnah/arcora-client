{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Notification } from "../types/Notification";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type NotificationsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  channel?: string;
};

export const getNotifications = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  channel,
  sortBy,
  sortDirection
}: NotificationsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchNotifications',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        channel,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchNotifications({ pageSize, pageNumber, searchQuery,
      statusFilter,
      channel,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchNotifications = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  channel,
  sortBy,
  sortDirection
}: Required<Pick<NotificationsListParams, 'pageSize' | 'pageNumber'>> & Omit<NotificationsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Notification>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/notification/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (channel) { url += `&channel=${encodeURIComponent(channel)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch notifications');
  }
};

export const getNotification = async (id?: string): Promise<Notification> => {
  try {
    const url = `${BASE_URL}api/notification/getNotificationById/${id}`;
    const response = await axios.get(url);
    return response.data as Notification;
  } catch (error) {
    handleApiError(error, 'get notification');
    throw error;
  }
};

export const createNotification = async (Notification?: Notification): Promise<Notification> => {
  try {
    const url = `${BASE_URL}api/notification/createNotification`;
    const response = await axios.post(url, Notification);
    return response.data as Notification;
  } catch (error) {
    handleApiError(error, 'create notification');
    throw error;
  }
};

export const updateNotification = async (notification?: Notification): Promise<Notification> => {
  try {
    const id = ((notification as any)?.notificationID ?? '').toString();
    const url = `${BASE_URL}api/notification/updateNotification/${id}`;
    const response = await axios.put(url, notification);
    return response.data as Notification;
  } catch (error) {
    handleApiError(error, 'update notification');
    throw error;
  }
};

export const deleteNotification = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/notification/deleteNotification/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete notification');
  }
};

export const fireNotificationAction = async (id?: string, status?: string): Promise<Notification> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/notification/updateNotificationStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/notification/updatenotificationstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/NOTIFICATION/UpdateNotificationStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as Notification;
  } catch (error) {
    handleApiError(error, 'fire notification action');
    throw error;
  }
};

