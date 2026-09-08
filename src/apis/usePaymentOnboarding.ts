import axios from 'axios';
import { env } from '../env';

const BASE_URL = env.API_BASE_URL;

export type PaymentOnboardingStartResponse = {
  tenantID: string;
  providerCustomerID: string;
  publishableKey: string;
  providerName: string;
};

export type PaymentOnboardingSetupIntentResponse = {
  tenantID: string;
  setupIntentID: string;
  clientSecret: string;
  publishableKey: string;
  status: string;
};

export type PaymentOnboardingStatusResponse = {
  tenantID: string;
  hasVerifiedPad: boolean;
  hasVerifiedCard: boolean;
  padMandateActive: boolean;
  isReady: boolean;
};

export const startPaymentOnboarding = async (tenantID: string): Promise<PaymentOnboardingStartResponse> => {
  const response = await axios.post(`${BASE_URL}api/PaymentOnboarding/Start`, { tenantID });
  return response.data as PaymentOnboardingStartResponse;
};

export const createPaymentOnboardingSetupIntent = async (
  tenantID: string,
  methodKind: 'PAD' | 'CARD',
): Promise<PaymentOnboardingSetupIntentResponse> => {
  const response = await axios.post(`${BASE_URL}api/PaymentOnboarding/CreateSetupIntent`, {
    tenantID,
    methodKind,
  });
  return response.data as PaymentOnboardingSetupIntentResponse;
};

export const savePaymentOnboardingMethod = async (payload: {
  tenantID: string;
  providerPaymentMethodID: string;
  methodKind: 'PAD' | 'CARD';
}) => {
  const response = await axios.post(`${BASE_URL}api/PaymentOnboarding/SavePaymentMethod`, payload);
  return response.data;
};

export const getPaymentOnboardingStatus = async (tenantID: string): Promise<PaymentOnboardingStatusResponse> => {
  const response = await axios.get(`${BASE_URL}api/PaymentOnboarding/Status/${tenantID}`);
  return response.data as PaymentOnboardingStatusResponse;
};
