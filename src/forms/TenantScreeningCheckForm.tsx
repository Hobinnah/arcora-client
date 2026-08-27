{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { TenantScreeningCheck } from '../types/TenantScreeningCheck';
import { createTenantScreeningCheck, updateTenantScreeningCheck } from '../apis/useTenantScreeningCheck';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const tenantScreeningCheckSchema = z.object({
  tenantID: z.string().min(1, "Tenant is required"),
  rentalApplicationID: z.string().optional(),
  checkType: z.string().max(50, "Check Type must be less than 50 characters").min(1, "Check Type is required"),
  providerName: z.string().max(100, "Provider Name must be less than 100 characters").optional(),
  providerReferenceID: z.string().max(255, "Provider Reference ID must be less than 255 characters").optional(),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["REQUESTED", "COMPLETED", "FAILED"].includes(v as any), "Invalid Status"),
  consentCapturedAt: z.string().optional(),
  score: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  resultSummary: z.string().max(256, "Result Summary must be less than 256 characters").optional(),
  reportReference: z.string().max(500, "Report Reference must be less than 500 characters").optional(),
  completedAt: z.string().optional(),
  expiresAt: z.string().optional(),
  failureReason: z.string().max(256, "Failure Reason must be less than 256 characters").optional(),
});

type TenantScreeningCheckFormData = z.infer<typeof tenantScreeningCheckSchema>;

interface TenantScreeningCheckFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialTenantScreeningCheck?: TenantScreeningCheck | null;
  isEditMode?: boolean;
}

