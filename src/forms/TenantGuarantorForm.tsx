{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { TenantGuarantor } from '../types/TenantGuarantor';
import { createTenantGuarantor, updateTenantGuarantor } from '../apis/useTenantGuarantor';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const tenantGuarantorSchema = z.object({
  tenantID: z.string().min(1, "Tenant is required"),
  userID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  firstName: z.string().max(100, "First Name must be less than 100 characters").min(1, "First Name is required"),
  lastName: z.string().max(100, "Last Name must be less than 100 characters").min(1, "Last Name is required"),
  email: z.string().max(255, "Email must be less than 255 characters").optional(),
  phoneNumber: z.string().max(50, "Phone Number must be less than 50 characters").optional(),
  relationship: z.string().max(100, "Relationship must be less than 100 characters").optional(),
  annualIncome: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required"),
  invitedAt: z.string().optional(),
  acceptedAt: z.string().optional(),
});

type TenantGuarantorFormData = z.infer<typeof tenantGuarantorSchema>;

interface TenantGuarantorFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialTenantGuarantor?: TenantGuarantor | null;
  isEditMode?: boolean;
}

export default function TenantGuarantorForm({ onAlert, initialTenantGuarantor = null, isEditMode = false }: TenantGuarantorFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_tenantID, setOpts_tenantID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_tenantID_loading, setOpts_tenantID_loading] = React.useState(false);
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

  const getDefaultValues = React.useCallback((): TenantGuarantorFormData => {
    const src = (initialTenantGuarantor as any) ?? {};
    if (isEditMode && initialTenantGuarantor) {
      return {
        tenantID: (src?.tenantID ?? ""),
        userID: (() => {
          if (src?.userID !== undefined && src?.userID !== null) {
            return Number(src.userID);
          }
          return 0;
        })(),
        firstName: (src?.firstName ?? ""),
        lastName: (src?.lastName ?? ""),
        email: (src?.email ?? ""),
        phoneNumber: (src?.phoneNumber ?? ""),
        relationship: (src?.relationship ?? ""),
        annualIncome: (src?.annualIncome ?? 0),
        status: (src?.status ?? ""),
        invitedAt: src?.invitedAt ? new Date(src?.invitedAt as any).toISOString().split('T')[0] : "",
        acceptedAt: src?.acceptedAt ? new Date(src?.acceptedAt as any).toISOString().split('T')[0] : "",
      };
    }
    return {
      tenantID: "",
      userID: 0,
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      relationship: "",
      annualIncome: 0,
      status: "",
      invitedAt: "",
      acceptedAt: "",
    };
  }, [isEditMode, initialTenantGuarantor]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(tenantGuarantorSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialTenantGuarantor && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialTenantGuarantor, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialTenantGuarantor && opts_tenantID.length > 0) {
      const currenttenantID = (initialTenantGuarantor as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = Number(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialTenantGuarantor, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialTenantGuarantor && opts_userID.length > 0) {
      const currentuserID = (initialTenantGuarantor as any)?.userID ;
      if (currentuserID !== undefined && currentuserID!== null) {
        const userIDValue = Number(currentuserID);
        if (opts_userID.some(opt => opt.value === String(userIDValue))) {
          setValue('userID', userIDValue);
        }
      }
    }
  }, [opts_userID, isEditMode, initialTenantGuarantor, setValue]);

  const onSubmitHandler = async (data: TenantGuarantorFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} tenantguarantor...`, 'info');
      const payload: any = {
        tenantGuarantorID: (isEditMode ? ((initialTenantGuarantor as any)?.tenantGuarantorID ?? null) : null),
        tenantID: data.tenantID ?? '',
        userID: (data.userID === 0 || data.userID === undefined || data.userID === null) ? 0 : Number(data.userID),
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        email: data.email ?? '',
        phoneNumber: data.phoneNumber ?? '',
        relationship: data.relationship ?? '',
        annualIncome: data.annualIncome,
        status: data.status ?? '',
        invitedAt: data.invitedAt || null,
        acceptedAt: data.acceptedAt || null,
        capturedDate : (isEditMode ? ((initialTenantGuarantor as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialTenantGuarantor as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialTenantGuarantor as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialTenantGuarantor as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateTenantGuarantor(payload as TenantGuarantor) : await createTenantGuarantor(payload as TenantGuarantor);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`TenantGuarantor "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/tenantguarantors');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit TenantGuarantor' : 'Create TenantGuarantor'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Tenant *" error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="User " error={errors.userID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('userID')}>
              <option value="">Select User</option>
              {opts_userID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_userID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="First Name" error={errors.firstName?.message as string}>
            <input className="input" placeholder="Enter first name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('firstName')}  />
          </Field>
          <Field label="Last Name" error={errors.lastName?.message as string}>
            <input className="input" placeholder="Enter last name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('lastName')}  />
          </Field>
          <Field label="Email" error={errors.email?.message as string}>
            <textarea className="input" placeholder="Enter email" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('email')} rows={3} />
          </Field>
          <Field label="Phone Number" error={errors.phoneNumber?.message as string}>
            <input className="input" placeholder="Enter phone number" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('phoneNumber')}  />
          </Field>
          <Field label="Relationship" error={errors.relationship?.message as string}>
            <input className="input" placeholder="Enter relationship" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('relationship')}  />
          </Field>
          <Field label="Annual Income" error={errors.annualIncome?.message as string}>
            <input className="input" placeholder="Enter annual income" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('annualIncome', { valueAsNumber: true })} />
          </Field>
          <Field label="Status" error={errors.status?.message as string}>
            <input className="input" placeholder="Select status" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}  />
          </Field>
          <Field label="Invited At" error={errors.invitedAt?.message as string}>
            <input className="input" placeholder="Select invitation date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('invitedAt')} />
          </Field>
          <Field label="Accepted At" error={errors.acceptedAt?.message as string}>
            <input className="input" placeholder="Select acceptance date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('acceptedAt')} />
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

