import axios from "axios";
import { env } from "../env";
import { handleApiError } from "./useError";

const BASE_URL = env.API_BASE_URL;

export type LeaseContractEditableSection = {
  sectionNumber: number;
  title: string;
  isEditable: boolean;
};

export type LeaseContractTemplate = {
  leaseContractTemplateID: string;
  organizationID: string;
  templateName: string;
  description: string;
  htmlContent: string;
  isDefault: boolean;
  isActive: boolean;
  isSystemGenerated: boolean;
  currentVersionNumber: number;
  capturedDate?: string;
  capturedBy?: string;
  updatedDate?: string;
  updatedBy?: string;
};

export type LeaseContractTemplateVersion = Record<string, unknown>;

export type LeaseContractTemplateUpsert = {
  organizationID: string;
  templateName: string;
  description: string;
  htmlContent: string;
  isDefault: boolean;
  isActive: boolean;
  changeSummary: string;
  editedSectionNumbers: number[];
  updatedBy: string;
};

export type LeaseContractTemplatePreview = {
  leaseContractTemplateID: string | null;
  templateName: string;
  isFallbackTemplate: boolean;
  rawHtml: string;
  renderedHtml: string;
};

type ApiRecord = Record<string, unknown>;

export const hideLeaseAgreementFieldsWithoutValues = (html: string) => {
  if (!html) return html;
  const document = new DOMParser().parseFromString(html, "text/html");
  const emptyOrUnresolvedValue = /^(?:[-–—]|n\/?a|not provided|undefined|null|\{\{[\s\S]*?\}\}|\$\{[\s\S]*?\}|\[[^\]]*\])?$/i;
  const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let textNode = textWalker.nextNode();
  while (textNode) {
    if (textNode.textContent) {
      textNode.textContent = textNode.textContent.replace(
        /\s*Business No:\s*(?:\uFFFD\s*)?(?=Generated:|$)/gi,
        "",
      );
    }
    textNode = textWalker.nextNode();
  }
  for (const element of document.querySelectorAll("p, li, tr, td, dd, div, section, label")) {
    const text = element.textContent?.replace(/\u00a0/g, " ").trim() ?? "";
    const field = text.match(/^([^:\r\n]{1,100}):\s*(.*)$/);
    if (field && emptyOrUnresolvedValue.test(field[2].trim())) element.remove();
  }
  const spacingStyle = document.createElement("style");
  spacingStyle.textContent = ".footer { margin-top: 48px; }";
  document.head.appendChild(spacingStyle);
  return `<!DOCTYPE html>${document.documentElement.outerHTML}`;
};

const read = (record: ApiRecord, ...keys: string[]) => {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) return record[key];
  }
  return undefined;
};

const toTemplate = (value: unknown): LeaseContractTemplate => {
  const record = (value ?? {}) as ApiRecord;
  return {
    leaseContractTemplateID: String(read(record, "leaseContractTemplateID", "LeaseContractTemplateID", "leaseContractTemplateId", "LeaseContractTemplateId") ?? ""),
    organizationID: String(read(record, "organizationID", "OrganizationID", "organizationId", "OrganizationId") ?? ""),
    templateName: String(read(record, "templateName", "TemplateName") ?? ""),
    description: String(read(record, "description", "Description") ?? ""),
    htmlContent: String(read(record, "htmlContent", "HtmlContent", "HTMLContent") ?? ""),
    isDefault: Boolean(read(record, "isDefault", "IsDefault")),
    isActive: Boolean(read(record, "isActive", "IsActive")),
    isSystemGenerated: Boolean(read(record, "isSystemGenerated", "IsSystemGenerated")),
    currentVersionNumber: Number(read(record, "currentVersionNumber", "CurrentVersionNumber") ?? 0),
    capturedDate: String(read(record, "capturedDate", "CapturedDate") ?? ""),
    capturedBy: String(read(record, "capturedBy", "CapturedBy") ?? ""),
    updatedDate: String(read(record, "updatedDate", "UpdatedDate") ?? ""),
    updatedBy: String(read(record, "updatedBy", "UpdatedBy") ?? ""),
  };
};

const getList = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  const record = (value ?? {}) as ApiRecord;
  const data = read(record, "data", "Data");
  return Array.isArray(data) ? data : [];
};

export const getLeaseContractEditableSections = async (): Promise<LeaseContractEditableSection[]> => {
  try {
    const response = await axios.get(`${BASE_URL}api/Miscelleanous/GetLeaseContractEditableSections`);
    return getList(response.data).map((value) => {
      const record = (value ?? {}) as ApiRecord;
      return {
        sectionNumber: Number(read(record, "sectionNumber", "SectionNumber") ?? 0),
        title: String(read(record, "title", "Title") ?? ""),
        isEditable: Boolean(read(record, "isEditable", "IsEditable")),
      };
    }).filter((section) => section.sectionNumber > 0 && section.isEditable);
  } catch (error) {
    return handleApiError(error, "load editable lease sections");
  }
};

