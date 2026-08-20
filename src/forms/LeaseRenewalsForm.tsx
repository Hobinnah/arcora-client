{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { LeaseRenewals } from '../types/LeaseRenewals';
import { createLeaseRenewals, updateLeaseRenewals } from '../apis/useLeaseRenewals';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const leaseRenewalsSchema = z.object({
  leaseID: z.string().min(1, "Lease is required"),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["DRAFT", "OFFERED", "ACCEPTED", "DECLINED", "EXPIRED"].includes(v as any), "Invalid Status"),
  offeredAt: z.string().optional(),
  offerExpiresAt: z.string().optional(),
  acceptedAt: z.string().optional(),
  declinedAt: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  leaseTermMonths: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  rentAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Rent Amount is required")),
  securityDepositAdjustmentAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
});

type LeaseRenewalsFormData = z.infer<typeof leaseRenewalsSchema>;

interface LeaseRenewalsFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialLeaseRenewals?: LeaseRenewals | null;
  isEditMode?: boolean;
}

export default function LeaseRenewalsForm({ onAlert, initialLeaseRenewals = null, isEditMode = false }: LeaseRenewalsFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_leaseID, setOpts_leaseID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseID_loading, setOpts_leaseID_loading] = React.useState(false);

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

  const getDefaultValues = React.useCallback((): LeaseRenewalsFormData => {
    const src = (initialLeaseRenewals as any) ?? {};
    if (isEditMode && initialLeaseRenewals) {
      return {
        leaseID: (src?.leaseID ?? ""),
        status: (src?.status ?? ""),
        offeredAt: src?.offeredAt ? new Date(src?.offeredAt as any).toISOString().split('T')[0] : "",
        offerExpiresAt: src?.offerExpiresAt ? new Date(src?.offerExpiresAt as any).toISOString().split('T')[0] : "",
        acceptedAt: src?.acceptedAt ? new Date(src?.acceptedAt as any).toISOString().split('T')[0] : "",
        declinedAt: src?.declinedAt ? new Date(src?.declinedAt as any).toISOString().split('T')[0] : "",
        startDate: src?.startDate ? new Date(src?.startDate as any).toISOString().split('T')[0] : "",
        endDate: src?.endDate ? new Date(src?.endDate as any).toISOString().split('T')[0] : "",
        leaseTermMonths: (src?.leaseTermMonths ?? 0),
        rentAmount: (src?.rentAmount ?? 0),
        securityDepositAdjustmentAmount: (src?.securityDepositAdjustmentAmount ?? 0),
        notes: (src?.notes ?? ""),
      };
    }
    return {
      leaseID: "",
      status: "DRAFT",
      offeredAt: "",
      offerExpiresAt: "",
      acceptedAt: "",
      declinedAt: "",
      startDate: "",
      endDate: "",
      leaseTermMonths: 0,
      rentAmount: 0,
      securityDepositAdjustmentAmount: 0,
      notes: "",
    };
  }, [isEditMode, initialLeaseRenewals]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(leaseRenewalsSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialLeaseRenewals && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialLeaseRenewals, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLeaseRenewals && opts_leaseID.length > 0) {
      const currentleaseID = (initialLeaseRenewals as any)?.leaseID ;
      if (currentleaseID !== undefined && currentleaseID!== null) {
        const leaseIDValue = Number(currentleaseID);
        if (opts_leaseID.some(opt => opt.value === String(leaseIDValue))) {
          setValue('leaseID', leaseIDValue);
        }
      }
    }
  }, [opts_leaseID, isEditMode, initialLeaseRenewals, setValue]);

  const onSubmitHandler = async (data: LeaseRenewalsFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} leaserenewals...`, 'info');
      const payload: any = {
        leaseRenewalID: (isEditMode ? ((initialLeaseRenewals as any)?.leaseRenewalID ?? null) : null),
        leaseID: data.leaseID ?? '',
        status: data.status ?? '',
        offeredAt: data.offeredAt || null,
        offerExpiresAt: data.offerExpiresAt || null,
        acceptedAt: data.acceptedAt || null,
        declinedAt: data.declinedAt || null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        leaseTermMonths: data.leaseTermMonths,
        rentAmount: data.rentAmount,
        securityDepositAdjustmentAmount: data.securityDepositAdjustmentAmount,
        notes: data.notes ?? '',
        capturedDate : (isEditMode ? ((initialLeaseRenewals as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialLeaseRenewals as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialLeaseRenewals as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialLeaseRenewals as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateLeaseRenewals(payload as LeaseRenewals) : await createLeaseRenewals(payload as LeaseRenewals);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`LeaseRenewals "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/leaserenewals');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit LeaseRenewals' : 'Create LeaseRenewals'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Lease *" error={errors.leaseID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('leaseID')}>
              <option value="">Select Lease</option>
              {opts_leaseID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_leaseID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="OFFERED">OFFERED</option>
              <option value="ACCEPTED">ACCEPTED</option>
              <option value="DECLINED">DECLINED</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>
          </Field>
          <Field label="Offered At" error={errors.offeredAt?.message as string}>
            <input className="input" placeholder="Select offer date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('offeredAt')} />
          </Field>
          <Field label="Offer Expires At" error={errors.offerExpiresAt?.message as string}>
            <input className="input" placeholder="Select offer expiry date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('offerExpiresAt')} />
          </Field>
          <Field label="Accepted At" error={errors.acceptedAt?.message as string}>
            <input className="input" placeholder="Select acceptance date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('acceptedAt')} />
          </Field>
          <Field label="Declined At" error={errors.declinedAt?.message as string}>
            <input className="input" placeholder="Select decline date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('declinedAt')} />
          </Field>
          <Field label="Start Date" error={errors.startDate?.message as string}>
            <input className="input" placeholder="Select start date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('startDate')} />
          </Field>
          <Field label="End Date" error={errors.endDate?.message as string}>
            <input className="input" placeholder="Select end date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('endDate')} />
          </Field>
          <Field label="Lease Term (Months)" error={errors.leaseTermMonths?.message as string}>
            <input className="input" placeholder="Enter lease term in months" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('leaseTermMonths', { valueAsNumber: true })} />
          </Field>
          <Field label="Rent Amount" error={errors.rentAmount?.message as string}>
            <input className="input" placeholder="Enter rent amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('rentAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Security Deposit Adjustment Amount" error={errors.securityDepositAdjustmentAmount?.message as string}>
            <input className="input" placeholder="Enter security deposit adjustment" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('securityDepositAdjustmentAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Notes" error={errors.notes?.message as string}>
            <textarea className="input" placeholder="Enter notes" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('notes')} rows={3} />
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

