{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { LeaseDocuments } from '../types/LeaseDocuments';
import { createLeaseDocuments, updateLeaseDocuments } from '../apis/useLeaseDocuments';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const leaseDocumentsSchema = z.object({
  leaseID: z.string().min(1, "Lease is required"),
  leaseRenewalID: z.string().optional(),
  documentType: z.string().max(50, "Document Type must be less than 50 characters").min(1, "Document Type is required"),
  documentStatus: z.string().max(50, "Document Status must be less than 50 characters").min(1, "Document Status is required").refine(v => (v ?? '') === '' || ["DRAFT", "SENT", "SIGNED", "REJECTED"].includes(v as any), "Invalid Document Status"),
  originalFilename: z.string().max(100, "Original Filename must be less than 100 characters").min(1, "Original Filename is required"),
  storageProvider: z.string().max(100, "Storage Provider must be less than 100 characters").min(1, "Storage Provider is required"),
  storageContainer: z.string().max(255, "Storage Container must be less than 255 characters").optional(),
  storageReference: z.string().max(500, "Storage Reference must be less than 500 characters").min(1, "Storage Reference is required"),
  fileHash: z.string().max(255, "File Hash must be less than 255 characters").optional(),
  isPrimary: z.boolean(),
  generatedAt: z.string().optional(),
  sentForSignatureAt: z.string().optional(),
  fullySignedAt: z.string().optional(),
});

type LeaseDocumentsFormData = z.infer<typeof leaseDocumentsSchema>;

interface LeaseDocumentsFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialLeaseDocuments?: LeaseDocuments | null;
  isEditMode?: boolean;
}

