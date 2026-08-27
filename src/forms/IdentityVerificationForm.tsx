{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { IdentityVerification } from '../types/IdentityVerification';
import { createIdentityVerification, updateIdentityVerification } from '../apis/useIdentityVerification';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const identityVerificationSchema = z.object({
  userID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "User is required")),
  verificationType: z.string().max(50, "Verification Type must be less than 50 characters").min(1, "Verification Type is required"),
  providerName: z.string().max(100, "Provider Name must be less than 100 characters").optional(),
  providerReferenceID: z.string().max(255, "Provider Reference ID must be less than 255 characters").optional(),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required"),
  expiresAt: z.string().optional(),
  failureReason: z.string().max(256, "Failure Reason must be less than 256 characters").optional(),
});

type IdentityVerificationFormData = z.infer<typeof identityVerificationSchema>;

interface IdentityVerificationFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialIdentityVerification?: IdentityVerification | null;
  isEditMode?: boolean;
}

export default function IdentityVerificationForm({ onAlert, initialIdentityVerification = null, isEditMode = false }: IdentityVerificationFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_userID, setOpts_userID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_userID_loading, setOpts_userID_loading] = React.useState(false);

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

  async function loadOptions_userID(){
    try { setOpts_userID_loading(true);
      const url = "api/account/getUsers" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'userID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["displayName", "name", "userName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["id", "id", "id", "ID", "userID", "userId"], String(it))
      }));
      setOpts_userID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_userID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_userID(); }, []);

  const getDefaultValues = React.useCallback((): IdentityVerificationFormData => {
    const src = (initialIdentityVerification as any) ?? {};
    if (isEditMode && initialIdentityVerification) {
      return {
        userID: (() => {
          if (src?.userID !== undefined && src?.userID !== null) {
            return Number(src.userID);
          }
          return 0;
        })(),
        verificationType: (src?.verificationType ?? ""),
        providerName: (src?.providerName ?? ""),
        providerReferenceID: (src?.providerReferenceID ?? ""),
        status: (src?.status ?? ""),
        expiresAt: src?.expiresAt ? new Date(src?.expiresAt as any).toISOString().split('T')[0] : "",
        failureReason: (src?.failureReason ?? ""),
      };
    }
    return {
      userID: 0,
      verificationType: "",
      providerName: "",
      providerReferenceID: "",
      status: "",
      expiresAt: "",
      failureReason: "",
    };
  }, [isEditMode, initialIdentityVerification]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(identityVerificationSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialIdentityVerification && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialIdentityVerification, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialIdentityVerification && opts_userID.length > 0) {
      const currentuserID = (initialIdentityVerification as any)?.userID ;
      if (currentuserID !== undefined && currentuserID!== null) {
        const userIDValue = String(currentuserID);
        if (opts_userID.some(opt => opt.value === String(userIDValue))) {
          setValue('userID', userIDValue);
        }
      }
    }
  }, [opts_userID, isEditMode, initialIdentityVerification, setValue]);

  const onSubmitHandler = async (data: IdentityVerificationFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} identityverification...`, 'info');
      const payload: any = {
        identityVerificationID: (isEditMode ? ((initialIdentityVerification as any)?.identityVerificationID ?? null) : null),
        userID: (data.userID === 0 || data.userID === undefined || data.userID === null) ? 0 : Number(data.userID),
        verificationType: data.verificationType ?? '',
        providerName: data.providerName ?? '',
        providerReferenceID: data.providerReferenceID ?? '',
        status: data.status ?? '',
        requestedAt : (isEditMode ? ((initialIdentityVerification as any)?.requestedAt ?? null) : null),
        verifiedAt : (isEditMode ? ((initialIdentityVerification as any)?.verifiedAt ?? null) : null),
        expiresAt: data.expiresAt || null,
        failureReason: data.failureReason ?? '',
        capturedDate : (isEditMode ? ((initialIdentityVerification as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialIdentityVerification as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialIdentityVerification as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialIdentityVerification as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateIdentityVerification(payload as IdentityVerification) : await createIdentityVerification(payload as IdentityVerification);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`IdentityVerification "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/identityverifications');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit IdentityVerification' : 'Create IdentityVerification'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="User *" error={errors.userID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('userID')}>
              <option value="">Select User</option>
              {opts_userID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_userID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Verification Type" error={errors.verificationType?.message as string}>
            <input className="input" placeholder="Enter verification type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('verificationType')}  />
          </Field>
          <Field label="Provider Name" error={errors.providerName?.message as string}>
            <input className="input" placeholder="Enter provider name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('providerName')}  />
          </Field>
          <Field label="Provider Reference ID" error={errors.providerReferenceID?.message as string}>
            <textarea className="input" placeholder="Enter provider reference ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerReferenceID')} rows={3} />
          </Field>
          <Field label="Status" error={errors.status?.message as string}>
            <input className="input" placeholder="Select status" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}  />
          </Field>
          <Field label="Expires At" error={errors.expiresAt?.message as string}>
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('expiresAt')} />
          </Field>
          <Field label="Failure Reason" error={errors.failureReason?.message as string}>
            <textarea className="input" placeholder="Enter failure reason" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('failureReason')} rows={3} />
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

