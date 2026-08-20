{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { LeaseOccupants } from '../types/LeaseOccupants';
import { createLeaseOccupants, updateLeaseOccupants } from '../apis/useLeaseOccupants';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const leaseOccupantsSchema = z.object({
  leaseID: z.string().min(1, "Lease is required"),
  leaseRenewalID: z.string().optional(),
  tenantID: z.string().optional(),
  userID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  firstName: z.string().max(100, "First Name must be less than 100 characters").min(1, "First Name is required"),
  lastName: z.string().max(100, "Last Name must be less than 100 characters").min(1, "Last Name is required"),
  dateOfBirth: z.string().optional(),
  email: z.string().max(255, "Email must be less than 255 characters").optional(),
  phoneNumber: z.string().max(50, "Phone Number must be less than 50 characters").optional(),
  occupantType: z.string().max(50, "Occupant Type must be less than 50 characters").min(1, "Occupant Type is required").refine(v => (v ?? '') === '' || ["TENANT", "GUEST", "OTHER"].includes(v as any), "Invalid Occupant Type"),
  isPrimaryTenant: z.boolean(),
  isFinanciallyResponsible: z.boolean(),
  joinedAt: z.string().optional(),
  removedAt: z.string().optional(),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["ACTIVE", "INACTIVE", "REMOVED"].includes(v as any), "Invalid Status"),
});

type LeaseOccupantsFormData = z.infer<typeof leaseOccupantsSchema>;

interface LeaseOccupantsFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialLeaseOccupants?: LeaseOccupants | null;
  isEditMode?: boolean;
}