export default function LeaseDocumentsForm({ onAlert, initialLeaseDocuments = null, isEditMode = false }: LeaseDocumentsFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_leaseID, setOpts_leaseID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseID_loading, setOpts_leaseID_loading] = React.useState(false);
  const [opts_leaseRenewalID, setOpts_leaseRenewalID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseRenewalID_loading, setOpts_leaseRenewalID_loading] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  function toQuery(q:any):string{
    if (!q || Object.keys(q).length===0) return '';
    const usp = new URLSearchParams();
    for (const [k,v] of Object.entries(q)) if (v !== undefined && v !== null && String(v) !== '') usp.append(k, String(v));
    const t = usp.toString(); return t ? `?${t}` : '';
  }

  function firstNonEmpty(o:any, keys:string[], fallback:string=''){
    for (const k of keys){ const v = o?.[k]; if (v !== undefined && v !== null && String(v) !== '') return String(v); }
    return fallback;
  }

  async function loadOptions_leaseID(){
    try { setOpts_leaseID_loading(true);
      const url = "api/lease/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'leaseID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["leaseID", "name", "leaseName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["leaseID", "leaseID", "id", "ID", "leaseID", "leaseId"], String(it))
      }));
      setOpts_leaseID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_leaseID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_leaseID(); }, []);

  async function loadOptions_leaseRenewalID(){
    try { setOpts_leaseRenewalID_loading(true);
      const url = "api/leaserenewals/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'leaseRenewalID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["leaseRenewalID", "name", "leaseRenewalName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["leaseRenewalID", "leaseRenewalID", "id", "ID", "leaseRenewalID", "leaseRenewalId"], String(it))
      }));
      setOpts_leaseRenewalID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_leaseRenewalID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_leaseRenewalID(); }, []);

  const getDefaultValues = React.useCallback((): LeaseDocumentsFormData => {
    const src = (initialLeaseDocuments as any) ?? {};
    if (isEditMode && initialLeaseDocuments) {
      return {
        leaseID: (src?.leaseID ?? ""),
        leaseRenewalID: (src?.leaseRenewalID ?? ""),
        documentType: (src?.documentType ?? ""),
        documentStatus: (src?.documentStatus ?? ""),
        originalFilename: (src?.originalFilename ?? ""),
        storageProvider: (src?.storageProvider ?? ""),
        storageContainer: (src?.storageContainer ?? ""),
        storageReference: (src?.storageReference ?? ""),
        fileHash: (src?.fileHash ?? ""),
        isPrimary: Boolean(src?.isPrimary),
        generatedAt: src?.generatedAt ? new Date(src?.generatedAt as any).toISOString().split('T')[0] : "",
        sentForSignatureAt: src?.sentForSignatureAt ? new Date(src?.sentForSignatureAt as any).toISOString().split('T')[0] : "",
        fullySignedAt: src?.fullySignedAt ? new Date(src?.fullySignedAt as any).toISOString().split('T')[0] : "",
      };
    }
    return {
      leaseID: "",
      leaseRenewalID: "",
      documentType: "",
      documentStatus: "",
      originalFilename: "",
      storageProvider: "",
      storageContainer: "",
      storageReference: "",
      fileHash: "",
      isPrimary: false,
      generatedAt: "",
      sentForSignatureAt: "",
      fullySignedAt: "",
    };
  }, [isEditMode, initialLeaseDocuments]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(leaseDocumentsSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialLeaseDocuments && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialLeaseDocuments, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLeaseDocuments && opts_leaseID.length > 0) {
      const currentleaseID = (initialLeaseDocuments as any)?.leaseID ;
      if (currentleaseID !== undefined && currentleaseID!== null) {
        const leaseIDValue = String(currentleaseID);
        if (opts_leaseID.some(opt => opt.value === String(leaseIDValue))) {
          setValue('leaseID', leaseIDValue);
        }
      }
    }
  }, [opts_leaseID, isEditMode, initialLeaseDocuments, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLeaseDocuments && opts_leaseRenewalID.length > 0) {
      const currentleaseRenewalID = (initialLeaseDocuments as any)?.leaseRenewalID ;
      if (currentleaseRenewalID !== undefined && currentleaseRenewalID!== null) {
        const leaseRenewalIDValue = String(currentleaseRenewalID);
        if (opts_leaseRenewalID.some(opt => opt.value === String(leaseRenewalIDValue))) {
          setValue('leaseRenewalID', leaseRenewalIDValue);
        }
      }
    }
  }, [opts_leaseRenewalID, isEditMode, initialLeaseDocuments, setValue]);

  const onSubmitHandler = async (data: LeaseDocumentsFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} leasedocuments...`, 'info');
      const payload: any = {
        leaseDocumentID: (isEditMode ? ((initialLeaseDocuments as any)?.leaseDocumentID ?? null) : null),
        leaseID: data.leaseID ?? '',
        leaseRenewalID: data.leaseRenewalID ?? '',
        documentType: data.documentType ?? '',
        documentStatus: data.documentStatus ?? '',
        originalFilename: data.originalFilename ?? '',
        storageProvider: data.storageProvider ?? '',
        storageContainer: data.storageContainer ?? '',
        storageReference: data.storageReference ?? '',
        fileHash: data.fileHash ?? '',
        isPrimary: data.isPrimary,
        generatedAt: data.generatedAt || null,
        sentForSignatureAt: data.sentForSignatureAt || null,
        fullySignedAt: data.fullySignedAt || null,
        capturedDate : (isEditMode ? ((initialLeaseDocuments as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialLeaseDocuments as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialLeaseDocuments as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialLeaseDocuments as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateLeaseDocuments(payload as LeaseDocuments) : await createLeaseDocuments(payload as LeaseDocuments);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`LeaseDocuments "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/leasedocuments');
    } catch (error: any) {
      const message = error?.message || 'An unknown error occurred';
      onAlert?.(message, 'error');
      console.error('Error saving record:', error);
    }
  };

  const handleBack = () => navigate(-1);
  const handleCancel = () => { reset(getDefaultValues()); onAlert?.(isEditMode ? 'Form reset to original values!' : 'Form cleared successfully!', 'info'); };

  return (
    <section className="card container">
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit LeaseDocuments' : 'Create LeaseDocuments'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Lease *" error={errors.leaseID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('leaseID')}>
              <option value="">Select Lease</option>
              {opts_leaseID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_leaseID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Lease Renewal " error={errors.leaseRenewalID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('leaseRenewalID')}>
              <option value="">Select Lease Renewal</option>
              {opts_leaseRenewalID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_leaseRenewalID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Document Type" error={errors.documentType?.message as string}>
            <input className="input" placeholder="Enter document type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('documentType')}  />
          </Field>
          <Field label="Document Status *" error={errors.documentStatus?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('documentStatus')}>
              <option value="">Select Document Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="SENT">SENT</option>
              <option value="SIGNED">SIGNED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </Field>
          <Field label="Original Filename" error={errors.originalFilename?.message as string}>
            <input className="input" placeholder="Enter original filename" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('originalFilename')}  />
          </Field>
          <Field label="Storage Provider" error={errors.storageProvider?.message as string}>
            <input className="input" placeholder="Enter storage provider" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('storageProvider')}  />
          </Field>
          <Field label="Storage Container" error={errors.storageContainer?.message as string}>
            <textarea className="input" placeholder="Enter storage container" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('storageContainer')} rows={3} />
          </Field>
          <Field label="Storage Reference" error={errors.storageReference?.message as string}>
            <textarea className="input" placeholder="Enter storage reference" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('storageReference')} rows={3} />
          </Field>
          <Field label="File Hash" error={errors.fileHash?.message as string}>
            <textarea className="input" placeholder="Enter file hash" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('fileHash')} rows={3} />
          </Field>
          <Field label="Is Primary" error={errors.isPrimary?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isPrimary')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Generated At" error={errors.generatedAt?.message as string}>
            <input className="input" placeholder="Select generated date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('generatedAt')} />
          </Field>
          <Field label="Sent For Signature At" error={errors.sentForSignatureAt?.message as string}>
            <input className="input" placeholder="Select sent for signature date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('sentForSignatureAt')} />
          </Field>
          <Field label="Fully Signed At" error={errors.fullySignedAt?.message as string}>
            <input className="input" placeholder="Select fully signed date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('fullySignedAt')} />
          </Field>
        </div>
        <div className="form-actions">
          <button className="btn btn-soft" type="button" onClick={handleBack}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ArrowLeftIcon />Back</span>
          </button>
          <button className="btn btn-soft" type="button" onClick={handleCancel}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><XIcon />Cancel</span>
          </button>
          <button className="btn" style={{ background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' }} disabled={isSubmitting}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckIcon />{isSubmitting ? 'Submitting...' : 'Submit'}</span>
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({ label, error, children }: React.PropsWithChildren<{ label: string; error?: string }>) {
  return (
    <div style={{ marginBottom: '8px', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
        <label className="field-label" style={{ width: '120px', margin: 0, flexShrink: 0, fontSize: '12px' }}>{label}</label>
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>{children}</div>
      </div>
      {error && <div className="field-error" style={{ marginLeft: '128px', fontSize: '12px' }}>{error}</div>}
    </div>
  );
}

