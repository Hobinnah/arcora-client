import axios from 'axios';
import { env } from '../env';
import { ApiError } from './useError';

export type OccupancyReadiness = 'READY' | 'NEEDS_ATTENTION' | 'NOT_SURE';

export type CheckInAttachment = {
  attachmentID: string;
  fileName?: string | null;
  mimeType?: string | null;
  fileSizeBytes?: number | null;
  description?: string | null;
  downloadUrl?: string | null;
  expiresAt?: string | null;
};

export type CheckInItem = {
  inspectionItemID: string;
  area: string;
  itemName: string;
  condition?: string | null;
  notes?: string | null;
  requiresRepair?: boolean | null;
  attachments: CheckInAttachment[];
};

export type CheckInInspection = {
  inspectionID: string;
  inspectionType: string;
  status: string;
  occupancyReadiness?: OccupancyReadiness | null;
  arrivalConfirmedAt?: string | null;
  submittedAt?: string | null;
  notes?: string | null;
  version: string;
  requiresFollowUp: boolean;
  items: CheckInItem[];
  attachments: CheckInAttachment[];
  reviews: Array<{
    inspectionReviewID: string;
    status: string;
    comments?: string | null;
    reviewedByUserID: number;
    reviewedAt: string;
  }>;
};

export type LeaseCheckIn = {
  leaseID: string;
  eligibility: {
    canSubmit: boolean;
    reasonCode?: string | null;
    message?: string | null;
    moveInDate: string;
    timeZone?: string | null;
  };
  inspection: CheckInInspection | null;
};

export type CheckInDraft = { inspectionID: string; version: string };

export type SubmitCheckIn = {
  inspectionID: string;
  version: string;
  arrivalConfirmed: true;
  occupancyReadiness: OccupancyReadiness;
  notes: string;
  photos: Array<{ attachmentID: string; description: string }>;
  items: Array<{
    clientItemID: string;
    area: string;
    itemName: string;
    condition?: string | null;
    notes?: string | null;
    attachmentIDs: string[];
  }>;
};

function checkInUrl(leaseID: string): string {
  return `${env.API_BASE_URL}api/leases/${encodeURIComponent(leaseID)}/check-in`;
}

function throwCheckInError(error: unknown, operation: string): never {
  if (!axios.isAxiosError(error)) throw error;
  const data: unknown = error.response?.data;
  let message = error.message;
  let reasonCode: string | undefined;
  if (data && typeof data === 'object') {
    if ('detail' in data && typeof data.detail === 'string') message = data.detail;
    else if ('title' in data && typeof data.title === 'string') message = data.title;
    if ('reasonCode' in data && typeof data.reasonCode === 'string') reasonCode = data.reasonCode;
    if ('errors' in data && data.errors && typeof data.errors === 'object') {
      const fields = Object.entries(data.errors).flatMap(([field, values]) =>
        Array.isArray(values) ? values.filter((value): value is string => typeof value === 'string').map((value) => `${field}: ${value}`) : [],
      );
      if (fields.length) message += ` ${fields.join(' ')}`;
    }
  }
  throw new ApiError(`Could not ${operation}: ${message}`, error.response?.status, reasonCode, operation);
}

export async function getLeaseCheckIn(leaseID: string): Promise<LeaseCheckIn> {
  try {
    const response = await axios.get<LeaseCheckIn>(checkInUrl(leaseID));
    return response.data;
  } catch (error) {
    return throwCheckInError(error, 'load check-in');
  }
}

export async function createCheckInDraft(leaseID: string): Promise<CheckInDraft> {
  try {
    const response = await axios.post<CheckInDraft>(`${checkInUrl(leaseID)}/draft`);
    return response.data;
  } catch (error) {
    return throwCheckInError(error, 'create check-in draft');
  }
}

export async function uploadCheckInPhoto(
  leaseID: string, inspectionID: string, file: File, clientPhotoID: string, description: string,
): Promise<CheckInAttachment> {
  const form = new FormData();
  form.append('InspectionID', inspectionID);
  form.append('File', file);
  form.append('ClientPhotoID', clientPhotoID);
  form.append('Description', description);
  try {
    const response = await axios.post<CheckInAttachment>(`${checkInUrl(leaseID)}/photos`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
    return response.data;
  } catch (error) {
    return throwCheckInError(error, `upload ${file.name}`);
  }
}

export async function deleteCheckInPhoto(leaseID: string, attachmentID: string): Promise<void> {
  try {
    await axios.delete(`${checkInUrl(leaseID)}/photos/${encodeURIComponent(attachmentID)}`);
  } catch (error) {
    throwCheckInError(error, 'remove photo');
  }
}

export async function submitLeaseCheckIn(
  leaseID: string, request: SubmitCheckIn, idempotencyKey: string,
): Promise<CheckInInspection> {
  try {
    const response = await axios.post<CheckInInspection>(`${checkInUrl(leaseID)}/submit`, request, {
      headers: { 'Idempotency-Key': idempotencyKey },
      timeout: 60000,
    });
    return response.data;
  } catch (error) {
    return throwCheckInError(error, 'submit check-in');
  }
}
