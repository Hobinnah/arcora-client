{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { SubscriptionPlan } from "../types/SubscriptionPlan";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type SubscriptionPlansListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  isActive?: string;
};

export const getSubscriptionPlans = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  isActive,
  sortBy,
  sortDirection
}: SubscriptionPlansListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchSubscriptionPlans',
      { pageSize, pageNumber, searchQuery,
        isActive,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchSubscriptionPlans({ pageSize, pageNumber, searchQuery,
      isActive,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchSubscriptionPlans = async ({
  pageSize,
  pageNumber,
  searchQuery,
  isActive,
  sortBy,
  sortDirection
}: Required<Pick<SubscriptionPlansListParams, 'pageSize' | 'pageNumber'>> & Omit<SubscriptionPlansListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<SubscriptionPlan>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/subscriptionplan/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (isActive) { url += `&isActive=${encodeURIComponent(isActive)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch subscriptionPlans');
  }
};

export const getSubscriptionPlan = async (id?: string): Promise<SubscriptionPlan> => {
  try {
    const url = `${BASE_URL}api/subscriptionplan/getSubscriptionPlanById/${id}`;
    const response = await axios.get(url);
    return response.data as SubscriptionPlan;
  } catch (error) {
    handleApiError(error, 'get subscriptionPlan');
    throw error;
  }
};

export const createSubscriptionPlan = async (SubscriptionPlan?: SubscriptionPlan): Promise<SubscriptionPlan> => {
  try {
    const url = `${BASE_URL}api/subscriptionplan/createSubscriptionPlan`;
    const response = await axios.post(url, SubscriptionPlan);
    return response.data as SubscriptionPlan;
  } catch (error) {
    handleApiError(error, 'create subscriptionPlan');
    throw error;
  }
};

export const updateSubscriptionPlan = async (subscriptionPlan?: SubscriptionPlan): Promise<SubscriptionPlan> => {
  try {
    const id = ((subscriptionPlan as any)?.subscriptionPlanID ?? '').toString();
    const url = `${BASE_URL}api/subscriptionplan/updateSubscriptionPlan/${id}`;
    const response = await axios.put(url, subscriptionPlan);
    return response.data as SubscriptionPlan;
  } catch (error) {
    handleApiError(error, 'update subscriptionPlan');
    throw error;
  }
};

export const deleteSubscriptionPlan = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/subscriptionplan/deleteSubscriptionPlan/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete subscriptionPlan');
  }
};

