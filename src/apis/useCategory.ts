{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { Category } from "../types/Category";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type CategoriesListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getCategories = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: CategoriesListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchCategories',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchCategories({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchCategories = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<CategoriesListParams, 'pageSize' | 'pageNumber'>> & Omit<CategoriesListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<Category>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/category/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch categories');
  }
};

export const getCategory = async (id?: string): Promise<Category> => {
  try {
    const url = `${BASE_URL}api/category/getCategoryById/${id}`;
    const response = await axios.get(url);
    return response.data as Category;
  } catch (error) {
    handleApiError(error, 'get category');
    throw error;
  }
};

export const createCategory = async (Category?: Category): Promise<Category> => {
  try {
    const url = `${BASE_URL}api/category/createCategory`;
    const response = await axios.post(url, Category);
    return response.data as Category;
  } catch (error) {
    handleApiError(error, 'create category');
    throw error;
  }
};

export const updateCategory = async (category?: Category): Promise<Category> => {
  try {
    const id = ((category as any)?.categoryID ?? '').toString();
    const url = `${BASE_URL}api/category/updateCategory/${id}`;
    const response = await axios.put(url, category);
    return response.data as Category;
  } catch (error) {
    handleApiError(error, 'update category');
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/category/deleteCategory/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete category');
  }
};

