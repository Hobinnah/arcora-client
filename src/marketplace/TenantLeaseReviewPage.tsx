import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckIcon, FileIcon, PdfIcon, ShieldIcon } from '../components/Icons';
import { createLeaseSigningRequest, getLease, getLeaseSigningStatus, type LeaseSigningStatus } from '../apis/useLease';
import { getLeaseContractTemplatesByOrganizationID, hideLeaseAgreementFieldsWithoutValues, renderLeaseContractPreview, type LeaseContractTemplatePreview } from '../apis/useLeaseContractTemplate';
import { fetchLeaseDocuments } from '../apis/useLeaseDocuments';
import { fetchLeaseSignatories } from '../apis/useLeaseSignatories';
import { getTenantByUserID } from '../apis/useTenant';
import { useAuth } from '../hooks/useAuth';
import type { Lease } from '../types/Lease';
import type { LeaseDocuments } from '../types/LeaseDocuments';
import type { LeaseSignatories } from '../types/LeaseSignatories';
import TenantHeader from './TenantHeader';
import MarketplaceFooter from './MarketplaceFooter';
import './TenantLeaseExperience.css';

type LeaseReviewPageData = {
  leaseId: string;
  lease?: Lease;
  leaseDocument?: LeaseDocuments | null;
  signatories: LeaseSignatories[];
  tenantID?: string;
  leaseContractTemplateID?: string;
  signingRequestSent?: boolean;
  signingRequestID?: string;
  error?: string;
};

const IN_PROGRESS_SIGNING_STATUSES = new Set([
  'QUEUED',
  'DRAFT',
  'PROCESSING',
  'SENT',
  'SENT_FOR_SIGNATURE',
  'PENDING_SIGNATURE',
  'PARTIALLY_SIGNED',
  'PENDING_REVIEW',
]);
const CLOSED_SIGNING_STATUSES = new Set(['FAILED', 'SIGNED', 'FULLY_SIGNED', 'COMPLETED', 'DECLINED', 'CANCELLED', 'VOIDED', 'EXPIRED']);
const TERMINAL_SIGNING_STATUSES = new Set(['FULLY_SIGNED', 'SIGNED', 'COMPLETED', 'DECLINED', 'FAILED']);
const RESENDABLE_SIGNING_STATUSES = new Set(['FAILED', 'DECLINED']);
const SIGNING_STATUS_LABELS: Record<string, string> = {
  QUEUED: 'Preparing document',
  PROCESSING: 'Preparing document',
  PENDING_REVIEW: 'Waiting for manual review',
  SENT_FOR_SIGNATURE: 'Sent for signature',
  PARTIALLY_SIGNED: 'Partially signed',
  FULLY_SIGNED: 'Completed',
  SIGNED: 'Completed',
  COMPLETED: 'Completed',
  DECLINED: 'Declined',
  FAILED: 'Failed',
};
const SIGNING_STATUS_POLL_MS = 5 * 60 * 1000;

// Handles both SCREAMING_SNAKE ("SENT_FOR_SIGNATURE") and PascalCase ("SentForSignature") values.
const normalizeSigningStatus = (value?: string | null) => (value ?? '')
  .trim()
  .replace(/([a-z])([A-Z])/g, '$1_$2')
  .replace(/[\s-]+/g, '_')
  .toUpperCase();
const formatSigningStatus = (value?: string | null) => {
  const status = normalizeSigningStatus(value);
  return SIGNING_STATUS_LABELS[status]
    ?? (status ? status.toLowerCase().replace(/_/g, ' ').replace(/^\w/, (letter) => letter.toUpperCase()) : 'Unknown');
};
const formatSigningTimestamp = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
};

const signingRequestStorageKey = (leaseID: string) => `arcora.leaseSigningRequest.${leaseID}`;
const readStoredSigningRequestID = (leaseID: string) => {
  try {
    return window.localStorage.getItem(signingRequestStorageKey(leaseID)) || undefined;
  } catch {
    return undefined;
  }
};
const storeSigningRequestID = (leaseID: string, signingRequestID: string) => {
  try {
    window.localStorage.setItem(signingRequestStorageKey(leaseID), signingRequestID);
  } catch {
    // Storage can be unavailable (private mode); the lease document fallback still applies.
  }
};

// A failed or closed request may be re-sent; anything still moving through the signing pipeline may not.
const isSigningRequestInProgress = (document: LeaseDocuments) => {
  if (document.documentType && document.documentType.toUpperCase() !== 'LEASE_AGREEMENT') return false;
  const status = document.documentStatus?.toUpperCase().replace(/[\s-]+/g, '_') ?? '';
  if (IN_PROGRESS_SIGNING_STATUSES.has(status)) return true;
  return Boolean(document.sentForSignatureAt) && !CLOSED_SIGNING_STATUSES.has(status);
};

