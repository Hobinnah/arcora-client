{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { LeaseDocExtractedTerm } from '../types/LeaseDocExtractedTerm';
import { createLeaseDocExtractedTerm, updateLeaseDocExtractedTerm } from '../apis/useLeaseDocExtractedTerm';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const leaseDocExtractedTermSchema = z.object({
  leaseDocumentID: z.string().min(1, "Lease Document is required"),
  extractedStartDate: z.string().optional(),
  extractedEndDate: z.string().optional(),
  extractedRentAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  extractedDepositAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  extractedRenewalDate: z.string().optional(),
  extractionConfidence: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  extractionStatus: z.string().max(50, "Extraction Status must be less than 50 characters").min(1, "Extraction Status is required"),
  extractedDate: z.string().optional(),
  reviewedAt: z.string().optional(),
  reviewedBy: z.string().max(100, "Reviewed By must be less than 100 characters").optional(),
});

type LeaseDocExtractedTermFormData = z.infer<typeof leaseDocExtractedTermSchema>;

interface LeaseDocExtractedTermFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialLeaseDocExtractedTerm?: LeaseDocExtractedTerm | null;
  isEditMode?: boolean;
}

export default function LeaseDocExtractedTermForm({ onAlert, initialLeaseDocExtractedTerm = null, isEditMode = false }: LeaseDocExtractedTermFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_leaseDocumentID, setOpts_leaseDocumentID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseDocumentID_loading, setOpts_leaseDocumentID_loading] = React.useState(false);
  const [opts_reviewedBy, setOpts_reviewedBy] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_reviewedBy_loading, setOpts_reviewedBy_loading] = React.useState(false);

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

  async function loadOptions_leaseDocumentID(){
    try { setOpts_leaseDocumentID_loading(true);
      const url = "api/leasedocument/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'leaseDocumentID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "leaseDocumentName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["leaseDocumentID", "leaseDocumentID", "id", "ID", "leaseDocumentID", "leaseDocumentId"], String(it))
      }));
      setOpts_leaseDocumentID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_leaseDocumentID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_leaseDocumentID(); }, []);

  async function loadOptions_reviewedBy(){
    try { setOpts_reviewedBy_loading(true);
      const url = "api/account/getUsers" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'reviewedBy');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["displayName", "name", "reviewedByName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["id", "id", "id", "ID", "reviewedByID", "reviewedById"], String(it))
      }));
      setOpts_reviewedBy(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_reviewedBy_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_reviewedBy(); }, []);

  const getDefaultValues = React.useCallback((): LeaseDocExtractedTermFormData => {
    const src = (initialLeaseDocExtractedTerm as any) ?? {};
    if (isEditMode && initialLeaseDocExtractedTerm) {
      return {
        leaseDocumentID: (src?.leaseDocumentID ?? ""),
        extractedStartDate: src?.extractedStartDate ? new Date(src?.extractedStartDate as any).toISOString().split('T')[0] : "",
        extractedEndDate: src?.extractedEndDate ? new Date(src?.extractedEndDate as any).toISOString().split('T')[0] : "",
        extractedRentAmount: (src?.extractedRentAmount ?? 0),
        extractedDepositAmount: (src?.extractedDepositAmount ?? 0),
        extractedRenewalDate: src?.extractedRenewalDate ? new Date(src?.extractedRenewalDate as any).toISOString().split('T')[0] : "",
        extractionConfidence: (src?.extractionConfidence ?? 0),
        extractionStatus: (src?.extractionStatus ?? ""),
        extractedDate: src?.extractedDate ? new Date(src?.extractedDate as any).toISOString().split('T')[0] : "",
        reviewedAt: src?.reviewedAt ? new Date(src?.reviewedAt as any).toISOString().split('T')[0] : "",
        reviewedBy: (src?.reviewedBy ?? ""),
      };
    }
    return {
      leaseDocumentID: "",
      extractedStartDate: "",
      extractedEndDate: "",
      extractedRentAmount: 0,
      extractedDepositAmount: 0,
      extractedRenewalDate: "",
      extractionConfidence: 0,
      extractionStatus: "",
      extractedDate: "",
      reviewedAt: "",
      reviewedBy: "",
    };
  }, [isEditMode, initialLeaseDocExtractedTerm]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(leaseDocExtractedTermSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialLeaseDocExtractedTerm && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialLeaseDocExtractedTerm, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLeaseDocExtractedTerm && opts_leaseDocumentID.length > 0) {
      const currentleaseDocumentID = (initialLeaseDocExtractedTerm as any)?.leaseDocumentID ;
      if (currentleaseDocumentID !== undefined && currentleaseDocumentID!== null) {
        const leaseDocumentIDValue = Number(currentleaseDocumentID);
        if (opts_leaseDocumentID.some(opt => opt.value === String(leaseDocumentIDValue))) {
          setValue('leaseDocumentID', leaseDocumentIDValue);
        }
      }
    }
  }, [opts_leaseDocumentID, isEditMode, initialLeaseDocExtractedTerm, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLeaseDocExtractedTerm && opts_reviewedBy.length > 0) {
      const currentreviewedBy = (initialLeaseDocExtractedTerm as any)?.reviewedBy ;
      if (currentreviewedBy !== undefined && currentreviewedBy!== null) {
        const reviewedByValue = Number(currentreviewedBy);
        if (opts_reviewedBy.some(opt => opt.value === String(reviewedByValue))) {
          setValue('reviewedBy', reviewedByValue);
        }
      }
    }
  }, [opts_reviewedBy, isEditMode, initialLeaseDocExtractedTerm, setValue]);

  const onSubmitHandler = async (data: LeaseDocExtractedTermFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} leasedocextractedterm...`, 'info');
      const payload: any = {
        leaseDocExtractedTermID: (isEditMode ? ((initialLeaseDocExtractedTerm as any)?.leaseDocExtractedTermID ?? null) : null),
        leaseDocumentID: data.leaseDocumentID ?? '',
        extractedStartDate: data.extractedStartDate || null,
        extractedEndDate: data.extractedEndDate || null,
        extractedRentAmount: data.extractedRentAmount,
        extractedDepositAmount: data.extractedDepositAmount,
        extractedRenewalDate: data.extractedRenewalDate || null,
        extractionConfidence: data.extractionConfidence,
        extractionStatus: data.extractionStatus ?? '',
        rawExtractionJson: data.rawExtractionJson ?? '',
        extractedDate: data.extractedDate || null,
        reviewedAt: data.reviewedAt || null,
        reviewedBy: data.reviewedBy ?? '',
      };
      let result: any;
      result = isEditMode ? await updateLeaseDocExtractedTerm(payload as LeaseDocExtractedTerm) : await createLeaseDocExtractedTerm(payload as LeaseDocExtractedTerm);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`LeaseDocExtractedTerm "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/leasedocextractedterms');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit LeaseDocExtractedTerm' : 'Create LeaseDocExtractedTerm'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Lease Document *" error={errors.leaseDocumentID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('leaseDocumentID')}>
              <option value="">Select Lease Document</option>
              {opts_leaseDocumentID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_leaseDocumentID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Extracted Start Date" error={errors.extractedStartDate?.message as string}>
            <input className="input" placeholder="Select extracted start date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('extractedStartDate')} />
          </Field>
          <Field label="Extracted End Date" error={errors.extractedEndDate?.message as string}>
            <input className="input" placeholder="Select extracted end date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('extractedEndDate')} />
          </Field>
          <Field label="Extracted Rent Amount" error={errors.extractedRentAmount?.message as string}>
            <input className="input" placeholder="Enter extracted rent amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('extractedRentAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Extracted Deposit Amount" error={errors.extractedDepositAmount?.message as string}>
            <input className="input" placeholder="Enter extracted deposit amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('extractedDepositAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Extracted Renewal Date" error={errors.extractedRenewalDate?.message as string}>
            <input className="input" placeholder="Select extracted renewal date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('extractedRenewalDate')} />
          </Field>
          <Field label="Extraction Confidence" error={errors.extractionConfidence?.message as string}>
            <input className="input" placeholder="Enter extraction confidence" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('extractionConfidence', { valueAsNumber: true })} />
          </Field>
          <Field label="Extraction Status" error={errors.extractionStatus?.message as string}>
            <input className="input" placeholder="Select extraction status" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('extractionStatus')}  />
          </Field>
          <Field label="Extracted Date" error={errors.extractedDate?.message as string}>
            <input className="input" placeholder="Select extracted date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('extractedDate')} />
          </Field>
          <Field label="Reviewed At" error={errors.reviewedAt?.message as string}>
            <input className="input" placeholder="Select review date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('reviewedAt')} />
          </Field>
          <Field label="Reviewed By " error={errors.reviewedBy?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('reviewedBy')}>
              <option value="">Select Reviewed By</option>
              {opts_reviewedBy.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_reviewedBy_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
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

