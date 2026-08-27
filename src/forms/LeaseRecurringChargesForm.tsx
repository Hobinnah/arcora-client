{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { LeaseRecurringCharges } from '../types/LeaseRecurringCharges';
import { createLeaseRecurringCharges, updateLeaseRecurringCharges } from '../apis/useLeaseRecurringCharges';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const leaseRecurringChargesSchema = z.object({
  leaseID: z.string().min(1, "Lease is required"),
  leaseRenewalID: z.string().optional(),
  feeID: z.string().optional(),
  chargeCode: z.string().max(50, "Charge Code must be less than 50 characters").min(1, "Charge Code is required"),
  description: z.string().max(255, "Description must be less than 255 characters").min(1, "Description is required"),
  amount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Amount is required")),
  currency: z.string().max(3, "Currency must be less than 3 characters").min(1, "Currency is required"),
  frequency: z.string().max(50, "Frequency must be less than 50 characters").min(1, "Frequency is required").refine(v => (v ?? '') === '' || ["MONTHLY", "WEEKLY", "YEARLY"].includes(v as any), "Invalid Frequency"),
  billingDayOfMonth: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  firstDueDate: z.string(),
  lastDueDate: z.string().optional(),
  prorationRule: z.string().max(50, "Proration Rule must be less than 50 characters").optional(),
  autoGenerateInvoice: z.boolean(),
  isActive: z.boolean(),
});

type LeaseRecurringChargesFormData = z.infer<typeof leaseRecurringChargesSchema>;

interface LeaseRecurringChargesFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialLeaseRecurringCharges?: LeaseRecurringCharges | null;
  isEditMode?: boolean;
}

