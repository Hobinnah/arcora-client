import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { fetchLeases } from "../apis/useLease";
import { getOrganization, uploadOrganizationBrandLogo } from "../apis/useOrganization";
import {
  createLeaseContractTemplate,
  getLeaseContractEditableSections,
  getLeaseContractTemplateByID,
  getLeaseContractTemplateVersions,
  getLeaseContractTemplatesByOrganizationID,
  getStandardLeaseContractTemplate,
  hideLeaseAgreementFieldsWithoutValues,
  renderLeaseContractPreview,
  setDefaultLeaseContractTemplate,
  updateLeaseContractTemplate,
  type LeaseContractEditableSection,
  type LeaseContractTemplate,
  type LeaseContractTemplatePreview,
  type LeaseContractTemplateUpsert,
  type LeaseContractTemplateVersion,
} from "../apis/useLeaseContractTemplate";
import CustomSelect from "../components/CustomSelect";
import { CameraIcon, CheckIcon, EyeIcon, FileIcon, ShieldIcon } from "../components/Icons";
import "./LeaseAgreementEditor.css";

type Props = {
  organizationID: string;
  organizationName: string;
  brandLogoUrl: string;
  listingID: string;
  updatedBy: string;
};

type SectionRange = { start: number; end: number; content: string };
type LeaseAgreementPreview = LeaseContractTemplatePreview & { previewMode: "draft" | "template" | "rendered" };

const sectionNumberFromHeading = (html: string) => {
  const text = html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
  const match = text.match(/^(?:section\s+)?(\d{1,2})(?:\s*[.):\-–—]|\s+)(?:\s|$)/i);
  return match ? Number(match[1]) : null;
};

