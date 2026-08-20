{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { OrgSubscription } from "../types/OrgSubscription";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type OrgSubscriptionsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  statusFilter?: string; // mapped to &status=
  billingFrequency?: string;
};

export const getOrgSubscriptions = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  statusFilter,
  billingFrequency,
  sortBy,
  sortDirection
}: OrgSubscriptionsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchOrgSubscriptions',
      { pageSize, pageNumber, searchQuery,
        statusFilter,
        billingFrequency,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchOrgSubscriptions({ pageSize, pageNumber, searchQuery,
      statusFilter,
      billingFrequency,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchOrgSubscriptions = async ({
  pageSize,
  pageNumber,
  searchQuery,
  statusFilter,
  billingFrequency,
  sortBy,
  sortDirection
}: Required<Pick<OrgSubscriptionsListParams, 'pageSize' | 'pageNumber'>> & Omit<OrgSubscriptionsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<OrgSubscription>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/orgsubscription/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (statusFilter) { url += `&status=${encodeURIComponent(statusFilter)}`; }
    if (billingFrequency) { url += `&billingFrequency=${encodeURIComponent(billingFrequency)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch orgSubscriptions');
  }
};

export const getOrgSubscription = async (id?: string): Promise<OrgSubscription> => {
  try {
    const url = `${BASE_URL}api/orgsubscription/getOrgSubscriptionById/${id}`;
    const response = await axios.get(url);
    return response.data as OrgSubscription;
  } catch (error) {
    handleApiError(error, 'get orgSubscription');
    throw error;
  }
};

export const createOrgSubscription = async (OrgSubscription?: OrgSubscription): Promise<OrgSubscription> => {
  try {
    const url = `${BASE_URL}api/orgsubscription/createOrgSubscription`;
    const response = await axios.post(url, OrgSubscription);
    return response.data as OrgSubscription;
  } catch (error) {
    handleApiError(error, 'create orgSubscription');
    throw error;
  }
};

export const updateOrgSubscription = async (orgSubscription?: OrgSubscription): Promise<OrgSubscription> => {
  try {
    const id = ((orgSubscription as any)?.orgSubscriptionID ?? '').toString();
    const url = `${BASE_URL}api/orgsubscription/updateOrgSubscription/${id}`;
    const response = await axios.put(url, orgSubscription);
    return response.data as OrgSubscription;
  } catch (error) {
    handleApiError(error, 'update orgSubscription');
    throw error;
  }
};

export const deleteOrgSubscription = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/orgsubscription/deleteOrgSubscription/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete orgSubscription');
  }
};

export const fireOrgSubscriptionAction = async (id?: string, status?: string): Promise<OrgSubscription> => {
  try {
    if (!id || !status) {
      throw new Error(`Missing required parameters: id=${id}, status=${status}`);
    }
    let url = `${BASE_URL}api/orgsubscription/updateOrgSubscriptionStatus/${id}/${encodeURIComponent(status)}`;
    let response;
    try {
      response = await axios.post(url);
    } catch (error1: any) {
      const alternatives = [
        `${BASE_URL}api/orgsubscription/updateorgsubscriptionstatus/${id}/${encodeURIComponent(status)}`,
        `${BASE_URL}api/ORGSUBSCRIPTION/UpdateOrgSubscriptionStatus/${id}/${encodeURIComponent(status)}`,
      ];
      let lastError = error1;
      for (const alt of alternatives) {
        try { response = await axios.post(alt); break; }
        catch (e:any) { lastError = e; }
      }
      if (!response) throw lastError;
    }
    const data = response.data;
    return data as OrgSubscription;
  } catch (error) {
    handleApiError(error, 'fire orgSubscription action');
    throw error;
  }
};

