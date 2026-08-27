{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { TenantInvitation } from '../types/TenantInvitation';
import { createTenantInvitation, updateTenantInvitation } from '../apis/useTenantInvitation';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const tenantInvitationSchema = z.object({
  leaseID: z.string().optional(),
  rentalApplicationID: z.string().optional(),
  invitationPurpose: z.string().max(50, "Invitation Purpose must be less than 50 characters").min(1, "Invitation Purpose is required"),
  email: z.string().max(255, "Email must be less than 255 characters").optional(),
  phoneNumber: z.string().max(50, "Phone Number must be less than 50 characters").optional(),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["PENDING", "ACCEPTED", "REVOKED"].includes(v as any), "Invalid Status"),
  expiresAt: z.string(),
});

type TenantInvitationFormData = z.infer<typeof tenantInvitationSchema>;

interface TenantInvitationFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialTenantInvitation?: TenantInvitation | null;
  isEditMode?: boolean;
}

export default function TenantInvitationForm({ onAlert, initialTenantInvitation = null, isEditMode = false }: TenantInvitationFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_leaseID, setOpts_leaseID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseID_loading, setOpts_leaseID_loading] = React.useState(false);
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

  async function loadOptions_leaseID(){
    try { setOpts_leaseID_loading(true);
      const url = "api/lease/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'leaseID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["leaseName", "name", "leaseName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_rentalApplicationID(){
    try { setOpts_rentalApplicationID_loading(true);
      const url = "api/rentalapplication/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'rentalApplicationID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["applicantName", "name", "rentalApplicationName", "title", "fullName", "email", "description"], String(it)),
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

  const getDefaultValues = React.useCallback((): TenantInvitationFormData => {
    const src = (initialTenantInvitation as any) ?? {};
    if (isEditMode && initialTenantInvitation) {
      return {
        leaseID: (src?.leaseID ?? ""),
        rentalApplicationID: (src?.rentalApplicationID ?? ""),
        invitationPurpose: (src?.invitationPurpose ?? ""),
        email: (src?.email ?? ""),
        phoneNumber: (src?.phoneNumber ?? ""),
        status: (src?.status ?? ""),
        expiresAt: src?.expiresAt ? new Date(src?.expiresAt as any).toISOString().split('T')[0] : "",
      };
    }
    return {
      leaseID: "",
      rentalApplicationID: "",
      invitationPurpose: "",
      email: "",
      phoneNumber: "",
      status: "PENDING",
      expiresAt: "",
    };
  }, [isEditMode, initialTenantInvitation]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(tenantInvitationSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialTenantInvitation && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialTenantInvitation, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialTenantInvitation && opts_leaseID.length > 0) {
      const currentleaseID = (initialTenantInvitation as any)?.leaseID ;
      if (currentleaseID !== undefined && currentleaseID!== null) {
        const leaseIDValue = String(currentleaseID);
        if (opts_leaseID.some(opt => opt.value === String(leaseIDValue))) {
          setValue('leaseID', leaseIDValue);
        }
      }
    }
  }, [opts_leaseID, isEditMode, initialTenantInvitation, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialTenantInvitation && opts_rentalApplicationID.length > 0) {
      const currentrentalApplicationID = (initialTenantInvitation as any)?.rentalApplicationID ;
      if (currentrentalApplicationID !== undefined && currentrentalApplicationID!== null) {
        const rentalApplicationIDValue = String(currentrentalApplicationID);
        if (opts_rentalApplicationID.some(opt => opt.value === String(rentalApplicationIDValue))) {
          setValue('rentalApplicationID', rentalApplicationIDValue);
        }
      }
    }
  }, [opts_rentalApplicationID, isEditMode, initialTenantInvitation, setValue]);

  const onSubmitHandler = async (data: TenantInvitationFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} tenantinvitation...`, 'info');
      const payload: any = {
        tenantInvitationID: (isEditMode ? ((initialTenantInvitation as any)?.tenantInvitationID ?? null) : null),
        leaseID: data.leaseID ?? '',
        rentalApplicationID: data.rentalApplicationID ?? '',
        invitationPurpose: data.invitationPurpose ?? '',
        email: data.email ?? '',
        phoneNumber: data.phoneNumber ?? '',
        tokenHash : (isEditMode ? ((initialTenantInvitation as any)?.tokenHash ?? '') : ''),
        status: data.status ?? '',
        expiresAt: data.expiresAt || null,
        acceptedAt : (isEditMode ? ((initialTenantInvitation as any)?.acceptedAt ?? null) : null),
        revokedAt : (isEditMode ? ((initialTenantInvitation as any)?.revokedAt ?? null) : null),
        capturedBy: (isEditMode ? ((initialTenantInvitation as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        capturedDate : (isEditMode ? ((initialTenantInvitation as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
      };
      let result: any;
      result = isEditMode ? await updateTenantInvitation(payload as TenantInvitation) : await createTenantInvitation(payload as TenantInvitation);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`TenantInvitation "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/tenantinvitations');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit TenantInvitation' : 'Create TenantInvitation'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Lease " error={errors.leaseID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('leaseID')}>
              <option value="">Select Lease</option>
              {opts_leaseID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_leaseID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Rental Application " error={errors.rentalApplicationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('rentalApplicationID')}>
              <option value="">Select Rental Application</option>
              {opts_rentalApplicationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_rentalApplicationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Invitation Purpose" error={errors.invitationPurpose?.message as string}>
            <input className="input" placeholder="Enter invitation purpose" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('invitationPurpose')}  />
          </Field>
          <Field label="Email" error={errors.email?.message as string}>
            <textarea className="input" placeholder="Enter email" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('email')} rows={3} />
          </Field>
          <Field label="Phone Number" error={errors.phoneNumber?.message as string}>
            <input className="input" placeholder="Enter phone number" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('phoneNumber')}  />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="PENDING">PENDING</option>
              <option value="ACCEPTED">ACCEPTED</option>
              <option value="REVOKED">REVOKED</option>
            </select>
          </Field>
          <Field label="Expires At" error={errors.expiresAt?.message as string}>
            <input className="input" placeholder="Select expiration date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('expiresAt')} />
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

