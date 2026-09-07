{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Rating } from "../types/Rating";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type RatingsListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getRatings = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: RatingsListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchRatings',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchRatings({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchRatings = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<RatingsListParams, 'pageSize' | 'pageNumber'>> & Omit<RatingsListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Rating>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/rating/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? data.records ?? [], totalCount: data.totalCount ?? data.total ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch ratings');
  }
};

export const getRating = async (id?: string): Promise<Rating> => {
  try {
    const url = `${BASE_URL}api/rating/getRatingById/${id}`;
    const response = await axios.get(url);
    return response.data as Rating;
  } catch (error) {
    handleApiError(error, 'get rating');
    throw error;
  }
};

export const createRating = async (Rating?: Rating): Promise<Rating> => {
  try {
    const url = `${BASE_URL}api/rating/createRating`;
    const response = await axios.post(url, Rating);
    return response.data as Rating;
  } catch (error) {
    handleApiError(error, 'create rating');
    throw error;
  }
};

export const updateRating = async (rating?: Rating): Promise<Rating> => {
  try {
    const id = ((rating as any)?.ratingID ?? '').toString();
    const url = `${BASE_URL}api/rating/updateRating/${id}`;
    const response = await axios.put(url, rating);
    return response.data as Rating;
  } catch (error) {
    handleApiError(error, 'update rating');
    throw error;
  }
};

export const deleteRating = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/rating/deleteRating/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete rating');
  }
};