export default function TenantScreeningCheckForm({ onAlert, initialTenantScreeningCheck = null, isEditMode = false }: TenantScreeningCheckFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_tenantID, setOpts_tenantID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_tenantID_loading, setOpts_tenantID_loading] = React.useState(false);
  const [opts_rentalApplicationID, setOpts_rentalApplicationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_rentalApplicationID_loading, setOpts_rentalApplicationID_loading] = React.useState(false);

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

  async function loadOptions_tenantID(){
    try { setOpts_tenantID_loading(true);
      const url = "api/tenant/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'tenantID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["lastName", "name", "tenantName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["tenantID", "tenantID", "id", "ID", "tenantID", "tenantId"], String(it))
      }));
      setOpts_tenantID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_tenantID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_tenantID(); }, []);

  async function loadOptions_rentalApplicationID(){
    try { setOpts_rentalApplicationID_loading(true);
      const url = "api/rentalapplication/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'rentalApplicationID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["rentalApplicationID", "name", "rentalApplicationName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["rentalApplicationID", "rentalApplicationID", "id", "ID", "rentalApplicationID", "rentalApplicationId"], String(it))
      }));
      setOpts_rentalApplicationID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_rentalApplicationID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_rentalApplicationID(); }, []);

  const getDefaultValues = React.useCallback((): TenantScreeningCheckFormData => {
    const src = (initialTenantScreeningCheck as any) ?? {};
    if (isEditMode && initialTenantScreeningCheck) {
      return {
        tenantID: (src?.tenantID ?? ""),
        rentalApplicationID: (src?.rentalApplicationID ?? ""),
        checkType: (src?.checkType ?? ""),
        providerName: (src?.providerName ?? ""),
        providerReferenceID: (src?.providerReferenceID ?? ""),
        status: (src?.status ?? ""),
        consentCapturedAt: src?.consentCapturedAt ? new Date(src?.consentCapturedAt as any).toISOString().split('T')[0] : "",
        score: (src?.score ?? 0),
        resultSummary: (src?.resultSummary ?? ""),
        reportReference: (src?.reportReference ?? ""),
        completedAt: src?.completedAt ? new Date(src?.completedAt as any).toISOString().split('T')[0] : "",
        expiresAt: src?.expiresAt ? new Date(src?.expiresAt as any).toISOString().split('T')[0] : "",
        failureReason: (src?.failureReason ?? ""),
      };
    }
    return {
      tenantID: "",
      rentalApplicationID: "",
      checkType: "",
      providerName: "",
      providerReferenceID: "",
      status: "REQUESTED",
      consentCapturedAt: new Date().toISOString().split('T')[0],
      score: 0,
      resultSummary: "",
      reportReference: "",
      completedAt: "",
      expiresAt: "",
      failureReason: "",
    };
  }, [isEditMode, initialTenantScreeningCheck]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(tenantScreeningCheckSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialTenantScreeningCheck && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialTenantScreeningCheck, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialTenantScreeningCheck && opts_tenantID.length > 0) {
      const currenttenantID = (initialTenantScreeningCheck as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = String(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialTenantScreeningCheck, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialTenantScreeningCheck && opts_rentalApplicationID.length > 0) {
      const currentrentalApplicationID = (initialTenantScreeningCheck as any)?.rentalApplicationID ;
      if (currentrentalApplicationID !== undefined && currentrentalApplicationID!== null) {
        const rentalApplicationIDValue = String(currentrentalApplicationID);
        if (opts_rentalApplicationID.some(opt => opt.value === String(rentalApplicationIDValue))) {
          setValue('rentalApplicationID', rentalApplicationIDValue);
        }
      }
    }
  }, [opts_rentalApplicationID, isEditMode, initialTenantScreeningCheck, setValue]);

  const onSubmitHandler = async (data: TenantScreeningCheckFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} tenantscreeningcheck...`, 'info');
      const payload: any = {
        tenantScreeningCheckID: (isEditMode ? ((initialTenantScreeningCheck as any)?.tenantScreeningCheckID ?? null) : null),
        tenantID: data.tenantID ?? '',
        rentalApplicationID: data.rentalApplicationID ?? '',
        checkType: data.checkType ?? '',
        providerName: data.providerName ?? '',
        providerReferenceID: data.providerReferenceID ?? '',
        status: data.status ?? '',
        consentCapturedAt: data.consentCapturedAt || new Date().toISOString().split('T')[0],
        score: data.score,
        resultSummary: data.resultSummary ?? '',
        reportReference: data.reportReference ?? '',
        requestedAt : (isEditMode ? ((initialTenantScreeningCheck as any)?.requestedAt ?? null) : null),
        expiresAt: data.expiresAt || null,
        failureReason: data.failureReason ?? '',
        capturedDate : (isEditMode ? ((initialTenantScreeningCheck as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialTenantScreeningCheck as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        completedAt: data.status === 'Completed'
          ? ((initialTenantScreeningCheck as any)?.completedAt || new Date().toISOString().split('T')[0])
          : (initialTenantScreeningCheck as any)?.completedAt || null,
      };
      let result: any;
      result = isEditMode ? await updateTenantScreeningCheck(payload as TenantScreeningCheck) : await createTenantScreeningCheck(payload as TenantScreeningCheck);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`TenantScreeningCheck "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/tenantscreeningchecks');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit TenantScreeningCheck' : 'Create TenantScreeningCheck'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Tenant *" error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Rental Application " error={errors.rentalApplicationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('rentalApplicationID')}>
              <option value="">Select Rental Application</option>
              {opts_rentalApplicationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_rentalApplicationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Check Type" error={errors.checkType?.message as string}>
            <input className="input" placeholder="Enter check type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('checkType')}  />
          </Field>
          <Field label="Provider Name" error={errors.providerName?.message as string}>
            <input className="input" placeholder="Enter provider name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('providerName')}  />
          </Field>
          <Field label="Provider Reference ID" error={errors.providerReferenceID?.message as string}>
            <textarea className="input" placeholder="Enter provider reference ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerReferenceID')} rows={3} />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="REQUESTED">REQUESTED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </Field>
          <Field label="Consent Captured At" error={errors.consentCapturedAt?.message as string}>
            <input className="input" placeholder="Select consent date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('consentCapturedAt')} />
          </Field>
          <Field label="Score" error={errors.score?.message as string}>
            <input className="input" placeholder="Enter score" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('score', { valueAsNumber: true })} />
          </Field>
          <Field label="Result Summary" error={errors.resultSummary?.message as string}>
            <textarea className="input" placeholder="Enter result summary" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('resultSummary')} rows={3} />
          </Field>
          <Field label="Report Reference" error={errors.reportReference?.message as string}>
            <textarea className="input" placeholder="Enter report reference" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('reportReference')} rows={3} />
          </Field>
          <Field label="Completed At" error={errors.completedAt?.message as string}>
            <input className="input" placeholder="Select completion date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('completedAt')} />
          </Field>
          <Field label="Expires At" error={errors.expiresAt?.message as string}>
            <input className="input" placeholder="Select expiry date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('expiresAt')} />
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

