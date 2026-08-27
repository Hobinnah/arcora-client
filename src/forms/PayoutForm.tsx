{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { Payout } from '../types/Payout';
import { createPayout, updatePayout } from '../apis/usePayout';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const payoutSchema = z.object({
  organizationID: z.string().min(1, "Organization is required"),
  orgPayoutAccountID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Org Payout Account is required")),
  amount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Amount is required")),
  currency: z.string().max(100, "Currency must be less than 100 characters").min(1, "Currency is required"),
  status: z.string().max(100, "Status must be less than 100 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["PENDING", "PROCESSED", "PAID", "FAILED"].includes(v as any), "Invalid Status"),
  scheduledAt: z.string().optional(),
  requestedAt: z.string(),
  processedAt: z.string().optional(),
  paidAt: z.string().optional(),
  providerName: z.string().max(100, "Provider Name must be less than 100 characters").optional(),
  providerPayoutID: z.string().max(256, "Provider Payout ID must be less than 256 characters").optional(),
  failureReason: z.string().max(256, "Failure Reason must be less than 256 characters").optional(),
});

type PayoutFormData = z.infer<typeof payoutSchema>;

interface PayoutFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialPayout?: Payout | null;
  isEditMode?: boolean;
}

export default function PayoutForm({ onAlert, initialPayout = null, isEditMode = false }: PayoutFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_organizationID, setOpts_organizationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_organizationID_loading, setOpts_organizationID_loading] = React.useState(false);
  const [opts_orgPayoutAccountID, setOpts_orgPayoutAccountID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_orgPayoutAccountID_loading, setOpts_orgPayoutAccountID_loading] = React.useState(false);

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

  async function loadOptions_organizationID(){
    try { setOpts_organizationID_loading(true);
      const url = "api/organization/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'organizationID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["organizationID", "name", "organizationName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["organizationID", "organizationID", "id", "ID", "organizationID", "organizationId"], String(it))
      }));
      setOpts_organizationID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_organizationID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_organizationID(); }, []);

  async function loadOptions_orgPayoutAccountID(){
    try { setOpts_orgPayoutAccountID_loading(true);
      const url = "api/orgpayoutaccount/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'orgPayoutAccountID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["orgPayoutAccountID", "name", "orgPayoutAccountName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["orgPayoutAccountID", "orgPayoutAccountID", "id", "ID", "orgPayoutAccountID", "orgPayoutAccountId"], String(it))
      }));
      setOpts_orgPayoutAccountID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_orgPayoutAccountID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_orgPayoutAccountID(); }, []);

  const getDefaultValues = React.useCallback((): PayoutFormData => {
    const src = (initialPayout as any) ?? {};
    if (isEditMode && initialPayout) {
      return {
        organizationID: (src?.organizationID ?? ""),
        orgPayoutAccountID: (() => {
          if (src?.orgPayoutAccountID !== undefined && src?.orgPayoutAccountID !== null) {
            return Number(src.orgPayoutAccountID);
          }
          return 0;
        })(),
        amount: (src?.amount ?? 0),
        currency: (src?.currency ?? ""),
        status: (src?.status ?? ""),
        scheduledAt: src?.scheduledAt ? new Date(src?.scheduledAt as any).toISOString().split('T')[0] : "",
        requestedAt: src?.requestedAt ? new Date(src?.requestedAt as any).toISOString().split('T')[0] : "",
        processedAt: src?.processedAt ? new Date(src?.processedAt as any).toISOString().split('T')[0] : "",
        paidAt: src?.paidAt ? new Date(src?.paidAt as any).toISOString().split('T')[0] : "",
        providerName: (src?.providerName ?? ""),
        providerPayoutID: (src?.providerPayoutID ?? ""),
        failureReason: (src?.failureReason ?? ""),
      };
    }
    return {
      organizationID: "",
      orgPayoutAccountID: 0,
      amount: 0,
      currency: "",
      status: "PENDING",
      scheduledAt: "",
      requestedAt: "",
      processedAt: "",
      paidAt: "",
      providerName: "",
      providerPayoutID: "",
      failureReason: "",
    };
  }, [isEditMode, initialPayout]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(payoutSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialPayout && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialPayout, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialPayout && opts_organizationID.length > 0) {
      const currentorganizationID = (initialPayout as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = String(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialPayout, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialPayout && opts_orgPayoutAccountID.length > 0) {
      const currentorgPayoutAccountID = (initialPayout as any)?.orgPayoutAccountID ;
      if (currentorgPayoutAccountID !== undefined && currentorgPayoutAccountID!== null) {
        const orgPayoutAccountIDValue = String(currentorgPayoutAccountID);
        if (opts_orgPayoutAccountID.some(opt => opt.value === String(orgPayoutAccountIDValue))) {
          setValue('orgPayoutAccountID', orgPayoutAccountIDValue);
        }
      }
    }
  }, [opts_orgPayoutAccountID, isEditMode, initialPayout, setValue]);

  const onSubmitHandler = async (data: PayoutFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} payout...`, 'info');
      const payload: any = {
        payoutID: (isEditMode ? ((initialPayout as any)?.payoutID ?? 0) : 0),
        organizationID: data.organizationID ?? '',
        orgPayoutAccountID: (data.orgPayoutAccountID === 0 || data.orgPayoutAccountID === undefined || data.orgPayoutAccountID === null) ? 0 : Number(data.orgPayoutAccountID),
        amount: data.amount,
        currency: data.currency ?? '',
        status: data.status ?? '',
        scheduledAt: data.scheduledAt || null,
        requestedAt: data.requestedAt || null,
        processedAt: data.processedAt || null,
        paidAt: data.paidAt || null,
        providerName: data.providerName ?? '',
        providerPayoutID: data.providerPayoutID ?? '',
        failureReason: data.failureReason ?? '',
        capturedBy: (isEditMode ? ((initialPayout as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        capturedDate : (isEditMode ? ((initialPayout as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
      };
      let result: any;
      result = isEditMode ? await updatePayout(payload as Payout) : await createPayout(payload as Payout);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`Payout "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/payouts');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit Payout' : 'Create Payout'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Organization *" error={errors.organizationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationID')}>
              <option value="">Select Organization</option>
              {opts_organizationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Org Payout Account *" error={errors.orgPayoutAccountID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('orgPayoutAccountID')}>
              <option value="">Select Org Payout Account</option>
              {opts_orgPayoutAccountID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_orgPayoutAccountID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Amount" error={errors.amount?.message as string}>
            <input className="input" placeholder="Enter amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('amount', { valueAsNumber: true })} />
          </Field>
          <Field label="Currency" error={errors.currency?.message as string}>
            <input className="input" placeholder="Enter currency code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}  />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="PENDING">PENDING</option>
              <option value="PROCESSED">PROCESSED</option>
              <option value="PAID">PAID</option>
              <option value="FAILED">FAILED</option>
            </select>
          </Field>
          <Field label="Scheduled At" error={errors.scheduledAt?.message as string}>
            <input className="input" placeholder="Select scheduled date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('scheduledAt')} />
          </Field>
          <Field label="Requested At" error={errors.requestedAt?.message as string}>
            <input className="input" placeholder="Select request date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('requestedAt')} />
          </Field>
          <Field label="Processed At" error={errors.processedAt?.message as string}>
            <input className="input" placeholder="Select processed date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('processedAt')} />
          </Field>
          <Field label="Paid At" error={errors.paidAt?.message as string}>
            <input className="input" placeholder="Select paid date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paidAt')} />
          </Field>
          <Field label="Provider Name" error={errors.providerName?.message as string}>
            <input className="input" placeholder="Enter provider name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('providerName')}  />
          </Field>
          <Field label="Provider Payout ID" error={errors.providerPayoutID?.message as string}>
            <textarea className="input" placeholder="Enter provider payout ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerPayoutID')} rows={3} />
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

