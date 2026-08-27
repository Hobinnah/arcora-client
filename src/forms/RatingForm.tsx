{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { Rating } from '../types/Rating';
import { createRating, updateRating } from '../apis/useRating';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const ratingSchema = z.object({
  leaseID: z.string().min(1, "Lease is required"),
  reviewerUserID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Reviewer User is required")),
  subjectType: z.string().max(50, "Subject Type must be less than 50 characters").min(1, "Subject Type is required"),
  subjectReferenceID: z.string().max(100, "Subject Reference ID must be less than 100 characters").min(1, "Subject Reference ID is required"),
  overallRating: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Overall Rating is required")),
  paymentRating: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  communicationRating: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  propertyCareRating: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  responsivenessRating: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  accuracyRating: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  cleanlinessRating: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  reviewBody: z.string().max(256, "Review Body must be less than 256 characters").optional(),
  isPublic: z.boolean(),
});

type RatingFormData = z.infer<typeof ratingSchema>;

interface RatingFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialRating?: Rating | null;
  isEditMode?: boolean;
}

export default function RatingForm({ onAlert, initialRating = null, isEditMode = false }: RatingFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_leaseID, setOpts_leaseID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseID_loading, setOpts_leaseID_loading] = React.useState(false);
  const [opts_reviewerUserID, setOpts_reviewerUserID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_reviewerUserID_loading, setOpts_reviewerUserID_loading] = React.useState(false);

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

  async function loadOptions_reviewerUserID(){
    try { setOpts_reviewerUserID_loading(true);
      const url = "api/account/getUsers" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'reviewerUserID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["displayName", "name", "reviewerUserName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["id", "id", "id", "ID", "reviewerUserID", "reviewerUserId"], String(it))
      }));
      setOpts_reviewerUserID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_reviewerUserID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_reviewerUserID(); }, []);

  const getDefaultValues = React.useCallback((): RatingFormData => {
    const src = (initialRating as any) ?? {};
    if (isEditMode && initialRating) {
      return {
        leaseID: (src?.leaseID ?? ""),
        reviewerUserID: (() => {
          if (src?.reviewerUserID !== undefined && src?.reviewerUserID !== null) {
            return Number(src.reviewerUserID);
          }
          return 0;
        })(),
        subjectType: (src?.subjectType ?? ""),
        subjectReferenceID: (src?.subjectReferenceID ?? ""),
        overallRating: (src?.overallRating ?? 0),
        paymentRating: (src?.paymentRating ?? 0),
        communicationRating: (src?.communicationRating ?? 0),
        propertyCareRating: (src?.propertyCareRating ?? 0),
        responsivenessRating: (src?.responsivenessRating ?? 0),
        accuracyRating: (src?.accuracyRating ?? 0),
        cleanlinessRating: (src?.cleanlinessRating ?? 0),
        reviewBody: (src?.reviewBody ?? ""),
        isPublic: Boolean(src?.isPublic),
      };
    }
    return {
      leaseID: "",
      reviewerUserID: 0,
      subjectType: "",
      subjectReferenceID: "",
      overallRating: 0,
      paymentRating: 0,
      communicationRating: 0,
      propertyCareRating: 0,
      responsivenessRating: 0,
      accuracyRating: 0,
      cleanlinessRating: 0,
      reviewBody: "",
      isPublic: false,
    };
  }, [isEditMode, initialRating]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(ratingSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialRating && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialRating, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialRating && opts_leaseID.length > 0) {
      const currentleaseID = (initialRating as any)?.leaseID ;
      if (currentleaseID !== undefined && currentleaseID!== null) {
        const leaseIDValue = String(currentleaseID);
        if (opts_leaseID.some(opt => opt.value === String(leaseIDValue))) {
          setValue('leaseID', leaseIDValue);
        }
      }
    }
  }, [opts_leaseID, isEditMode, initialRating, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialRating && opts_reviewerUserID.length > 0) {
      const currentreviewerUserID = (initialRating as any)?.reviewerUserID ;
      if (currentreviewerUserID !== undefined && currentreviewerUserID!== null) {
        const reviewerUserIDValue = String(currentreviewerUserID);
        if (opts_reviewerUserID.some(opt => opt.value === String(reviewerUserIDValue))) {
          setValue('reviewerUserID', reviewerUserIDValue);
        }
      }
    }
  }, [opts_reviewerUserID, isEditMode, initialRating, setValue]);

  const onSubmitHandler = async (data: RatingFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} rating...`, 'info');
      const payload: any = {
        ratingID: (isEditMode ? ((initialRating as any)?.ratingID ?? null) : null),
        leaseID: data.leaseID ?? '',
        reviewerUserID: (data.reviewerUserID === 0 || data.reviewerUserID === undefined || data.reviewerUserID === null) ? 0 : Number(data.reviewerUserID),
        subjectType: data.subjectType ?? '',
        subjectReferenceID: data.subjectReferenceID ?? '',
        overallRating: data.overallRating,
        paymentRating: data.paymentRating,
        communicationRating: data.communicationRating,
        propertyCareRating: data.propertyCareRating,
        responsivenessRating: data.responsivenessRating,
        accuracyRating: data.accuracyRating,
        cleanlinessRating: data.cleanlinessRating,
        reviewBody: data.reviewBody ?? '',
        isPublic: data.isPublic,
        publishedAt : (isEditMode ? ((initialRating as any)?.publishedAt ?? null) : null),
        capturedDate : (isEditMode ? ((initialRating as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialRating as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialRating as any)?.updatedDate ?? null) : null),
      };
      let result: any;
      result = isEditMode ? await updateRating(payload as Rating) : await createRating(payload as Rating);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`Rating "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/ratings');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit Rating' : 'Create Rating'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Lease *" error={errors.leaseID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('leaseID')}>
              <option value="">Select Lease</option>
              {opts_leaseID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_leaseID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Reviewer User *" error={errors.reviewerUserID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('reviewerUserID')}>
              <option value="">Select Reviewer User</option>
              {opts_reviewerUserID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_reviewerUserID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Subject Type" error={errors.subjectType?.message as string}>
            <input className="input" placeholder="Enter subject type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('subjectType')}  />
          </Field>
          <Field label="Subject Reference ID" error={errors.subjectReferenceID?.message as string}>
            <input className="input" placeholder="Enter subject reference ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('subjectReferenceID')}  />
          </Field>
          <Field label="Overall Rating" error={errors.overallRating?.message as string}>
            <input className="input" placeholder="Enter overall rating" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('overallRating', { valueAsNumber: true })} />
          </Field>
          <Field label="Payment Rating" error={errors.paymentRating?.message as string}>
            <input className="input" placeholder="Enter payment rating" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paymentRating', { valueAsNumber: true })} />
          </Field>
          <Field label="Communication Rating" error={errors.communicationRating?.message as string}>
            <input className="input" placeholder="Enter communication rating" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('communicationRating', { valueAsNumber: true })} />
          </Field>
          <Field label="Property Care Rating" error={errors.propertyCareRating?.message as string}>
            <input className="input" placeholder="Enter property care rating" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('propertyCareRating', { valueAsNumber: true })} />
          </Field>
          <Field label="Responsiveness Rating" error={errors.responsivenessRating?.message as string}>
            <input className="input" placeholder="Enter responsiveness rating" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('responsivenessRating', { valueAsNumber: true })} />
          </Field>
          <Field label="Accuracy Rating" error={errors.accuracyRating?.message as string}>
            <input className="input" placeholder="Enter accuracy rating" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('accuracyRating', { valueAsNumber: true })} />
          </Field>
          <Field label="Cleanliness Rating" error={errors.cleanlinessRating?.message as string}>
            <input className="input" placeholder="Enter cleanliness rating" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('cleanlinessRating', { valueAsNumber: true })} />
          </Field>
          <Field label="Review Body" error={errors.reviewBody?.message as string}>
            <textarea className="input" placeholder="Enter review" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('reviewBody')} rows={3} />
          </Field>
          <Field label="Is Public" error={errors.isPublic?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isPublic')} />
              <span>Yes</span>
            </label>
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

