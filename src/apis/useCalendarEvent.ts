{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { CalendarEvent } from "../types/CalendarEvent";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type CalendarEventsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  eventType?: string;
};

export const getCalendarEvents = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  eventType,
  sortBy,
  sortDirection
}: CalendarEventsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchCalendarEvents',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        eventType,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchCalendarEvents({ pageSize, pageNumber, searchQuery,
      statusFilter,
      eventType,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchCalendarEvents = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  eventType,
  sortBy,
  sortDirection
}: Required<Pick<CalendarEventsListParams, 'pageSize' | 'pageNumber'>> & Omit<CalendarEventsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<CalendarEvent>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/calendarevent/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (eventType) { url += `&eventType=${encodeURIComponent(eventType)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch calendarEvents');
  }
};

export const getCalendarEvent = async (id?: string): Promise<CalendarEvent> => {
  try {
    const url = `${BASE_URL}api/calendarevent/getCalendarEventById/${id}`;
    const response = await axios.get(url);
    return response.data as CalendarEvent;
  } catch (error) {
    handleApiError(error, 'get calendarEvent');
    throw error;
  }
};

export const createCalendarEvent = async (CalendarEvent?: CalendarEvent): Promise<CalendarEvent> => {
  try {
    const url = `${BASE_URL}api/calendarevent/createCalendarEvent`;
    const response = await axios.post(url, CalendarEvent);
    return response.data as CalendarEvent;
  } catch (error) {
    handleApiError(error, 'create calendarEvent');
    throw error;
  }
};

export const updateCalendarEvent = async (calendarEvent?: CalendarEvent): Promise<CalendarEvent> => {
  try {
    const id = ((calendarEvent as any)?.calendarEventID ?? '').toString();
    const url = `${BASE_URL}api/calendarevent/updateCalendarEvent/${id}`;
    const response = await axios.put(url, calendarEvent);
    return response.data as CalendarEvent;
  } catch (error) {
    handleApiError(error, 'update calendarEvent');
    throw error;
  }
};

export const deleteCalendarEvent = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/calendarevent/deleteCalendarEvent/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete calendarEvent');
  }
};

export const fireCalendarEventAction = async (id?: string, status?: string): Promise<CalendarEvent> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/calendarevent/updateCalendarEventStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/calendarevent/updatecalendareventstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/CALENDAREVENT/UpdateCalendarEventStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as CalendarEvent;
  } catch (error) {
    handleApiError(error, 'fire calendarEvent action');
    throw error;
  }
};