const formatLeaseDate = (value?: string) => {
  if (!value) return 'Not provided';
  const date = new Date(value.includes('T') ? value : `${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return 'Not provided';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const formatLeaseAmount = (value: number | undefined, currency?: string) => {
  if (value === undefined || !Number.isFinite(value)) return 'Not provided';
  const currencyCode = currency && /^[A-Z]{3}$/.test(currency) ? currency : 'CAD';
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: currencyCode }).format(value);
};

const getLogoSourceCandidates = (src: string) => {
  const candidates = [src];
  try {
    const url = new URL(src, window.location.href);
    const isAzurite = ['127.0.0.1:10000', 'localhost:10000'].includes(url.host);
    if (isAzurite && url.origin !== window.location.origin) {
      candidates.unshift(`${window.location.origin}${url.pathname}${url.search}`);
    }
  } catch {
    // Keep the original source only.
  }
  return candidates;
};

const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error('Logo could not be loaded.'));
  image.src = src;
});

const createCircularLogoDataUrl = async (src: string) => {
  for (const candidate of getLogoSourceCandidates(src)) {
    try {
      const image = await loadImage(candidate);
      const size = 320;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d');
      if (!context || !image.naturalWidth || !image.naturalHeight) continue;
      const scale = Math.max(size / image.naturalWidth, size / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.save();
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      context.closePath();
      context.clip();
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, size, size);
      context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
      context.restore();
      return canvas.toDataURL('image/png');
    } catch {
      // Try the next source (cross-origin images without CORS taint the canvas).
    }
  }
  return null;
};

const createLeaseAgreementPdf = async (agreementDocument: Document) => {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 17;
  const contentWidth = pageWidth - margin * 2;
  const bottom = pageHeight - margin - 8;
  let y = 20;

  const addPage = () => {
    pdf.addPage();
    y = margin;
  };
  const ensureSpace = (height: number) => {
    if (y + height > bottom) addPage();
  };
  const cleanText = (value: string) => value.replace(/\uFFFD/g, '').replace(/\s+/g, ' ').trim();
  const addText = (value: string, options: {
    fontSize: number;
    font: 'times' | 'helvetica';
    style?: 'normal' | 'bold' | 'italic';
    color: [number, number, number];
    width?: number;
    indent?: number;
    after?: number;
  }) => {
    const text = cleanText(value);
    if (!text) return;
    const indent = options.indent ?? 0;
    const lineHeight = options.fontSize * 0.48;
    pdf.setFont(options.font, options.style ?? 'normal');
    pdf.setFontSize(options.fontSize);
    pdf.setTextColor(...options.color);
    const lines = pdf.splitTextToSize(text, options.width ?? contentWidth - indent) as string[];
    for (const line of lines) {
      ensureSpace(lineHeight);
      pdf.text(line, margin + indent, y);
      y += lineHeight;
    }
    y += options.after ?? 0;
  };

  const renderTable = (table: HTMLTableElement) => {
    const labelWidth = contentWidth * 0.35;
    const valueWidth = contentWidth - labelWidth;
    pdf.setFontSize(9);
    for (const row of Array.from(table.rows)) {
      const cells = Array.from(row.cells);
      if (cells.length === 0) continue;
      const label = cleanText(cells[0].innerText);
      const value = cleanText(cells.slice(1).map((cell) => cell.innerText).filter(Boolean).join(' · '));
      const labelLines = label ? pdf.splitTextToSize(label, labelWidth - 7) as string[] : [];
      const valueLines = value ? pdf.splitTextToSize(value, valueWidth - 7) as string[] : [];
      const lineHeight = 4.5;
      const rowHeight = Math.max(11, Math.max(labelLines.length, valueLines.length) * lineHeight + 6);
      ensureSpace(rowHeight);
      pdf.setDrawColor(209, 213, 219);
      pdf.setFillColor(249, 250, 251);
      pdf.rect(margin, y, labelWidth, rowHeight, 'FD');
      pdf.rect(margin + labelWidth, y, valueWidth, rowHeight);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(17, 24, 39);
      if (labelLines.length > 0) pdf.text(labelLines, margin + 3, y + 5);
      pdf.setFont('times', 'normal');
      pdf.setTextColor(31, 41, 55);
      if (valueLines.length > 0) pdf.text(valueLines, margin + labelWidth + 3, y + 5);
      y += rowHeight;
    }
    y += 3;
  };

  const renderBlock = (element: Element) => {
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'h2' || tagName === 'h3' || tagName === 'h4') {
      y += 2;
      ensureSpace(9);
      pdf.setFillColor(13, 148, 136);
      pdf.rect(margin, y - 4, 1.1, 6, 'F');
      addText(element.textContent ?? '', {
        fontSize: tagName === 'h2' ? 12 : 10,
        font: 'helvetica',
        style: 'bold',
        color: [15, 58, 52],
        indent: 4,
        after: 2,
      });
      return;
    }
    if (tagName === 'table') {
      renderTable(element as HTMLTableElement);
      return;
    }
    if (tagName === 'p') {
      addText(element.textContent ?? '', { fontSize: 10, font: 'times', color: [31, 41, 55], after: 3 });
      return;
    }
    if (tagName === 'li') {
      addText(`- ${element.textContent ?? ''}`, { fontSize: 10, font: 'times', color: [31, 41, 55], indent: 3, after: 2 });
      return;
    }
    for (const child of Array.from(element.children)) renderBlock(child);
  };

  const agreementPage = agreementDocument.querySelector('.page');
  if (!agreementPage) throw new Error('The lease agreement could not be prepared as a PDF.');
  const title = cleanText(agreementPage.querySelector('h1')?.textContent ?? 'Lease Agreement');
  pdf.setProperties({ title, subject: 'Lease agreement', creator: 'Arcora' });
  const logoElement = agreementPage.querySelector<HTMLImageElement>('img.logo, .header img');
  const logoAlt = logoElement?.alt ?? '';
  const initials = (logoAlt.replace(/\s+logo$/i, '').match(/\b\w/g) || []).join('').slice(0, 2).toUpperCase();
  const logoSrc = logoElement?.currentSrc || logoElement?.getAttribute('src') || '';
  const logoDataUrl = logoSrc ? await createCircularLogoDataUrl(logoSrc) : null;
  const logoSize = 18;
  const logoX = pageWidth - margin - logoSize;
  const logoY = y - 7;
  const logoCenterX = logoX + logoSize / 2;
  const logoCenterY = logoY + logoSize / 2;
  const titleLines = pdf.splitTextToSize(title, contentWidth - logoSize - 6) as string[];
  pdf.setFont('times', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(15, 58, 52);
  pdf.text(titleLines, margin, y);
  if (logoDataUrl || initials) {
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(229, 231, 235);
    if (logoDataUrl) {
      pdf.addImage(logoDataUrl, 'PNG', logoX, logoY, logoSize, logoSize);
      pdf.circle(logoCenterX, logoCenterY, logoSize / 2, 'S');
    } else {
      pdf.setFillColor(15, 58, 52);
      pdf.circle(logoCenterX, logoCenterY, logoSize / 2, 'FD');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.setTextColor(255, 255, 255);
      pdf.text(initials, logoCenterX, logoCenterY, { align: 'center', baseline: 'middle' });
    }
  }
  const titleBottom = y + (titleLines.length - 1) * 9 + 4;
  y = Math.max(titleBottom, logoDataUrl || initials ? logoY + logoSize : 0) + 5;
  addText(agreementPage.querySelector('.subhead')?.textContent ?? '', {
    fontSize: 10,
    font: 'times',
    color: [75, 85, 99],
    after: 2,
  });
  addText(agreementPage.querySelector('.meta')?.textContent ?? '', {
    fontSize: 9,
    font: 'helvetica',
    color: [107, 114, 128],
    after: 3,
  });
  pdf.setDrawColor(15, 58, 52);
  pdf.setLineWidth(0.6);
  pdf.line(margin, y, pageWidth - margin, y);
  pdf.setLineWidth(0.2);
  y += 7;

  const agreementBody = agreementPage.querySelector('main, .body');
  if (agreementBody) {
    for (const block of Array.from(agreementBody.children)) renderBlock(block);
  }
  const footer = agreementPage.querySelector('.footer');
  if (footer && cleanText(footer.textContent ?? '')) {
    y += 14;
    ensureSpace(14);
    pdf.setDrawColor(229, 231, 235);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 6;
    addText(footer.textContent ?? '', { fontSize: 8, font: 'helvetica', color: [107, 114, 128], after: 2 });
  }

  const totalPages = pdf.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    pdf.setPage(page);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Lease Agreement · Page ${page} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }
  return pdf;
};

export default function TenantLeaseReviewPage() {
  const { leaseId } = useParams<{ leaseId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
  const [pageData, setPageData] = useState<LeaseReviewPageData | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [signingNotice, setSigningNotice] = useState('');
  const [signingError, setSigningError] = useState('');
  const [newSigningRequestID, setNewSigningRequestID] = useState<string>();
  const [signingStatus, setSigningStatus] = useState<LeaseSigningStatus | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [signingStatusError, setSigningStatusError] = useState('');
  const [signingStatusNote, setSigningStatusNote] = useState('');
  const statusCheckInProgressRef = useRef(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isAgreementPreviewOpen, setIsAgreementPreviewOpen] = useState(false);
  const [isLoadingAgreement, setIsLoadingAgreement] = useState(false);
  const [isAgreementDocumentReady, setIsAgreementDocumentReady] = useState(false);
  const [agreementPreview, setAgreementPreview] = useState<LeaseContractTemplatePreview | null>(null);
  const [agreementError, setAgreementError] = useState('');
  const [agreementDownloadError, setAgreementDownloadError] = useState('');
  const [isDownloadingAgreement, setIsDownloadingAgreement] = useState(false);
  const agreementFrameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!isAgreementPreviewOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsAgreementPreviewOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isAgreementPreviewOpen]);

  useEffect(() => {
    if (!leaseId) return;
    let cancelled = false;
    const loadLeaseReview = async () => {
      try {
        const tenantRequest = userID
          ? getTenantByUserID(userID).catch(() => currentUser?.tenant ?? null)
          : Promise.resolve(currentUser?.tenant ?? null);
        const [lease, documentResponse, tenant] = await Promise.all([
          getLease(leaseId),
          fetchLeaseDocuments({ pageSize: 200, pageNumber: 0 }),
          tenantRequest,
        ]);
        const leaseDocuments = documentResponse.data.filter((item) => item.leaseID === lease.leaseID);
        const leaseDocument = leaseDocuments.find((item) => item.isPrimary) ?? leaseDocuments[0] ?? null;
        const signingRequestSent = leaseDocuments.some(isSigningRequestInProgress);
        const latestAgreementDocument = leaseDocuments
          .filter((item) => !item.documentType || item.documentType.toUpperCase() === 'LEASE_AGREEMENT')
          .sort((first, second) => String(second.capturedDate ?? '').localeCompare(String(first.capturedDate ?? '')))[0];
        const signingRequestID = readStoredSigningRequestID(lease.leaseID) || latestAgreementDocument?.leaseDocumentID;
        const organizationID = lease.organizationID || lease.organization?.organizationID;
        const [signatoryResponse, templateResponse] = await Promise.all([
          leaseDocument
            ? fetchLeaseSignatories({ pageSize: 200, pageNumber: 0, leaseDocumentID: leaseDocument.leaseDocumentID })
            : Promise.resolve({ data: [], totalCount: 0 }),
          organizationID
            ? getLeaseContractTemplatesByOrganizationID(organizationID, 1, 50).catch(() => ({ data: [], totalCount: 0 }))
            : Promise.resolve({ data: [], totalCount: 0 }),
        ]);
        const templates = templateResponse.data.filter((template) => template.leaseContractTemplateID);
        const activeTemplates = templates.filter((template) => template.isActive);
        const signingTemplate = activeTemplates.find((template) => template.isDefault)
          ?? activeTemplates[0]
          ?? templates.find((template) => template.isDefault)
          ?? templates[0];
        if (!cancelled) {
          setPageData({
            leaseId,
            lease,
            leaseDocument,
            signatories: signatoryResponse.data,
            tenantID: tenant?.tenantID ?? currentUser?.tenant?.tenantID,
            leaseContractTemplateID: signingTemplate?.leaseContractTemplateID,
            signingRequestSent,
            signingRequestID,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setPageData({
            leaseId,
            signatories: [],
            error: error instanceof Error ? error.message : 'We could not load this lease.',
          });
        }
      }
    };
    void loadLeaseReview();
    return () => { cancelled = true; };
  }, [leaseId, userID, currentUser?.tenant]);

  const isLoading = !pageData || pageData.leaseId !== leaseId;
  const leaseRecord = !isLoading ? pageData.lease : undefined;
  const leaseOrganization = leaseRecord?.organization as {
    DisplayName?: string;
    displayName?: string;
    legalName?: string;
  } | undefined;
  const leaseDocument = !isLoading ? pageData.leaseDocument : undefined;
  const listingOrganization = leaseRecord?.listing?.organization as {
    DisplayName?: string;
    displayName?: string;
    legalName?: string;
  } | undefined;
  const listingPhotos = leaseRecord?.listing?.listingPhotos ?? [];
  const coverPhoto = listingPhotos.find((photo) => photo.isCoverPhoto)
    ?? [...listingPhotos].sort((first, second) => first.displayOrder - second.displayOrder)[0];
  const currentSignatory = !isLoading
    ? pageData.signatories.find((signatory) => (userID !== undefined && signatory.userID === userID) || (pageData.tenantID && signatory.tenantID === pageData.tenantID))
    : undefined;
  const signed = currentSignatory?.status?.toUpperCase() === 'SIGNED';
  const leaseTenantMatchesUser = userID !== undefined && leaseRecord?.tenant?.userID === userID;
  const signingTenantID = pageData?.tenantID === leaseRecord?.tenantID
    ? pageData?.tenantID
    : leaseTenantMatchesUser ? leaseRecord?.tenantID : undefined;
  const leaseContractTemplateID = !isLoading ? pageData.leaseContractTemplateID : undefined;
  const signingRequestID = newSigningRequestID ?? (!isLoading ? pageData.signingRequestID : undefined);
  const liveSigningStatus = normalizeSigningStatus(signingStatus?.status);
  const isSigningCompleted = ['FULLY_SIGNED', 'SIGNED', 'COMPLETED'].includes(liveSigningStatus);
  const allSigningPartiesSigned = (signingStatus?.signatories.length ?? 0) >= 2
    && (signingStatus?.signatories.every((signatory) => normalizeSigningStatus(signatory.status) === 'SIGNED') ?? false);
  // The live status endpoint wins over the lease-document snapshot taken on page load.
  const signingRequestSent = liveSigningStatus
    ? !RESENDABLE_SIGNING_STATUSES.has(liveSigningStatus)
    : Boolean(signingNotice) || Boolean(!isLoading && pageData.signingRequestSent);
  // The backend generates the signing document from the organization's template, so no pre-existing lease document is required.
  const canSign = Boolean(leaseContractTemplateID)
    && !['SIGNED', 'DECLINED', 'CANCELLED'].includes(currentSignatory?.status?.toUpperCase() ?? '');
  const lease = leaseRecord ? {
    id: leaseRecord.leaseID,
    property: leaseRecord.listing?.title || leaseRecord.rentalUnit?.property?.name || 'Rental home',
    location: [
      leaseRecord.rentalUnit?.property?.address?.city,
      leaseRecord.rentalUnit?.property?.address?.provinceCode,
      leaseRecord.rentalUnit?.property?.address?.countryCode,
    ].filter(Boolean).join(', ') || 'Location not provided',
    startDate: formatLeaseDate(leaseRecord.startDate),
    endDate: formatLeaseDate(leaseRecord.endDate),
    term: leaseRecord.leaseTermMonths ? `${leaseRecord.leaseTermMonths} months` : 'Not provided',
    rent: formatLeaseAmount(leaseRecord.baseRentAmount, leaseRecord.currency),
    deposit: formatLeaseAmount(leaseRecord.listing?.securityDepositAmount, leaseRecord.currency),
    landlord: leaseOrganization?.DisplayName || leaseOrganization?.displayName || leaseOrganization?.legalName
      || listingOrganization?.DisplayName || listingOrganization?.displayName || listingOrganization?.legalName || 'Landlord',
  } : null;
  const signatories = !isLoading
    ? signingStatus?.signatories.length
      ? signingStatus.signatories
        .map((signatory, index) => {
          const role = normalizeSigningStatus(signatory.role);
          const status = normalizeSigningStatus(signatory.status);
          return {
            name: signatory.name || signatory.email || 'Signatory',
            role: role === 'TENANT' ? 'Primary tenant'
              : role === 'LANDLORD' ? 'Landlord'
                : signatory.role?.replace(/[_-]+/g, ' ') || 'Signatory',
            status: status === 'SIGNED' ? 'Signed'
              : status === 'DECLINED' ? 'Declined'
                : status === 'VIEWED' ? 'Viewed'
                  : status === 'PENDING' ? 'Pending'
                    : formatSigningStatus(signatory.status),
            order: signatory.signatureOrder ?? index,
          };
        })
        .sort((first, second) => first.order - second.order)
      : [
        ...pageData.signatories.map((signatory) => {
          const isLandlord = /landlord|owner|lessor|property manager/i.test(signatory.signatoryRole || '');
          const isCurrentTenant = signatory.leaseSignatoryID === currentSignatory?.leaseSignatoryID;
          return {
            name: isLandlord ? lease?.landlord || signatory.name || signatory.email || 'Landlord' : signatory.name || signatory.email || 'Signatory',
            role: signatory.signatoryRole || 'Signatory',
            status: signatory.status?.toUpperCase() === 'SIGNED'
              ? 'Signed'
              : isCurrentTenant && signingRequestSent
                ? 'Signing request sent'
                : isCurrentTenant && canSign
                  ? 'Ready for your signature'
                  : signatory.status || 'Pending',
            order: isCurrentTenant ? 0 : isLandlord ? 1 : 2,
          };
        }),
        ...(!pageData.signatories.some((signatory) => /landlord|owner|lessor|property manager/i.test(signatory.signatoryRole || ''))
          ? [{ name: lease?.landlord || 'Landlord', role: 'Landlord', status: 'Pending', order: 1 }]
          : []),
        ...(!currentSignatory
          ? [{
            name: [currentUser?.user?.firstName, currentUser?.user?.lastName].filter(Boolean).join(' ') || currentUser?.name || 'You',
            role: 'Primary tenant',
            status: signingRequestSent ? 'Signing request sent' : canSign ? 'Ready for your signature' : 'Signature unavailable',
            order: 0,
          }]
          : []),
      ].sort((first, second) => first.order - second.order)
    : [];

  const signLease = async () => {
    if (!leaseId || !confirmed || !canSign || isSigning || signingRequestSent) return;
    const signerName = currentSignatory?.name
      || [currentUser?.user?.firstName, currentUser?.user?.lastName].filter(Boolean).join(' ')
      || currentUser?.name
      || '';
    const signerEmail = currentSignatory?.email || currentUser?.user?.email || '';
    if (!signerName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signerEmail.trim())) {
      setSigningError('A valid name and email address are required to send the agreement for signing.');
      return;
    }
    setIsSigning(true);
    setSigningError('');
    try {
      const signingRequest = await createLeaseSigningRequest(leaseId, {
        ...(leaseContractTemplateID ? { leaseContractTemplateId: leaseContractTemplateID } : {}),
        signatories: [{
          name: signerName.trim(),
          email: signerEmail.trim(),
          role: 'TENANT',
          ...(userID !== undefined ? { userId: userID } : {}),
          ...(signingTenantID ? { tenantId: signingTenantID } : {}),
          ...(currentSignatory?.organizationMemberID ? { organizationMemberId: currentSignatory.organizationMemberID } : {}),
          signatureOrder: 1,
        }],
        sequential: true,
        subject: 'Please sign your lease agreement',
        message: 'Please review and sign the attached lease.',
        capturedBy: signerEmail.trim(),
        forceRegeneratePdf: false,
      });
      storeSigningRequestID(leaseId, signingRequest.signingRequestId);
      setNewSigningRequestID(signingRequest.signingRequestId);
      setSigningStatus(null);
      setSigningStatusError('');
      setSigningStatusNote('');
      setSigningNotice('Lease signing request queued. The signing email will be sent as soon as the agreement is ready.');
    } catch (error) {
      setSigningError(error instanceof Error ? error.message : 'The lease could not be sent for signing. Please try again.');
    } finally {
      setIsSigning(false);
    }
  };

  const checkSigningStatus = async () => {
    if (!leaseId || !signingRequestID || statusCheckInProgressRef.current) return;
    statusCheckInProgressRef.current = true;
    setIsCheckingStatus(true);
    setSigningStatusError('');
    try {
      const status = await getLeaseSigningStatus(leaseId, signingRequestID, true);
      setSigningStatus(status);
      setSigningStatusNote(
        status.refreshedFromProvider === false && (status.providerRequestId || status.providerDocumentId)
          ? 'Showing latest saved status. Live provider refresh may be temporarily unavailable.'
          : '',
      );
    } catch (error) {
      const isNotFound = axios.isAxiosError(error) && error.response?.status === 404;
      setSigningStatusError(isNotFound
        ? 'We could not find a signing request for this lease.'
        : error instanceof Error ? error.message : 'The signing status could not be loaded. Please try again.');
    } finally {
      statusCheckInProgressRef.current = false;
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    if (
      !leaseId
      || !signingRequestID
      || !signingRequestSent
      || allSigningPartiesSigned
      || (liveSigningStatus && TERMINAL_SIGNING_STATUSES.has(liveSigningStatus))
    ) return;
    let cancelled = false;
    let timer = 0;
    const scheduleCheck = () => {
      timer = window.setTimeout(async () => {
        if (cancelled) return;
        if (statusCheckInProgressRef.current) {
          scheduleCheck();
          return;
        }
        statusCheckInProgressRef.current = true;
        setIsCheckingStatus(true);
        setSigningStatusError('');
        try {
          const status = await getLeaseSigningStatus(leaseId, signingRequestID, true);
          if (!cancelled) {
            setSigningStatus(status);
            setSigningStatusNote(
              status.refreshedFromProvider === false && (status.providerRequestId || status.providerDocumentId)
                ? 'Showing latest saved status. Live provider refresh may be temporarily unavailable.'
                : '',
            );
          }
        } catch (error) {
          if (!cancelled) {
            const isNotFound = axios.isAxiosError(error) && error.response?.status === 404;
            setSigningStatusError(isNotFound
              ? 'We could not find a signing request for this lease.'
              : error instanceof Error ? error.message : 'The signing status could not be loaded. Please try again.');
          }
        } finally {
          statusCheckInProgressRef.current = false;
          if (!cancelled) setIsCheckingStatus(false);
        }
        if (!cancelled) scheduleCheck();
      }, SIGNING_STATUS_POLL_MS);
    };
    scheduleCheck();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [leaseId, signingRequestID, signingRequestSent, liveSigningStatus, allSigningPartiesSigned]);

  const downloadLease = () => {
    if (!leaseDocument?.url) {
      window.alert('The lease document is not available for download yet.');
      return;
    }
    const link = document.createElement('a');
    link.href = leaseDocument.url;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.download = leaseDocument.originalFilename || 'lease-document';
    link.click();
  };

  const openAgreementPreview = async () => {
    if (!leaseId || isLoadingAgreement) return;
    setIsAgreementPreviewOpen(true);
    setIsLoadingAgreement(true);
    setIsAgreementDocumentReady(false);
    setAgreementPreview(null);
    setAgreementError('');
    setAgreementDownloadError('');
    try {
      const preview = await renderLeaseContractPreview(leaseId);
      if (!preview.renderedHtml.trim()) throw new Error('The lease agreement preview is empty.');
      setAgreementPreview({
        ...preview,
        renderedHtml: hideLeaseAgreementFieldsWithoutValues(preview.renderedHtml),
      });
    } catch (error) {
      setAgreementError(error instanceof Error ? error.message : 'The lease agreement could not be loaded.');
    } finally {
      setIsLoadingAgreement(false);
    }
  };

  const downloadAgreement = async () => {
    const agreementDocument = agreementFrameRef.current?.contentDocument;
    if (!agreementPreview?.renderedHtml || !isAgreementDocumentReady || !agreementDocument || isDownloadingAgreement) return;
    setIsDownloadingAgreement(true);
    setAgreementDownloadError('');
    try {
      const pdf = await createLeaseAgreementPdf(agreementDocument);
      pdf.save('lease-agreement.pdf');
    } catch (error) {
      setAgreementDownloadError(error instanceof Error ? error.message : 'The PDF could not be generated. Please try again.');
    } finally {
      setIsDownloadingAgreement(false);
    }
  };

  if (isLoading) {
    return <main className="marketplace tenant-lease-page"><TenantHeader /><section className="tenant-lease-layout"><p>Loading lease details...</p></section><MarketplaceFooter /></main>;
  }
  if (!pageData.lease || pageData.error || !lease) {
    return <main className="marketplace tenant-lease-page"><TenantHeader /><section className="tenant-lease-layout"><div className="tenant-lease-main"><h1>Lease unavailable</h1><p>{pageData.error || 'We could not find this lease.'}</p><button type="button" className="tenant-lease-secondary" onClick={() => navigate('/applications')}>Back to my account</button></div></section><MarketplaceFooter /></main>;
  }

  const landlord = lease.landlord;
  const leaseStatus = leaseRecord?.status || 'Pending';
  const canCheckIn = leaseStatus.toUpperCase() === 'ACTIVE';

  return (
    <main className="marketplace tenant-lease-page">
      <TenantHeader />
      <div className="tenant-lease-context">
        <button type="button" onClick={() => navigate('/applications')}>← My account</button>
        <span>Lease {leaseId || lease.id}</span>
      </div>
      <section className="tenant-lease-layout">
        {signed ? (
          <section className="tenant-lease-success">
            <span className="tenant-lease-success-icon">✓</span>
            <p className="marketplace-eyebrow">Signature recorded</p>
            <h1>Your signature is saved.</h1>
            <p>The lease becomes active after all required signatories have signed.</p>
            <div className="tenant-lease-success-actions">
              <button type="button" className="tenant-lease-primary" onClick={downloadLease} disabled={!leaseDocument?.url}>
                <FileIcon /> Download lease document
              </button>
              {canCheckIn && (
                <button type="button" className="tenant-lease-secondary" onClick={() => navigate(`/tenant/leases/${lease.id}/check-in`)}>
                  Check in to your home →
                </button>
              )}
            </div>
            <div className="tenant-lease-success-meta">
              <span>Lease status</span><strong>{leaseStatus}</strong>
              <span>Move-in date</span><strong>{lease.startDate}</strong>
              <span>Landlord</span><strong>{landlord}</strong>
            </div>
          </section>
        ) : (
          <>
            <div className="tenant-lease-main">
              <p className="marketplace-eyebrow">Final lease review</p>
              <h1>Review and sign your lease.</h1>
              <p className="tenant-lease-lead">Review the agreement and lease details before sending it for electronic signature.</p>
              <section className="tenant-lease-document">
                <div className="tenant-lease-document-header">
                  <div>
                    <FileIcon />
                    <span>
                      <strong>{leaseDocument?.originalFilename || leaseDocument?.documentType || 'Lease agreement'}</strong>
                      <small>Prepared for {lease.property}</small>
                    </span>
                  </div>
                  <span className="tenant-lease-document-status">
                    {isSigningCompleted ? 'Signed' : signingRequestSent ? 'Request sent' : canSign ? 'Ready to sign' : leaseDocument?.documentStatus || 'Signature unavailable'}
                  </span>
                </div>
                <div className="tenant-lease-document-body">
                  <h2>Lease summary</h2>
                  <div className="tenant-lease-facts">
                    <div><span>Home</span><strong>{lease.property}</strong><small>{lease.location}</small></div>
                    <div><span>Lease term</span><strong>{lease.term}</strong><small>{lease.startDate} to {lease.endDate}</small></div>
                    <div><span>Monthly rent</span><strong>{lease.rent}</strong><small>{leaseRecord?.currency || 'Currency not provided'}</small></div>
                    <div><span>Security deposit</span><strong>{lease.deposit}</strong><small>{leaseRecord?.currency || 'Currency not provided'}</small></div>
                  </div>
                  <h2>Lease document</h2>
                  <p>Open the agreement to review its full terms before signing.</p>
                  <button type="button" className="tenant-lease-text-action" onClick={() => void openAgreementPreview()} disabled={!leaseId || isLoadingAgreement}>
                    Review Agreement →
                  </button>
                </div>
              </section>
              <label className="tenant-lease-consent">
                <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
                <span>I have reviewed the lease agreement and want to receive it for electronic signing.</span>
              </label>
              {signingNotice && <p className="tenant-lease-signing-message" role="status">{signingNotice}</p>}
              {!signingNotice && signingRequestSent && !isSigningCompleted && <p className="tenant-lease-signing-message" role="status">A signing request for this lease has already been sent. Check your email for the signing invitation.</p>}
              {signingError && <p className="tenant-lease-signing-message is-error" role="alert">{signingError}</p>}
              <div className="tenant-lease-sign-actions">
                <button type="button" className="tenant-lease-primary tenant-lease-sign-button" disabled={!confirmed || !canSign || isSigning || signingRequestSent} onClick={signLease}>
                  <CheckIcon /> {isSigning ? 'Sending for signature...' : isSigningCompleted ? 'Signed' : signingRequestSent ? 'Request Sent' : 'Sign lease electronically'}
                </button>
                <button
                  type="button"
                  className="tenant-lease-secondary tenant-lease-status-button"
                  disabled={!signingRequestID || isCheckingStatus}
                  onClick={checkSigningStatus}
                  title={signingRequestID ? 'Refresh the signing status from the signing provider' : 'No signing request has been sent for this lease yet'}
                >
                  <ShieldIcon /> {isCheckingStatus ? 'Checking...' : 'Check signing status'}
                </button>
              </div>
              {signingStatusError && <p className="tenant-lease-signing-message is-error" role="alert">{signingStatusError}</p>}
              {signingStatus && (
                <section className="tenant-lease-status-panel" aria-live="polite">
                  <header>
                    <span>Signing status</span>
                    <strong className={`is-${liveSigningStatus.toLowerCase()}`}>{formatSigningStatus(signingStatus.status)}</strong>
                  </header>
                  <dl>
                    {signingStatus.providerStatus && <div><dt>Provider status</dt><dd>{signingStatus.providerStatus}</dd></div>}
                    {formatSigningTimestamp(signingStatus.sentForSignatureAt) && <div><dt>Sent for signature</dt><dd>{formatSigningTimestamp(signingStatus.sentForSignatureAt)}</dd></div>}
                    {formatSigningTimestamp(signingStatus.fullySignedAt) && <div><dt>Fully signed</dt><dd>{formatSigningTimestamp(signingStatus.fullySignedAt)}</dd></div>}
                  </dl>
                  {signingStatus.signatories.length > 0 && (
                    <ul>
                      {signingStatus.signatories.map((signatory, index) => (
                        <li key={signatory.leaseSignatoryId || signatory.email || index}>
                          <span>
                            <strong>{signatory.name || signatory.email || 'Signatory'}</strong>
                            <small>{[signatory.role, signatory.email].filter(Boolean).join(' · ')}</small>
                          </span>
                          <em>{formatSigningStatus(signatory.status)}</em>
                        </li>
                      ))}
                    </ul>
                  )}
                  {isSigningCompleted && signingStatus.documentUrl && (
                    <a className="tenant-lease-link" href={signingStatus.documentUrl} target="_blank" rel="noreferrer">Download signed agreement →</a>
                  )}
                  {signingStatusNote && <p className="tenant-lease-status-note">{signingStatusNote}</p>}
                </section>
              )}
            </div>
            <aside className="tenant-lease-sidebar">
              <article className="tenant-lease-cover-card">
                {coverPhoto?.url ? (
                  <img className="tenant-lease-cover-image" src={coverPhoto.url} alt={coverPhoto.altText || `${lease.property} cover`} loading="lazy" />
                ) : (
                  <div className="tenant-lease-cover-placeholder"><FileIcon /><span>Cover photo unavailable</span></div>
                )}
                <div className="tenant-lease-cover-copy">
                  <span>YOUR LEASE HOME</span>
                  <strong>{lease.property}</strong>
                  <small>{lease.location}</small>
                </div>
              </article>
              <p className="marketplace-eyebrow">Signatories</p>
              <h2>Who is signing</h2>
              {signatories.length > 0 ? signatories.map((signatory, index) => (
                <div className="tenant-lease-signatory" key={`${signatory.name}-${signatory.role}-${index}`}>
                  <span className="tenant-lease-signatory-icon">{signatory.status === 'Signed' ? '✓' : '✎'}</span>
                  <span>
                    <strong>{signatory.name}</strong>
                    <small>{signatory.role}</small>
                    <em className={signatory.status === 'Signed' ? 'is-signed' : ''}>{signatory.status}</em>
                  </span>
                </div>
              )) : <p>No signatories are associated with this lease document.</p>}
              <div className="tenant-lease-trust">
                <ShieldIcon />
                <span>Your electronic signing request and signature status are tracked against this lease.</span>
              </div>
            </aside>
          </>
        )}
      </section>
      {isAgreementPreviewOpen && (
        <div className="tenant-lease-agreement-overlay" role="presentation" onClick={() => setIsAgreementPreviewOpen(false)}>
          <section
            className="tenant-lease-agreement-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tenant-lease-agreement-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <p className="marketplace-eyebrow">LEASE AGREEMENT</p>
                <h2 id="tenant-lease-agreement-title">{agreementPreview?.templateName || 'Review Agreement'}</h2>
              </div>
              <button type="button" aria-label="Close agreement preview" onClick={() => setIsAgreementPreviewOpen(false)}>×</button>
            </header>
            {isLoadingAgreement ? <p className="tenant-lease-agreement-message" role="status">Loading the full agreement...</p>
              : agreementError ? <p className="tenant-lease-agreement-message is-error" role="alert">{agreementError}</p>
                : agreementPreview && <iframe ref={agreementFrameRef} title="Full lease agreement" sandbox="allow-same-origin" srcDoc={agreementPreview.renderedHtml} onLoad={() => setIsAgreementDocumentReady(true)} />}
            {agreementDownloadError && <p className="tenant-lease-agreement-message is-error" role="alert">{agreementDownloadError}</p>}
            <footer>
              <button type="button" className="tenant-lease-secondary" onClick={() => setIsAgreementPreviewOpen(false)}>Close</button>
              <button type="button" className="tenant-lease-primary" onClick={() => void downloadAgreement()} disabled={!agreementPreview || !isAgreementDocumentReady || isLoadingAgreement || isDownloadingAgreement}>
                <PdfIcon /> {isDownloadingAgreement ? 'Generating PDF...' : 'Download agreement'}
              </button>
            </footer>
          </section>
        </div>
      )}
      <MarketplaceFooter />
    </main>
  );
}