const matchingElementClose = (html: string, tagName: string, from: number) => {
  const tokens = new RegExp(`<\\/?${tagName}\\b[^>]*>`, "gi");
  tokens.lastIndex = from;
  let depth = 1;
  let token: RegExpExecArray | null;
  while ((token = tokens.exec(html))) {
    if (/^<\//.test(token[0])) depth -= 1;
    else if (!/\/>$/.test(token[0])) depth += 1;
    if (depth === 0) return token.index;
  }
  return -1;
};

const extractSectionRanges = (html: string): Map<number, SectionRange> => {
  const ranges = new Map<number, SectionRange>();
  const openingTags = /<([a-z][\w:-]*)\b[^>]*>/gi;
  let opening: RegExpExecArray | null;
  while ((opening = openingTags.exec(html))) {
    const attributes = opening[0];
    const dataMatch = attributes.match(/\bdata-section-number\s*=\s*["']?(\d+)/i)
      ?? attributes.match(/\bdata-section\s*=\s*["']?(\d+)/i);
    const idMatch = attributes.match(/\bid\s*=\s*["']section[-_ ]?(\d+)["']/i);
    const sectionNumber = Number(dataMatch?.[1] ?? idMatch?.[1]);
    if (!sectionNumber || ranges.has(sectionNumber)) continue;
    const contentStart = opening.index + opening[0].length;
    const contentEnd = matchingElementClose(html, opening[1], contentStart);
    if (contentEnd >= contentStart) {
      ranges.set(sectionNumber, { start: contentStart, end: contentEnd, content: html.slice(contentStart, contentEnd) });
    }
  }
  if (ranges.size > 0) return ranges;

  const sectionElements = /<section\b[^>]*>/gi;
  let sectionElement: RegExpExecArray | null;
  while ((sectionElement = sectionElements.exec(html))) {
    const className = sectionElement[0].match(/\bclass\s*=\s*["']([^"']*)["']/i)?.[1];
    if (!className?.split(/\s+/).includes("section")) continue;
    const contentStart = sectionElement.index + sectionElement[0].length;
    const contentEnd = matchingElementClose(html, "section", contentStart);
    if (contentEnd < contentStart) continue;
    const content = html.slice(contentStart, contentEnd);
    const heading = content.match(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]\s*>/i)?.[1];
    if (!heading) continue;
    const number = sectionNumberFromHeading(heading);
    if (number && !ranges.has(number)) {
      ranges.set(number, { start: contentStart, end: contentEnd, content });
    }
  }
  if (ranges.size > 0) return ranges;

  const headings: { number: number; start: number; end: number }[] = [];
  const headingPattern = /<(h[1-6])\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
  let heading: RegExpExecArray | null;
  while ((heading = headingPattern.exec(html))) {
    const number = sectionNumberFromHeading(heading[0].replace(/<h[1-6]\b[^>]*>/i, "").replace(/<\/h[1-6]\s*>$/i, ""));
    if (number) headings.push({ number, start: heading.index, end: headingPattern.lastIndex });
  }
  headings.forEach((item, index) => {
    const nextHeading = headings[index + 1];
    if (nextHeading) {
      ranges.set(item.number, { start: item.end, end: nextHeading.start, content: html.slice(item.end, nextHeading.start) });
    }
  });
  return ranges;
};

const applySectionDrafts = (html: string, ranges: Map<number, SectionRange>, drafts: Record<number, string>) => {
  const changed = [...ranges.entries()]
    .filter(([number, range]) => drafts[number] !== undefined && drafts[number] !== range.content)
    .sort((left, right) => right[1].start - left[1].start);
  let result = html;
  for (const [number, range] of changed) {
    result = `${result.slice(0, range.start)}${drafts[number]}${result.slice(range.end)}`;
  }
  return { htmlContent: result, editedSectionNumbers: changed.map(([number]) => number).sort((a, b) => a - b) };
};

const getApiMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  const responseData = (error as { response?: { data?: { message?: string; detail?: string; title?: string } } })?.response?.data;
  return responseData?.message || responseData?.detail || responseData?.title || "The request failed. Please try again.";
};

const versionValue = (version: LeaseContractTemplateVersion, ...keys: string[]) => {
  for (const key of keys) {
    const capitalized = key[0].toUpperCase() + key.slice(1);
    const value = version[key] ?? version[capitalized];
    if (value !== undefined && value !== null && value !== "") return String(value);
  }
  return "";
};

const templateOptionLabel = (template: LeaseContractTemplate) => `${template.templateName}${template.isDefault ? " · Default" : ""}`;

const applyOrganizationLogoToPreview = (html: string, logoUrl: string, organizationName: string) => {
  if (!html || !logoUrl.trim()) return html;
  const previewDocument = new DOMParser().parseFromString(html, "text/html");
  const logoImage = Array.from(previewDocument.querySelectorAll<HTMLImageElement>("header img")).find((image) =>
    /logo|brand/i.test(`${image.alt} ${image.className} ${image.id} ${image.getAttribute("src") || ""}`),
  );
  const image: HTMLImageElement = logoImage ?? previewDocument.createElement("img");
  image.src = logoUrl;
  image.alt = `${organizationName} logo`;
  if (!logoImage) {
    image.style.maxHeight = "64px";
    image.style.maxWidth = "180px";
    image.style.objectFit = "contain";
    const agreementHeading = previewDocument.querySelector("header h1, header h2");
    if (agreementHeading) agreementHeading.insertAdjacentElement("afterend", image);
    else (previewDocument.querySelector("header") ?? previewDocument.body).prepend(image);
  }
  return `<!DOCTYPE html>${previewDocument.documentElement.outerHTML}`;
};

const getAllTemplates = async (organizationID: string, search: string) => {
  const pageSize = 10;
  const firstPage = await getLeaseContractTemplatesByOrganizationID(organizationID, 1, pageSize, search);
  const pageCount = Math.ceil(firstPage.totalCount / pageSize);
  if (pageCount <= 1) return firstPage.data;
  const remainingPages = await Promise.all(Array.from({ length: pageCount - 1 }, (_, index) =>
    getLeaseContractTemplatesByOrganizationID(organizationID, index + 2, pageSize, search),
  ));
  return [...firstPage.data, ...remainingPages.flatMap((page) => page.data)];
};

export default function LeaseAgreementEditor({ organizationID, organizationName, brandLogoUrl, listingID, updatedBy }: Props) {
  const [editableSections, setEditableSections] = useState<LeaseContractEditableSection[]>([]);
  const [templates, setTemplates] = useState<LeaseContractTemplate[]>([]);
  const [selectedTemplateID, setSelectedTemplateID] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<LeaseContractTemplate | null>(null);
  const [leases, setLeases] = useState<{ leaseID: string; leaseCode?: string; leaseNumber?: string; status?: string }[]>([]);
  const [selectedLeaseID, setSelectedLeaseID] = useState("");
  const [originalHtml, setOriginalHtml] = useState("");
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [changeSummary, setChangeSummary] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isNewTemplate, setIsNewTemplate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [versions, setVersions] = useState<LeaseContractTemplateVersion[] | null>(null);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [preview, setPreview] = useState<LeaseAgreementPreview | null>(null);
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);
  const [organizationLogoUrl, setOrganizationLogoUrl] = useState(brandLogoUrl);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const ranges = useMemo(() => extractSectionRanges(originalHtml), [originalHtml]);
  const editableSectionNumbers = useMemo(() => new Set(editableSections.map((section) => section.sectionNumber)), [editableSections]);
  const mappedEditableSections = editableSections.filter((section) => ranges.has(section.sectionNumber));
  const unmappedEditableSections = editableSections.filter((section) => !ranges.has(section.sectionNumber));
  const edited = useMemo(() => applySectionDrafts(originalHtml, ranges, drafts), [originalHtml, ranges, drafts]);
  const lockedSectionNumbers = [...ranges.keys()].filter((number) => !editableSectionNumbers.has(number)).sort((a, b) => a - b);
  const leaseOptions = leases.map((lease) => ({
    value: lease.leaseID,
    label: lease.leaseCode || lease.leaseNumber || `${lease.leaseID.slice(0, 8)} · ${lease.status || "Lease"}`,
  }));

  const loadTemplates = async (query = "") => {
    const loadedTemplates = await getAllTemplates(organizationID, query);
    setTemplates(loadedTemplates);
    return loadedTemplates;
  };

  const uploadBrandLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file for the organization logo.");
      return;
    }
    setError("");
    setNotice("");
    setIsUploadingLogo(true);
    try {
      const uploadedUrl = await uploadOrganizationBrandLogo(organizationID, file, updatedBy);
      setOrganizationLogoUrl(uploadedUrl);
      setNotice("Organization logo updated.");
    } catch (uploadError) {
      setError(getApiMessage(uploadError));
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const openTemplate = async (templateID: string) => {
    setError("");
    setNotice("");
    setVersions(null);
    setIsLoading(true);
    try {
      const template = await getLeaseContractTemplateByID(templateID);
      const extracted = extractSectionRanges(template.htmlContent);
      setSelectedTemplate(template);
      setSelectedTemplateID(template.leaseContractTemplateID);
      setOriginalHtml(template.htmlContent);
      setDrafts(Object.fromEntries(editableSections.filter((section) => extracted.has(section.sectionNumber)).map((section) => [section.sectionNumber, extracted.get(section.sectionNumber)!.content])));
      setTemplateName(template.templateName);
      setDescription(template.description);
      setIsDefault(template.isDefault);
      setIsActive(template.isActive);
      setIsNewTemplate(false);
      setChangeSummary("");
    } catch (loadError) {
      setError(getApiMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  };

  const refreshLatestTemplate = async () => {
    if (!selectedTemplateID || isNewTemplate) return null;
    if (edited.editedSectionNumbers.length > 0) {
      throw new Error("Save or discard your section edits before reloading the backend version.");
    }
    const template = await getLeaseContractTemplateByID(selectedTemplateID);
    const extracted = extractSectionRanges(template.htmlContent);
    setSelectedTemplate(template);
    setOriginalHtml(template.htmlContent);
    setDrafts(Object.fromEntries(editableSections.filter((section) => extracted.has(section.sectionNumber)).map((section) => [section.sectionNumber, extracted.get(section.sectionNumber)!.content])));
    if (selectedTemplate?.templateName === templateName) setTemplateName(template.templateName);
    if (selectedTemplate?.description === description) setDescription(template.description);
    if (selectedTemplate?.isDefault === isDefault) setIsDefault(template.isDefault);
    if (selectedTemplate?.isActive === isActive) setIsActive(template.isActive);
    return template;
  };

  useEffect(() => {
    let cancelled = false;
    const loadEditor = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [sections, loadedTemplates, organization] = await Promise.all([
          getLeaseContractEditableSections(),
          getAllTemplates(organizationID, ""),
          getOrganization(organizationID).catch(() => null),
        ]);
        const leaseResponse = await fetchLeases({ pageSize: 50, pageNumber: 0, listingID }).catch(() => ({ data: [], totalCount: 0 }));
        if (cancelled) return;
        setEditableSections(sections);
        setTemplates(loadedTemplates);
        if (organization) {
          const organizationLogo = (organization as typeof organization & { BrandLogoUrl?: string }).brandLogoUrl
            || (organization as typeof organization & { BrandLogoUrl?: string }).BrandLogoUrl
            || "";
          setOrganizationLogoUrl(organizationLogo);
        }
        setLeases(leaseResponse.data.map((lease) => ({ leaseID: lease.leaseID, leaseCode: lease.leaseCode, leaseNumber: lease.leaseNumber, status: lease.status })));
        const defaultTemplate = loadedTemplates.find((template) => template.isDefault && template.isActive)
          ?? loadedTemplates.find((template) => template.isActive)
          ?? loadedTemplates[0];
        if (defaultTemplate) {
          const template = await getLeaseContractTemplateByID(defaultTemplate.leaseContractTemplateID);
          if (cancelled) return;
          const extracted = extractSectionRanges(template.htmlContent);
          setSelectedTemplate(template);
          setSelectedTemplateID(template.leaseContractTemplateID);
          setOriginalHtml(template.htmlContent);
          setDrafts(Object.fromEntries(sections.filter((section) => extracted.has(section.sectionNumber)).map((section) => [section.sectionNumber, extracted.get(section.sectionNumber)!.content])));
          setTemplateName(template.templateName);
          setDescription(template.description);
          setIsDefault(template.isDefault);
          setIsActive(template.isActive);
        }
      } catch (loadError) {
        if (!cancelled) setError(getApiMessage(loadError));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void loadEditor();
    return () => { cancelled = true; };
  }, [organizationID, listingID]);

  const startNewTemplate = async () => {
    setError("");
    setNotice("");
    setIsLoading(true);
    try {
      const htmlContent = await getStandardLeaseContractTemplate();
      const extracted = extractSectionRanges(htmlContent);
      setSelectedTemplate(null);
      setSelectedTemplateID("");
      setOriginalHtml(htmlContent);
      setDrafts(Object.fromEntries(editableSections.filter((section) => extracted.has(section.sectionNumber)).map((section) => [section.sectionNumber, extracted.get(section.sectionNumber)!.content])));
      setTemplateName("Custom lease agreement");
      setDescription("");
      setIsDefault(false);
      setIsActive(true);
      setIsNewTemplate(true);
      setChangeSummary("Created from standard template");
      setVersions(null);
    } catch (loadError) {
      setError(getApiMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  };

  const saveTemplate = async () => {
    if (!organizationID || !templateName.trim() || isSaving || unmappedEditableSections.length > 0) return;
    setError("");
    setNotice("");
    setIsSaving(true);
    try {
      const payload: LeaseContractTemplateUpsert = {
        organizationID,
        templateName: templateName.trim(),
        description: description.trim(),
        htmlContent: edited.htmlContent,
        isDefault,
        isActive,
        changeSummary: changeSummary.trim() || (isNewTemplate ? "Created custom lease template" : "Updated lease template"),
        editedSectionNumbers: edited.editedSectionNumbers,
        updatedBy,
      };
      const savedTemplate = isNewTemplate
        ? await createLeaseContractTemplate(payload)
        : selectedTemplateID
          ? await updateLeaseContractTemplate(selectedTemplateID, payload)
          : null;
      if (!savedTemplate) throw new Error("Select a template before saving changes.");
      setNotice(isNewTemplate ? "Template created." : "Changes saved.");
      setSelectedTemplate(savedTemplate);
      setSelectedTemplateID(savedTemplate.leaseContractTemplateID);
      setOriginalHtml(payload.htmlContent);
      setDrafts(Object.fromEntries(editableSections.filter((section) => ranges.has(section.sectionNumber)).map((section) => [section.sectionNumber, drafts[section.sectionNumber] ?? ranges.get(section.sectionNumber)!.content])));
      setIsNewTemplate(false);
      setChangeSummary("");
      await loadTemplates("");
    } catch (saveError) {
      setError(getApiMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  };

  const makeDefault = async () => {
    if (!selectedTemplateID || isSettingDefault) return;
    setError("");
    setNotice("");
    setIsSettingDefault(true);
    try {
      await setDefaultLeaseContractTemplate(selectedTemplateID, updatedBy);
      const loaded = await loadTemplates("");
      const selected = loaded.find((template) => template.leaseContractTemplateID === selectedTemplateID);
      if (selected) setSelectedTemplate(selected);
      setIsDefault(true);
      setNotice("Default lease template updated.");
    } catch (defaultError) {
      setError(getApiMessage(defaultError));
    } finally {
      setIsSettingDefault(false);
    }
  };

  const loadVersions = async () => {
    if (!selectedTemplateID) return;
    setIsLoadingVersions(true);
    setError("");
    try {
      setVersions(await getLeaseContractTemplateVersions(selectedTemplateID));
    } catch (historyError) {
      setError(getApiMessage(historyError));
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const showPreview = async () => {
    if (!originalHtml || isRenderingPreview) return;
    setIsRenderingPreview(true);
    setError("");
    try {
      if (edited.editedSectionNumbers.length > 0 || isNewTemplate || !selectedTemplateID) {
        setPreview({
          leaseContractTemplateID: selectedTemplateID || null,
          templateName: templateName || "Lease agreement",
          isFallbackTemplate: isNewTemplate,
          rawHtml: originalHtml,
          renderedHtml: hideLeaseAgreementFieldsWithoutValues(applyOrganizationLogoToPreview(edited.htmlContent, organizationLogoUrl, organizationName)),
          previewMode: edited.editedSectionNumbers.length > 0 || isNewTemplate ? "draft" : "template",
        });
        return;
      }
      const latestTemplate = await refreshLatestTemplate();
      if (!latestTemplate) return;
      if (selectedLeaseID) {
        const renderedPreview = await renderLeaseContractPreview(selectedLeaseID, selectedTemplateID);
        setPreview({ ...renderedPreview, renderedHtml: hideLeaseAgreementFieldsWithoutValues(applyOrganizationLogoToPreview(renderedPreview.renderedHtml, organizationLogoUrl, organizationName)), previewMode: "rendered" });
      } else {
        setPreview({
          leaseContractTemplateID: latestTemplate.leaseContractTemplateID,
          templateName: latestTemplate.templateName,
          isFallbackTemplate: false,
          rawHtml: latestTemplate.htmlContent,
          renderedHtml: hideLeaseAgreementFieldsWithoutValues(applyOrganizationLogoToPreview(latestTemplate.htmlContent, organizationLogoUrl, organizationName)),
          previewMode: "template",
        });
      }
    } catch (previewError) {
      setError(getApiMessage(previewError));
    } finally {
      setIsRenderingPreview(false);
    }
  };

  if (!organizationID) {
    return <section className="lease-agreement-editor"><h2>Lease Agreement</h2><p>This listing is not linked to an organization, so its lease templates can’t be loaded.</p></section>;
  }

  return (
    <section className="lease-agreement-editor" aria-labelledby="lease-agreement-title">
      <header className="lease-agreement-header">
        <div>
          <p className="marketplace-eyebrow">LEASE DOCUMENTS</p>
          <h2 id="lease-agreement-title">Lease Agreement</h2>
          <p>Manage the templates your organization uses for tenant leases.</p>
        </div>
        <label className={`lease-agreement-logo-upload${isUploadingLogo ? " is-uploading" : ""}`} title={isUploadingLogo ? "Uploading organization logo" : "Upload organization logo"}>
          {organizationLogoUrl
            ? <img src={organizationLogoUrl} alt={`${organizationName} logo`} onError={() => setOrganizationLogoUrl("")} />
            : <span className="lease-agreement-logo-initials">{organizationName.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "O"}</span>}
          <span className="lease-agreement-logo-edit"><CameraIcon /></span>
          <input type="file" accept="image/*" aria-label={`Upload ${organizationName} brand logo`} disabled={isUploadingLogo} onChange={(event) => void uploadBrandLogo(event)} />
        </label>
        <button type="button" className="lease-agreement-new" onClick={() => void startNewTemplate()} disabled={isLoading}>
          <FileIcon /> New template
        </button>
      </header>

      {error && <div className="lease-agreement-message is-error" role="alert">{error}</div>}
      {notice && <div className="lease-agreement-message is-success" role="status">{notice}</div>}

      <div className="lease-agreement-workspace">
        <div className="lease-agreement-detail">
          {isLoading ? <div className="lease-agreement-loading" role="status">Loading lease template...</div>
            : !selectedTemplate && !isNewTemplate ? <div className="lease-agreement-empty-state"><FileIcon /><h3>Choose a template</h3><p>Select an organization template or create a custom copy to begin.</p></div>
            : <>
              <div className="lease-agreement-template-heading">
                <div><span>{isNewTemplate ? "NEW CUSTOM TEMPLATE" : `VERSION ${selectedTemplate?.currentVersionNumber ?? 1}`}</span><h3>{templateName || "Lease template"}</h3></div>
                {templates.length > 1 && !isNewTemplate && <CustomSelect value={templateOptionLabel(templates.find((template) => template.leaseContractTemplateID === selectedTemplateID) ?? templates[0])} options={templates.map(templateOptionLabel)} onChange={(label) => { const template = templates.find((item) => templateOptionLabel(item) === label); if (template) void openTemplate(template.leaseContractTemplateID); }} ariaLabel="Switch lease template" />}
                {isDefault && <span className="lease-agreement-default"><CheckIcon /> Organization default</span>}
              </div>
              <div className="lease-agreement-metadata">
                <label><span>Template name</span><input value={templateName} onChange={(event) => setTemplateName(event.target.value)} maxLength={120} /></label>
                <label><span>Description</span><input value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} /></label>
                <div className="lease-agreement-flags">
                  <label><input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} /> Active</label>
                  <label><input type="checkbox" checked={isDefault} onChange={(event) => setIsDefault(event.target.checked)} /> Default</label>
                </div>
              </div>

              {mappedEditableSections.length === 0 ? <div className="lease-agreement-message is-warning" role="status">This template’s numbered section markup could not be safely identified. Editing is disabled to protect locked and non-section content.</div>
                : <>
                  <div className="lease-agreement-section-heading"><div><h3>Editable sections</h3><p>{mappedEditableSections.length} of {editableSections.length} sections are mapped from the server’s editability list.</p></div><span>{edited.editedSectionNumbers.length} changed</span></div>
                  {unmappedEditableSections.length > 0 && <div className="lease-agreement-message is-warning" role="alert">Some server-editable sections aren’t safely identifiable in this HTML ({unmappedEditableSections.map((section) => section.sectionNumber).join(", ")}). Saving is disabled to avoid changing locked content.</div>}
                  {lockedSectionNumbers.length > 0 && <p className="lease-agreement-locked"><ShieldIcon /> Locked sections: {lockedSectionNumbers.join(", ")}</p>}
                  <div className="lease-agreement-sections">{mappedEditableSections.map((section) => (
                    <details className="lease-agreement-section" key={section.sectionNumber}>
                      <summary><span className="lease-agreement-section-number">{section.sectionNumber}</span><strong>{section.title}</strong><span className="lease-agreement-editable-label">Editable</span>{edited.editedSectionNumbers.includes(section.sectionNumber) && <span className="lease-agreement-changed-label">Changed</span>}</summary>
                      <label className="lease-agreement-html-field"><span>{section.title} content (HTML)</span><small>Edit the wording in this section below. Keep the existing HTML tags and section structure intact.</small><textarea spellCheck={false} value={drafts[section.sectionNumber] ?? ""} onChange={(event) => setDrafts((current) => ({ ...current, [section.sectionNumber]: event.target.value }))} rows={8} /></label>
                    </details>
                  ))}</div>
                </>}

              <label className="lease-agreement-change-summary"><span>Change summary</span><input value={changeSummary} onChange={(event) => setChangeSummary(event.target.value)} placeholder="What changed in this version?" maxLength={300} /></label>
              <div className="lease-agreement-actions">
                <div className="lease-agreement-secondary-actions">
                  {!isNewTemplate && selectedTemplateID && <button type="button" onClick={() => void refreshLatestTemplate().then(() => setNotice("Loaded the latest backend version.")).catch((refreshError) => setError(getApiMessage(refreshError)))} disabled={edited.editedSectionNumbers.length > 0}>Reload latest</button>}
                  {!isNewTemplate && selectedTemplateID && <button type="button" onClick={() => void loadVersions()} disabled={isLoadingVersions}>{isLoadingVersions ? "Loading history..." : "Version history"}</button>}
                  {!isNewTemplate && selectedTemplateID && !isDefault && <button type="button" onClick={() => void makeDefault()} disabled={isSettingDefault}>{isSettingDefault ? "Setting default..." : "Set as default"}</button>}
                </div>
                <button type="button" className="lease-agreement-save" onClick={() => void saveTemplate()} disabled={!templateName.trim() || isSaving || unmappedEditableSections.length > 0 || mappedEditableSections.length === 0 || (!isNewTemplate && edited.editedSectionNumbers.length === 0 && selectedTemplate?.templateName === templateName && selectedTemplate.description === description && selectedTemplate.isActive === isActive && selectedTemplate.isDefault === isDefault)}>
                  {isSaving ? "Saving..." : isNewTemplate ? "Save as new template" : "Save changes"}
                </button>
              </div>

              <div className="lease-agreement-preview-bar">
                <div><strong>Full agreement</strong><span>{edited.editedSectionNumbers.length > 0 || isNewTemplate ? "Preview includes your unsaved section changes; merged tenant data is available after saving." : "Choose a lease to merge its listing, tenant, and organization data. Leave unselected to view the complete template."}</span></div>
                {leaseOptions.length > 0 ? <CustomSelect value={leaseOptions.find((lease) => lease.value === selectedLeaseID)?.label || "Choose lease (optional)"} options={leaseOptions.map((lease) => lease.label)} onChange={(label) => setSelectedLeaseID(leaseOptions.find((lease) => lease.label === label)?.value || "")} ariaLabel="Optional lease for merged preview" /> : <span className="lease-agreement-no-leases">No lease available for data merge</span>}
                <button type="button" onClick={() => void showPreview()} disabled={!originalHtml || isRenderingPreview}><EyeIcon /> {isRenderingPreview ? "Opening..." : "View full agreement"}</button>
              </div>

              {versions && <section className="lease-agreement-history"><div><h3>Version history</h3><button type="button" onClick={() => setVersions(null)}>Close</button></div>{versions.length === 0 ? <p>No versions recorded.</p> : <ol>{versions.map((version, index) => <li key={versionValue(version, "leaseContractTemplateVersionID", "versionID") || index}><strong>Version {versionValue(version, "versionNumber", "currentVersionNumber") || versions.length - index}</strong><span>{versionValue(version, "changeSummary", "description") || "Template updated"}</span><small>{versionValue(version, "updatedDate", "capturedDate", "createdDate")} · {versionValue(version, "updatedBy", "capturedBy")}</small></li>)}</ol>}</section>}
            </>}
        </div>
      </div>

      {preview && <div className="lease-agreement-preview-overlay" role="presentation" onClick={() => setPreview(null)}>
        <section className="lease-agreement-preview-dialog" role="dialog" aria-modal="true" aria-label="Rendered lease preview" onClick={(event) => event.stopPropagation()}>
          <header><div><span>{preview.previewMode === "rendered" ? "MERGED LEASE PREVIEW" : preview.previewMode === "draft" ? "UNSAVED DRAFT PREVIEW" : "FULL TEMPLATE PREVIEW"}</span><h3>{preview.templateName || "Lease agreement"}</h3>{preview.previewMode === "draft" && <small>Unsaved edits are shown; merged tenant data appears after saving.</small>}{preview.previewMode === "template" && <small>Showing the complete template with locked sections included.</small>}{preview.isFallbackTemplate && <small>Showing the standard fallback template.</small>}</div><button type="button" aria-label="Close preview" onClick={() => setPreview(null)}>×</button></header>
          <iframe title="Rendered lease agreement" sandbox="" srcDoc={preview.renderedHtml} />
        </section>
      </div>}
    </section>
  );
}