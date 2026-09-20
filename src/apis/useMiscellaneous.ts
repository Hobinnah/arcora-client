import { env } from "../env";
import axios from "axios";
import { handleApiError } from "./useError";

axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = env.API_BASE_URL;

export type RuleTypeOption = {
  key: string;
  value: string;
};

export const fetchPhotoLocations = async (): Promise<string[]> => {
  try {
    const url = `${BASE_URL}api/Miscelleanous/GetPhotoLocations`;
    const response = await axios.get(url);
    const data = response.data;
    return Array.isArray(data) ? data : data?.data ?? [];
  } catch (error) {
    handleApiError(error, 'fetch photo locations');
    throw error;
  }
};

export const fetchRuleTypes = async (): Promise<RuleTypeOption[]> => {
  try {
    const url = `${BASE_URL}api/Miscelleanous/GetRuleTypes`;
    const response = await axios.get(url);
    const data = response.data;
    const list: Array<Record<string, string>> = Array.isArray(data) ? data : data?.data ?? [];
    return list.map((item) => ({
      key: item.key ?? item.Key,
      value: item.value ?? item.Value,
    }));
  } catch (error) {
    handleApiError(error, 'fetch rule types');
    throw error;
  }
};
