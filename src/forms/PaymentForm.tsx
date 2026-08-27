{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { Payment } from '../types/Payment';
import { createPayment, updatePayment } from '../apis/usePayment';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const paymentSchema = z.object({
  paymentIntentID: z.string().min(1, "Payment Intent is required"),
  tenantID: z.string().min(1, "Tenant is required"),
  providerChargeID: z.string().max(255, "Provider Charge ID must be less than 255 characters").min(1, "Provider Charge ID is required"),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["CREATED", "PROCESSING", "SUCCEEDED", "FAILED", "PENDING", "CANCELLED"].includes(v as any), "Invalid Status"),
  grossAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Gross Amount is required")),
  platformFeeAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Platform Fee Amount is required")),
  processorFeeAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Processor Fee Amount is required")),
  refundedAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Refunded Amount is required")),
  netAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Net Amount is required")),
  currency: z.string().max(3, "Currency must be less than 3 characters").min(1, "Currency is required"),
  paidAt: z.string().optional(),
  settledAt: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialPayment?: Payment | null;
  isEditMode?: boolean;
}

export default function PaymentForm({ onAlert, initialPayment = null, isEditMode = false }: PaymentFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_paymentIntentID, setOpts_paymentIntentID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_paymentIntentID_loading, setOpts_paymentIntentID_loading] = React.useState(false);
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

  async function loadOptions_paymentIntentID(){
    try { setOpts_paymentIntentID_loading(true);
      const url = "api/paymentintent/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'paymentIntentID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["providerPaymentIntentID", "name", "paymentIntentName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["paymentIntentID", "paymentIntentID", "id", "ID", "paymentIntentID", "paymentIntentId"], String(it))
      }));
      setOpts_paymentIntentID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_paymentIntentID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_paymentIntentID(); }, []);

  async function loadOptions_tenantID(){
    try { setOpts_tenantID_loading(true);
      const url = "api/tenant/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'tenantID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["fullName", "name", "tenantName", "title", "fullName", "email", "description"], String(it)),
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

  const getDefaultValues = React.useCallback((): PaymentFormData => {
    const src = (initialPayment as any) ?? {};
    if (isEditMode && initialPayment) {
      return {
        paymentIntentID: (src?.paymentIntentID ?? ""),
        tenantID: (src?.tenantID ?? ""),
        providerChargeID: (src?.providerChargeID ?? ""),
        status: (src?.status ?? ""),
        grossAmount: (src?.grossAmount ?? 0),
        platformFeeAmount: (src?.platformFeeAmount ?? 0),
        processorFeeAmount: (src?.processorFeeAmount ?? 0),
        refundedAmount: (src?.refundedAmount ?? 0),
        netAmount: (src?.netAmount ?? 0),
        currency: (src?.currency ?? ""),
        paidAt: src?.paidAt ? new Date(src?.paidAt as any).toISOString().split('T')[0] : "",
        settledAt: src?.settledAt ? new Date(src?.settledAt as any).toISOString().split('T')[0] : "",
      };
    }
    return {
      paymentIntentID: "",
      tenantID: "",
      providerChargeID: "",
      status: "CREATED",
      grossAmount: 0,
      platformFeeAmount: 0,
      processorFeeAmount: 0,
      refundedAmount: 0,
      netAmount: 0,
      currency: "",
      paidAt: "",
      settledAt: "",
    };
  }, [isEditMode, initialPayment]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(paymentSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialPayment && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialPayment, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialPayment && opts_paymentIntentID.length > 0) {
      const currentpaymentIntentID = (initialPayment as any)?.paymentIntentID ;
      if (currentpaymentIntentID !== undefined && currentpaymentIntentID!== null) {
        const paymentIntentIDValue = String(currentpaymentIntentID);
        if (opts_paymentIntentID.some(opt => opt.value === String(paymentIntentIDValue))) {
          setValue('paymentIntentID', paymentIntentIDValue);
        }
      }
    }
  }, [opts_paymentIntentID, isEditMode, initialPayment, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialPayment && opts_tenantID.length > 0) {
      const currenttenantID = (initialPayment as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = String(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialPayment, setValue]);

  const onSubmitHandler = async (data: PaymentFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} payment...`, 'info');
      const payload: any = {
        paymentID: (isEditMode ? ((initialPayment as any)?.paymentID ?? null) : null),
        paymentIntentID: data.paymentIntentID ?? '',
        tenantID: data.tenantID ?? '',
        providerChargeID: data.providerChargeID ?? '',
        status: data.status ?? '',
        grossAmount: data.grossAmount,
        platformFeeAmount: data.platformFeeAmount,
        processorFeeAmount: data.processorFeeAmount,
        refundedAmount: data.refundedAmount,
        netAmount: data.netAmount,
        currency: data.currency ?? '',
        paidAt: data.paidAt || null,
        settledAt: data.settledAt || null,
        capturedBy: (isEditMode ? ((initialPayment as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        capturedDate : (isEditMode ? ((initialPayment as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        updatedDate : (isEditMode ? ((initialPayment as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialPayment as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updatePayment(payload as Payment) : await createPayment(payload as Payment);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`Payment "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/payments');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit Payment' : 'Create Payment'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Payment Intent *" error={errors.paymentIntentID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paymentIntentID')}>
              <option value="">Select Payment Intent</option>
              {opts_paymentIntentID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_paymentIntentID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Tenant *" error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Provider Charge ID" error={errors.providerChargeID?.message as string}>
            <textarea className="input" placeholder="Enter provider charge ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerChargeID')} rows={3} />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="CREATED">CREATED</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="SUCCEEDED">SUCCEEDED</option>
              <option value="FAILED">FAILED</option>
              <option value="PENDING">PENDING</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </Field>
          <Field label="Gross Amount" error={errors.grossAmount?.message as string}>
            <input className="input" placeholder="Enter gross amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('grossAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Platform Fee Amount" error={errors.platformFeeAmount?.message as string}>
            <input className="input" placeholder="Enter platform fee amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('platformFeeAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Processor Fee Amount" error={errors.processorFeeAmount?.message as string}>
            <input className="input" placeholder="Enter processor fee amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('processorFeeAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Refunded Amount" error={errors.refundedAmount?.message as string}>
            <input className="input" placeholder="Enter refunded amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('refundedAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Net Amount" error={errors.netAmount?.message as string}>
            <input className="input" placeholder="Enter net amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('netAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Currency" error={errors.currency?.message as string}>
            <input className="input" placeholder="Enter currency code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}  />
          </Field>
          <Field label="Paid At" error={errors.paidAt?.message as string}>
            <input className="input" placeholder="Select payment date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paidAt')} />
          </Field>
          <Field label="Settled At" error={errors.settledAt?.message as string}>
            <input className="input" placeholder="Select settlement date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('settledAt')} />
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

