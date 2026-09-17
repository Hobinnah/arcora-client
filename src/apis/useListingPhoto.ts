{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { env } from "../env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { handleApiError } from "./useError";
import type { ListingPhoto } from "../types/ListingPhoto";

// Configure axios defaults for CORS and development
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type ListingPhotosListParams = {
  pageSize?: number;
  pageNumber?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export const getListingPhotos = ({
  pageSize = 5,
  pageNumber = 0,
  searchQuery,
  sortBy,
  sortDirection
}: ListingPhotosListParams = {}) => {

  const { data = { data: [], totalCount: 0 } } = useQuery({
    queryKey: [
      'fetchListingPhotos',
      { pageSize, pageNumber, searchQuery,
        sortBy, sortDirection }
    ],
    queryFn: () => fetchListingPhotos({ pageSize, pageNumber, searchQuery,
      sortBy, sortDirection }),
  });

  return data || { data: [], totalCount: 0 };
};

export const fetchListingPhotos = async ({
  pageSize,
  pageNumber,
  searchQuery,
  sortBy,
  sortDirection
}: Required<Pick<ListingPhotosListParams, 'pageSize' | 'pageNumber'>> & Omit<ListingPhotosListParams, 'pageSize' | 'pageNumber'>): Promise<{ data: Array<ListingPhoto>; totalCount: number }> => {
  try {
    let url = `${BASE_URL}api/listingphoto/get?pageSize=${pageSize}&pageNumber=${pageNumber + 1}`;

    // Optional server-side filtering & sorting
    if (searchQuery) { url += `&search=${encodeURIComponent(searchQuery)}`; }
    if (sortBy) { url += `&sortBy=${encodeURIComponent(sortBy)}`; }
    if (sortDirection) { url += `&sortDirection=${sortDirection}`; }

    const response = await axios.get(url);
    const data = response.data;
    return { data: data.data ?? [], totalCount: data.totalCount ?? 0 };
  } catch (error) {
    return handleApiError(error, 'fetch listingPhotos');
  }
};

export const getListingPhoto = async (id?: string): Promise<ListingPhoto> => {
  try {
    const url = `${BASE_URL}api/listingphoto/getListingPhotoById/${id}`;
    const response = await axios.get(url);
    return response.data as ListingPhoto;
  } catch (error) {
    handleApiError(error, 'get listingPhoto');
    throw error;
  }
};

export const createListingPhoto = async (ListingPhoto?: ListingPhoto): Promise<ListingPhoto> => {
  try {
    const url = `${BASE_URL}api/listingphoto/createListingPhoto`;
    const response = await axios.post(url, ListingPhoto);
    return response.data as ListingPhoto;
  } catch (error) {
    handleApiError(error, 'create listingPhoto');
    throw error;
  }
};

export const uploadListingPhoto = async (
  file: File,
  listingID: string | null,
  displayOrder: number,
  isCoverPhoto: boolean,
  options: { location?: string; caption?: string; altText?: string; capturedBy?: string; userID?: number } = {},
): Promise<ListingPhoto> => {
  try {
    const formData = new FormData();
    formData.append('File', file);
    if (listingID && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(listingID)) {
      formData.append('ListingID', listingID);
    }
    formData.append('Location', options.location ?? 'Additional');
    formData.append('Caption', options.caption ?? '');
    formData.append('AltText', options.altText ?? file.name);
    formData.append('DisplayOrder', String(displayOrder));
    formData.append('IsCoverPhoto', String(isCoverPhoto));
    formData.append('CapturedBy', options.capturedBy ?? '');
    if (options.userID !== undefined) formData.append('UserID', String(options.userID));
    const url = `${BASE_URL}api/listingphoto/Upload`;
    if (import.meta.env.DEV) {
      console.info('[ListingPhotos] UploadListingPhoto payload', {
        endpoint: url,
        file: { name: file.name, type: file.type, size: file.size },
        ListingID: listingID,
        Location: isCoverPhoto ? 'CoverPhoto' : options.location,
        Caption: options.caption,
        AltText: options.altText,
        DisplayOrder: displayOrder,
        IsCoverPhoto: isCoverPhoto,
        CapturedBy: listingID,
        UserID: options.userID,
      });
    }
    const response = await axios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      // backend upload action can hang indefinitely on blob storage calls; fail fast instead of stalling the UI forever
      timeout: 30000,
    });
    return response.data as ListingPhoto;
  } catch (error) {
    handleApiError(error, 'create listingPhotos');
    throw error;
  }
};

export const updateListingPhoto = async (listingPhoto?: ListingPhoto): Promise<ListingPhoto> => {
  try {
    const id = ((listingPhoto as any)?.listingPhotoID ?? '').toString();
    const url = `${BASE_URL}api/listingphoto/updateListingPhoto/${id}`;
    const response = await axios.put(url, listingPhoto);
    return response.data as ListingPhoto;
  } catch (error) {
    handleApiError(error, 'update listingPhoto');
    throw error;
  }
};

export const deleteListingPhoto = async (id: string): Promise<void> => {
  try {
    const url = `${BASE_URL}api/listingphoto/deleteListingPhoto/${id}`;
    await axios.delete(url);
  } catch (error) {
    handleApiError(error, 'delete listingPhoto');
  }
};