export default function LeaseRecurringChargesForm({ onAlert, initialLeaseRecurringCharges = null, isEditMode = false }: LeaseRecurringChargesFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_leaseID, setOpts_leaseID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseID_loading, setOpts_leaseID_loading] = React.useState(false);
  const [opts_leaseRenewalID, setOpts_leaseRenewalID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseRenewalID_loading, setOpts_leaseRenewalID_loading] = React.useState(false);
  const [opts_feeID, setOpts_feeID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_feeID_loading, setOpts_feeID_loading] = React.useState(false);

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
        label: firstNonEmpty(it, ["name", "name", "leaseName", "title", "fullName", "email", "description"], String(it)),
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
      const url = "api/leaserenewal/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'leaseRenewalID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "leaseRenewalName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_feeID(){
    try { setOpts_feeID_loading(true);
      const url = "api/fee/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'feeID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "feeName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["feeID", "feeID", "id", "ID", "feeID", "feeId"], String(it))
      }));
      setOpts_feeID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_feeID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_feeID(); }, []);

  const getDefaultValues = React.useCallback((): LeaseRecurringChargesFormData => {
    const src = (initialLeaseRecurringCharges as any) ?? {};
    if (isEditMode && initialLeaseRecurringCharges) {
      return {
        leaseID: (src?.leaseID ?? ""),
        leaseRenewalID: (src?.leaseRenewalID ?? ""),
        feeID: (src?.feeID ?? ""),
        chargeCode: (src?.chargeCode ?? ""),
        description: (src?.description ?? ""),
        amount: (src?.amount ?? 0),
        currency: (src?.currency ?? ""),
        frequency: (src?.frequency ?? ""),
        billingDayOfMonth: (src?.billingDayOfMonth ?? 0),
        firstDueDate: src?.firstDueDate ? new Date(src?.firstDueDate as any).toISOString().split('T')[0] : "",
        lastDueDate: src?.lastDueDate ? new Date(src?.lastDueDate as any).toISOString().split('T')[0] : "",
        prorationRule: (src?.prorationRule ?? ""),
        autoGenerateInvoice: Boolean(src?.autoGenerateInvoice),
        isActive: Boolean(src?.isActive),
      };
    }
    return {
      leaseID: "",
      leaseRenewalID: "",
      feeID: "",
      chargeCode: "",
      description: "",
      amount: 0,
      currency: "",
      frequency: "",
      billingDayOfMonth: 0,
      firstDueDate: "",
      lastDueDate: "",
      prorationRule: "",
      autoGenerateInvoice: false,
      isActive: false,
    };
  }, [isEditMode, initialLeaseRecurringCharges]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(leaseRecurringChargesSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialLeaseRecurringCharges && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialLeaseRecurringCharges, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLeaseRecurringCharges && opts_leaseID.length > 0) {
      const currentleaseID = (initialLeaseRecurringCharges as any)?.leaseID ;
      if (currentleaseID !== undefined && currentleaseID!== null) {
        const leaseIDValue = String(currentleaseID);
        if (opts_leaseID.some(opt => opt.value === String(leaseIDValue))) {
          setValue('leaseID', leaseIDValue);
        }
      }
    }
  }, [opts_leaseID, isEditMode, initialLeaseRecurringCharges, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLeaseRecurringCharges && opts_leaseRenewalID.length > 0) {
      const currentleaseRenewalID = (initialLeaseRecurringCharges as any)?.leaseRenewalID ;
      if (currentleaseRenewalID !== undefined && currentleaseRenewalID!== null) {
        const leaseRenewalIDValue = String(currentleaseRenewalID);
        if (opts_leaseRenewalID.some(opt => opt.value === String(leaseRenewalIDValue))) {
          setValue('leaseRenewalID', leaseRenewalIDValue);
        }
      }
    }
  }, [opts_leaseRenewalID, isEditMode, initialLeaseRecurringCharges, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLeaseRecurringCharges && opts_feeID.length > 0) {
      const currentfeeID = (initialLeaseRecurringCharges as any)?.feeID ;
      if (currentfeeID !== undefined && currentfeeID!== null) {
        const feeIDValue = String(currentfeeID);
        if (opts_feeID.some(opt => opt.value === String(feeIDValue))) {
          setValue('feeID', feeIDValue);
        }
      }
    }
  }, [opts_feeID, isEditMode, initialLeaseRecurringCharges, setValue]);

  const onSubmitHandler = async (data: LeaseRecurringChargesFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} leaserecurringcharges...`, 'info');
      const payload: any = {
        leaseRecurringChargeID: (isEditMode ? ((initialLeaseRecurringCharges as any)?.leaseRecurringChargeID ?? null) : null),
        leaseID: data.leaseID ?? '',
        leaseRenewalID: data.leaseRenewalID ?? '',
        feeID: data.feeID ?? '',
        chargeCode: data.chargeCode ?? '',
        description: data.description ?? '',
        amount: data.amount,
        currency: data.currency ?? '',
        frequency: data.frequency ?? '',
        billingDayOfMonth: data.billingDayOfMonth,
        firstDueDate: data.firstDueDate || null,
        lastDueDate: data.lastDueDate || null,
        prorationRule: data.prorationRule ?? '',
        autoGenerateInvoice: data.autoGenerateInvoice,
        isActive: data.isActive,
        capturedDate : (isEditMode ? ((initialLeaseRecurringCharges as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialLeaseRecurringCharges as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialLeaseRecurringCharges as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialLeaseRecurringCharges as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateLeaseRecurringCharges(payload as LeaseRecurringCharges) : await createLeaseRecurringCharges(payload as LeaseRecurringCharges);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`LeaseRecurringCharges "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/leaserecurringcharges');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit LeaseRecurringCharges' : 'Create LeaseRecurringCharges'}</h3></div>
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
          <Field label="Fee " error={errors.feeID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('feeID')}>
              <option value="">Select Fee</option>
              {opts_feeID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_feeID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Charge Code" error={errors.chargeCode?.message as string}>
            <input className="input" placeholder="Enter charge code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('chargeCode')}  />
          </Field>
          <Field label="Description" error={errors.description?.message as string}>
            <textarea className="input" placeholder="Enter description" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('description')} rows={3} />
          </Field>
          <Field label="Amount" error={errors.amount?.message as string}>
            <input className="input" placeholder="Enter amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('amount', { valueAsNumber: true })} />
          </Field>
          <Field label="Currency" error={errors.currency?.message as string}>
            <input className="input" placeholder="Enter currency code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}  />
          </Field>
          <Field label="Frequency *" error={errors.frequency?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('frequency')}>
              <option value="">Select Frequency</option>
              <option value="MONTHLY">MONTHLY</option>
              <option value="WEEKLY">WEEKLY</option>
              <option value="YEARLY">YEARLY</option>
            </select>
          </Field>
          <Field label="Billing Day Of Month" error={errors.billingDayOfMonth?.message as string}>
            <input className="input" placeholder="Enter billing day of month" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('billingDayOfMonth', { valueAsNumber: true })} />
          </Field>
          <Field label="First Due Date" error={errors.firstDueDate?.message as string}>
            <input className="input" placeholder="Select first due date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('firstDueDate')} />
          </Field>
          <Field label="Last Due Date" error={errors.lastDueDate?.message as string}>
            <input className="input" placeholder="Select last due date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('lastDueDate')} />
          </Field>
          <Field label="Proration Rule" error={errors.prorationRule?.message as string}>
            <input className="input" placeholder="Enter proration rule" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('prorationRule')}  />
          </Field>
          <Field label="Auto Generate Invoice" error={errors.autoGenerateInvoice?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('autoGenerateInvoice')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Is Active *" error={errors.isActive?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('isActive')}>
              <option value="">Select Is Active</option>
              <option value="true">true</option>
              <option value="false">false</option>
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

