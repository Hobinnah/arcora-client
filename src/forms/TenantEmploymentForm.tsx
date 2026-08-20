{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { TenantEmployment } from '../types/TenantEmployment';
import { createTenantEmployment, updateTenantEmployment } from '../apis/useTenantEmployment';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const tenantEmploymentSchema = z.object({
  tenantID: z.string().min(1, "Tenant is required"),
  employerName: z.string().max(100, "Employer Name must be less than 100 characters").optional(),
  jobTitle: z.string().max(150, "Job Title must be less than 150 characters").optional(),
  employmentType: z.string().max(50, "Employment Type must be less than 50 characters").optional(),
  employerEmail: z.string().max(255, "Employer Email must be less than 255 characters").optional(),
  employerPhoneNumber: z.string().max(50, "Employer Phone Number must be less than 50 characters").optional(),
  annualIncome: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  currency: z.string().max(3, "Currency must be less than 3 characters").min(1, "Currency is required"),
  startedAt: z.string().optional(),
  endedAt: z.string().optional(),
  isCurrent: z.boolean(),
  verificationStatus: z.string().max(50, "Verification Status must be less than 50 characters").min(1, "Verification Status is required").refine(v => (v ?? '') === '' || ["NOT_VERIFIED", "VERIFIED", "REJECTED"].includes(v as any), "Invalid Verification Status"),
});

type TenantEmploymentFormData = z.infer<typeof tenantEmploymentSchema>;

interface TenantEmploymentFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialTenantEmployment?: TenantEmployment | null;
  isEditMode?: boolean;
}

export default function TenantEmploymentForm({ onAlert, initialTenantEmployment = null, isEditMode = false }: TenantEmploymentFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_tenantID, setOpts_tenantID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_tenantID_loading, setOpts_tenantID_loading] = React.useState(false);

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
        label: firstNonEmpty(it, ["code", "name", "tenantName", "title", "fullName", "email", "description"], String(it)),
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

  const getDefaultValues = React.useCallback((): TenantEmploymentFormData => {
    const src = (initialTenantEmployment as any) ?? {};
    if (isEditMode && initialTenantEmployment) {
      return {
        tenantID: (src?.tenantID ?? ""),
        employerName: (src?.employerName ?? ""),
        jobTitle: (src?.jobTitle ?? ""),
        employmentType: (src?.employmentType ?? ""),
        employerEmail: (src?.employerEmail ?? ""),
        employerPhoneNumber: (src?.employerPhoneNumber ?? ""),
        annualIncome: (src?.annualIncome ?? 0),
        currency: (src?.currency ?? ""),
        startedAt: src?.startedAt ? new Date(src?.startedAt as any).toISOString().split('T')[0] : "",
        endedAt: src?.endedAt ? new Date(src?.endedAt as any).toISOString().split('T')[0] : "",
        isCurrent: Boolean(src?.isCurrent),
        verificationStatus: (src?.verificationStatus ?? ""),
      };
    }
    return {
      tenantID: "",
      employerName: "",
      jobTitle: "",
      employmentType: "",
      employerEmail: "",
      employerPhoneNumber: "",
      annualIncome: 0,
      currency: "",
      startedAt: "",
      endedAt: "",
      isCurrent: false,
      verificationStatus: "",
    };
  }, [isEditMode, initialTenantEmployment]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(tenantEmploymentSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialTenantEmployment && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialTenantEmployment, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialTenantEmployment && opts_tenantID.length > 0) {
      const currenttenantID = (initialTenantEmployment as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = Number(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialTenantEmployment, setValue]);

  const onSubmitHandler = async (data: TenantEmploymentFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} tenantemployment...`, 'info');
      const payload: any = {
        tenantEmploymentID: (isEditMode ? ((initialTenantEmployment as any)?.tenantEmploymentID ?? null) : null),
        tenantID: data.tenantID ?? '',
        employerName: data.employerName ?? '',
        jobTitle: data.jobTitle ?? '',
        employmentType: data.employmentType ?? '',
        employerEmail: data.employerEmail ?? '',
        employerPhoneNumber: data.employerPhoneNumber ?? '',
        annualIncome: data.annualIncome,
        currency: data.currency ?? '',
        startedAt: data.startedAt || null,
        endedAt: data.endedAt || null,
        isCurrent: data.isCurrent,
        verificationStatus: data.verificationStatus ?? '',
        capturedDate : (isEditMode ? ((initialTenantEmployment as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialTenantEmployment as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialTenantEmployment as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialTenantEmployment as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateTenantEmployment(payload as TenantEmployment) : await createTenantEmployment(payload as TenantEmployment);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`TenantEmployment "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/tenantemployments');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit TenantEmployment' : 'Create TenantEmployment'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Tenant *" error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Employer Name" error={errors.employerName?.message as string}>
            <input className="input" placeholder="Enter employer name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('employerName')}  />
          </Field>
          <Field label="Job Title" error={errors.jobTitle?.message as string}>
            <input className="input" placeholder="Enter job title" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('jobTitle')}  />
          </Field>
          <Field label="Employment Type" error={errors.employmentType?.message as string}>
            <input className="input" placeholder="Enter employment type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('employmentType')}  />
          </Field>
          <Field label="Employer Email" error={errors.employerEmail?.message as string}>
            <textarea className="input" placeholder="Enter employer email" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('employerEmail')} rows={3} />
          </Field>
          <Field label="Employer Phone Number" error={errors.employerPhoneNumber?.message as string}>
            <input className="input" placeholder="Enter employer phone number" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('employerPhoneNumber')}  />
          </Field>
          <Field label="Annual Income" error={errors.annualIncome?.message as string}>
            <input className="input" placeholder="Enter annual income" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('annualIncome', { valueAsNumber: true })} />
          </Field>
          <Field label="Currency" error={errors.currency?.message as string}>
            <input className="input" placeholder="Enter currency code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}  />
          </Field>
          <Field label="Started At" error={errors.startedAt?.message as string}>
            <input className="input" placeholder="Select start date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('startedAt')} />
          </Field>
          <Field label="Ended At" error={errors.endedAt?.message as string}>
            <input className="input" placeholder="Select end date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('endedAt')} />
          </Field>
          <Field label="Is Current *" error={errors.isCurrent?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('isCurrent')}>
              <option value="">Select Is Current</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </Field>
          <Field label="Verification Status *" error={errors.verificationStatus?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('verificationStatus')}>
              <option value="">Select Verification Status</option>
              <option value="NOT_VERIFIED">NOT_VERIFIED</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
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