export const getLeaseContractTemplatesByOrganizationID = async (
  organizationID: string,
  pageNumber = 1,
  pageSize = 10,
  search = "",
): Promise<{ data: LeaseContractTemplate[]; totalCount: number }> => {
  try {
    const query = new URLSearchParams({ PageNumber: String(pageNumber), PageSize: String(pageSize), Search: search });
    const response = await axios.get(`${BASE_URL}api/LeaseContractTemplate/GetByOrganizationID/${encodeURIComponent(organizationID)}?${query}`);
    const record = (response.data ?? {}) as ApiRecord;
    return {
      data: getList(response.data).map(toTemplate),
      totalCount: Number(read(record, "totalCount", "TotalCount") ?? 0),
    };
  } catch (error) {
    return handleApiError(error, "load lease templates");
  }
};

export const getLeaseContractTemplateByID = async (templateID: string): Promise<LeaseContractTemplate> => {
  try {
    const response = await axios.get(`${BASE_URL}api/LeaseContractTemplate/GetByID/${encodeURIComponent(templateID)}`);
    return toTemplate(response.data);
  } catch (error) {
    return handleApiError(error, "load lease template");
  }
};

export const getLeaseContractTemplateVersions = async (templateID: string): Promise<LeaseContractTemplateVersion[]> => {
  try {
    const response = await axios.get(`${BASE_URL}api/LeaseContractTemplate/GetVersions/${encodeURIComponent(templateID)}`);
    return getList(response.data) as LeaseContractTemplateVersion[];
  } catch (error) {
    return handleApiError(error, "load lease template history");
  }
};

export const createLeaseContractTemplate = async (payload: LeaseContractTemplateUpsert): Promise<LeaseContractTemplate> => {
  try {
    const response = await axios.post(`${BASE_URL}api/LeaseContractTemplate/Create`, payload);
    return toTemplate(response.data);
  } catch (error) {
    return handleApiError(error, "create lease template");
  }
};

export const updateLeaseContractTemplate = async (templateID: string, payload: LeaseContractTemplateUpsert): Promise<LeaseContractTemplate> => {
  try {
    const response = await axios.put(`${BASE_URL}api/LeaseContractTemplate/Update/${encodeURIComponent(templateID)}`, payload);
    return toTemplate(response.data);
  } catch (error) {
    return handleApiError(error, "update lease template");
  }
};

export const setDefaultLeaseContractTemplate = async (templateID: string, updatedBy: string): Promise<void> => {
  try {
    await axios.put(`${BASE_URL}api/LeaseContractTemplate/SetDefault/${encodeURIComponent(templateID)}?updatedBy=${encodeURIComponent(updatedBy)}`);
  } catch (error) {
    return handleApiError(error, "set default lease template");
  }
};

export const renderLeaseContractPreview = async (
  leaseID: string,
  leaseContractTemplateID?: string,
): Promise<LeaseContractTemplatePreview> => {
  try {
    const response = await axios.post(`${BASE_URL}api/LeaseContractTemplate/RenderPreview`, {
      leaseID,
      ...(leaseContractTemplateID ? { leaseContractTemplateID } : {}),
    });
    const record = (response.data ?? {}) as ApiRecord;
    return {
      leaseContractTemplateID: (read(record, "leaseContractTemplateID", "LeaseContractTemplateID") as string | null | undefined) ?? null,
      templateName: String(read(record, "templateName", "TemplateName") ?? ""),
      isFallbackTemplate: Boolean(read(record, "isFallbackTemplate", "IsFallbackTemplate")),
      rawHtml: String(read(record, "rawHtml", "RawHtml") ?? ""),
      renderedHtml: String(read(record, "renderedHtml", "RenderedHtml") ?? ""),
    };
  } catch (error) {
    return handleApiError(error, "render lease preview");
  }
};

export const getStandardLeaseContractTemplate = async (): Promise<string> => {
  try {
    const response = await axios.get(`${BASE_URL}api/LeaseContractTemplate/GetStandardTemplate`);
    if (typeof response.data === "string") return response.data;
    const record = (response.data ?? {}) as ApiRecord;
    return String(read(record, "htmlContent", "HtmlContent", "HTMLContent") ?? "");
  } catch (error) {
    return handleApiError(error, "load standard lease template");
  }
};