export default function LeaseOccupantsForm({ onAlert, initialLeaseOccupants = null, isEditMode = false }: LeaseOccupantsFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_leaseID, setOpts_leaseID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseID_loading, setOpts_leaseID_loading] = React.useState(false);
  const [opts_leaseRenewalID, setOpts_leaseRenewalID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseRenewalID_loading, setOpts_leaseRenewalID_loading] = React.useState(false);
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

  async function loadOptions_tenantID(){
    try { setOpts_tenantID_loading(true);
      const url = "api/tenant/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'tenantID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["tenantID", "name", "tenantName", "title", "fullName", "email", "description"], String(it)),
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

  const getDefaultValues = React.useCallback((): LeaseOccupantsFormData => {
    const src = (initialLeaseOccupants as any) ?? {};
    if (isEditMode && initialLeaseOccupants) {
      return {
        leaseID: (src?.leaseID ?? ""),
        leaseRenewalID: (src?.leaseRenewalID ?? ""),
        tenantID: (src?.tenantID ?? ""),
        userID: (() => {
          if (src?.userID !== undefined && src?.userID !== null) {
            return Number(src.userID);
          }
          return 0;
        })(),
        firstName: (src?.firstName ?? ""),
        lastName: (src?.lastName ?? ""),
        dateOfBirth: src?.dateOfBirth ? new Date(src?.dateOfBirth as any).toISOString().split('T')[0] : "",
        email: (src?.email ?? ""),
        phoneNumber: (src?.phoneNumber ?? ""),
        occupantType: (src?.occupantType ?? ""),
        isPrimaryTenant: Boolean(src?.isPrimaryTenant),
        isFinanciallyResponsible: Boolean(src?.isFinanciallyResponsible),
        joinedAt: src?.joinedAt ? new Date(src?.joinedAt as any).toISOString().split('T')[0] : "",
        removedAt: src?.removedAt ? new Date(src?.removedAt as any).toISOString().split('T')[0] : "",
        status: (src?.status ?? ""),
      };
    }
    return {
      leaseID: "",
      leaseRenewalID: "",
      tenantID: "",
      userID: 0,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      phoneNumber: "",
      occupantType: "",
      isPrimaryTenant: false,
      isFinanciallyResponsible: false,
      joinedAt: "",
      removedAt: "",
      status: "ACTIVE",
    };
  }, [isEditMode, initialLeaseOccupants]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(leaseOccupantsSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialLeaseOccupants && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialLeaseOccupants, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLeaseOccupants && opts_leaseID.length > 0) {
      const currentleaseID = (initialLeaseOccupants as any)?.leaseID ;
      if (currentleaseID !== undefined && currentleaseID!== null) {
        const leaseIDValue = Number(currentleaseID);
        if (opts_leaseID.some(opt => opt.value === String(leaseIDValue))) {
          setValue('leaseID', leaseIDValue);
        }
      }
    }
  }, [opts_leaseID, isEditMode, initialLeaseOccupants, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLeaseOccupants && opts_leaseRenewalID.length > 0) {
      const currentleaseRenewalID = (initialLeaseOccupants as any)?.leaseRenewalID ;
      if (currentleaseRenewalID !== undefined && currentleaseRenewalID!== null) {
        const leaseRenewalIDValue = Number(currentleaseRenewalID);
        if (opts_leaseRenewalID.some(opt => opt.value === String(leaseRenewalIDValue))) {
          setValue('leaseRenewalID', leaseRenewalIDValue);
        }
      }
    }
  }, [opts_leaseRenewalID, isEditMode, initialLeaseOccupants, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLeaseOccupants && opts_tenantID.length > 0) {
      const currenttenantID = (initialLeaseOccupants as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = Number(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialLeaseOccupants, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLeaseOccupants && opts_userID.length > 0) {
      const currentuserID = (initialLeaseOccupants as any)?.userID ;
      if (currentuserID !== undefined && currentuserID!== null) {
        const userIDValue = Number(currentuserID);
        if (opts_userID.some(opt => opt.value === String(userIDValue))) {
          setValue('userID', userIDValue);
        }
      }
    }
  }, [opts_userID, isEditMode, initialLeaseOccupants, setValue]);

  const onSubmitHandler = async (data: LeaseOccupantsFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} leaseoccupants...`, 'info');
      const payload: any = {
        leaseOccupantID: (isEditMode ? ((initialLeaseOccupants as any)?.leaseOccupantID ?? null) : null),
        leaseID: data.leaseID ?? '',
        leaseRenewalID: data.leaseRenewalID ?? '',
        tenantID: data.tenantID ?? '',
        userID: (data.userID === 0 || data.userID === undefined || data.userID === null) ? 0 : Number(data.userID),
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        dateOfBirth: data.dateOfBirth || null,
        email: data.email ?? '',
        phoneNumber: data.phoneNumber ?? '',
        occupantType: data.occupantType ?? '',
        isPrimaryTenant: data.isPrimaryTenant,
        isFinanciallyResponsible: data.isFinanciallyResponsible,
        joinedAt: data.joinedAt || null,
        removedAt: data.removedAt || null,
        status: data.status ?? '',
        capturedDate : (isEditMode ? ((initialLeaseOccupants as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialLeaseOccupants as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialLeaseOccupants as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialLeaseOccupants as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateLeaseOccupants(payload as LeaseOccupants) : await createLeaseOccupants(payload as LeaseOccupants);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`LeaseOccupants "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/leaseoccupants');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit LeaseOccupants' : 'Create LeaseOccupants'}</h3></div>
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
          <Field label="Tenant " error={errors.tenantID?.message as string}>
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
          <Field label="Date of Birth" error={errors.dateOfBirth?.message as string}>
            <input className="input" placeholder="Select date of birth" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('dateOfBirth')} />
          </Field>
          <Field label="Email" error={errors.email?.message as string}>
            <textarea className="input" placeholder="Enter email" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('email')} rows={3} />
          </Field>
          <Field label="Phone Number" error={errors.phoneNumber?.message as string}>
            <input className="input" placeholder="Enter phone number" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('phoneNumber')}  />
          </Field>
          <Field label="Occupant Type *" error={errors.occupantType?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('occupantType')}>
              <option value="">Select Occupant Type</option>
              <option value="TENANT">TENANT</option>
              <option value="GUEST">GUEST</option>
              <option value="OTHER">OTHER</option>
            </select>
          </Field>
          <Field label="Is Primary Tenant" error={errors.isPrimaryTenant?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isPrimaryTenant')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Is Financially Responsible" error={errors.isFinanciallyResponsible?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isFinanciallyResponsible')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Joined At" error={errors.joinedAt?.message as string}>
            <input className="input" placeholder="Select join date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('joinedAt')} />
          </Field>
          <Field label="Removed At" error={errors.removedAt?.message as string}>
            <input className="input" placeholder="Select removal date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('removedAt')} />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="REMOVED">REMOVED</option>
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

