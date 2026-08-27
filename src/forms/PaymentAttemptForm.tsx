{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { PaymentAttempt } from '../types/PaymentAttempt';
import { createPaymentAttempt, updatePaymentAttempt } from '../apis/usePaymentAttempt';
import { fetchData } from '../apis/useApi';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const paymentAttemptSchema = z.object({
  paymentIntentID: z.string().min(1, "Payment Intent is required"),
  attemptNumber: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Attempt Number is required")),
  amount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Amount is required")),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["PENDING", "SUCCEEDED", "FAILED", "CANCELLED"].includes(v as any), "Invalid Status"),
  providerAttemptID: z.string().max(255, "Provider Attempt ID must be less than 255 characters").optional(),
  failureCode: z.string().max(100, "Failure Code must be less than 100 characters").optional(),
  failureMessage: z.string().max(256, "Failure Message must be less than 256 characters").optional(),
  attemptedAt: z.string(),
  completedAt: z.string().optional(),
  nextRetryAt: z.string().optional(),
  providerResponse: z.string().max(256, "Provider Response must be less than 256 characters").optional(),
});

type PaymentAttemptFormData = z.infer<typeof paymentAttemptSchema>;

interface PaymentAttemptFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialPaymentAttempt?: PaymentAttempt | null;
  isEditMode?: boolean;
}

export default function PaymentAttemptForm({ onAlert, initialPaymentAttempt = null, isEditMode = false }: PaymentAttemptFormProps) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_paymentIntentID, setOpts_paymentIntentID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_paymentIntentID_loading, setOpts_paymentIntentID_loading] = React.useState(false);

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

  const getDefaultValues = React.useCallback((): PaymentAttemptFormData => {
    const src = (initialPaymentAttempt as any) ?? {};
    if (isEditMode && initialPaymentAttempt) {
      return {
        paymentIntentID: (src?.paymentIntentID ?? ""),
        attemptNumber: (src?.attemptNumber ?? 0),
        amount: (src?.amount ?? 0),
        status: (src?.status ?? ""),
        providerAttemptID: (src?.providerAttemptID ?? ""),
        failureCode: (src?.failureCode ?? ""),
        failureMessage: (src?.failureMessage ?? ""),
        attemptedAt: src?.attemptedAt ? new Date(src?.attemptedAt as any).toISOString().split('T')[0] : "",
        completedAt: src?.completedAt ? new Date(src?.completedAt as any).toISOString().split('T')[0] : "",
        nextRetryAt: src?.nextRetryAt ? new Date(src?.nextRetryAt as any).toISOString().split('T')[0] : "",
        providerResponse: (src?.providerResponse ?? ""),
      };
    }
    return {
      paymentIntentID: "",
      attemptNumber: 0,
      amount: 0,
      status: "PENDING",
      providerAttemptID: "",
      failureCode: "",
      failureMessage: "",
      attemptedAt: "",
      completedAt: "",
      nextRetryAt: "",
      providerResponse: "",
    };
  }, [isEditMode, initialPaymentAttempt]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(paymentAttemptSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialPaymentAttempt && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialPaymentAttempt, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialPaymentAttempt && opts_paymentIntentID.length > 0) {
      const currentpaymentIntentID = (initialPaymentAttempt as any)?.paymentIntentID ;
      if (currentpaymentIntentID !== undefined && currentpaymentIntentID!== null) {
        const paymentIntentIDValue = String(currentpaymentIntentID);
        if (opts_paymentIntentID.some(opt => opt.value === String(paymentIntentIDValue))) {
          setValue('paymentIntentID', paymentIntentIDValue);
        }
      }
    }
  }, [opts_paymentIntentID, isEditMode, initialPaymentAttempt, setValue]);

  const onSubmitHandler = async (data: PaymentAttemptFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} paymentattempt...`, 'info');
      const payload: any = {
        paymentAttemptID: (isEditMode ? ((initialPaymentAttempt as any)?.paymentAttemptID ?? null) : null),
        paymentIntentID: data.paymentIntentID ?? '',
        attemptNumber: data.attemptNumber,
        amount: data.amount,
        status: data.status ?? '',
        providerAttemptID: data.providerAttemptID ?? '',
        failureCode: data.failureCode ?? '',
        failureMessage: data.failureMessage ?? '',
        attemptedAt: data.attemptedAt || null,
        nextRetryAt: data.nextRetryAt || null,
        providerResponse: data.providerResponse ?? '',
        capturedDate : (isEditMode ? ((initialPaymentAttempt as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        completedAt: data.status === 'Completed'
          ? ((initialPaymentAttempt as any)?.completedAt || new Date().toISOString().split('T')[0])
          : (initialPaymentAttempt as any)?.completedAt || null,
      };
      let result: any;
      result = isEditMode ? await updatePaymentAttempt(payload as PaymentAttempt) : await createPaymentAttempt(payload as PaymentAttempt);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`PaymentAttempt "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/paymentattempts');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit PaymentAttempt' : 'Create PaymentAttempt'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Payment Intent *" error={errors.paymentIntentID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paymentIntentID')}>
              <option value="">Select Payment Intent</option>
              {opts_paymentIntentID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_paymentIntentID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Attempt Number" error={errors.attemptNumber?.message as string}>
            <input className="input" placeholder="Enter attempt number" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('attemptNumber', { valueAsNumber: true })} />
          </Field>
          <Field label="Amount" error={errors.amount?.message as string}>
            <input className="input" placeholder="Enter amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('amount', { valueAsNumber: true })} />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="PENDING">PENDING</option>
              <option value="SUCCEEDED">SUCCEEDED</option>
              <option value="FAILED">FAILED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </Field>
          <Field label="Provider Attempt ID" error={errors.providerAttemptID?.message as string}>
            <textarea className="input" placeholder="Enter provider attempt ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerAttemptID')} rows={3} />
          </Field>
          <Field label="Failure Code" error={errors.failureCode?.message as string}>
            <input className="input" placeholder="Enter failure code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('failureCode')}  />
          </Field>
          <Field label="Failure Message" error={errors.failureMessage?.message as string}>
            <textarea className="input" placeholder="Enter failure message" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('failureMessage')} rows={3} />
          </Field>
          <Field label="Attempted At" error={errors.attemptedAt?.message as string}>
            <input className="input" placeholder="Select attempt date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('attemptedAt')} />
          </Field>
          <Field label="Completed At" error={errors.completedAt?.message as string}>
            <input className="input" placeholder="Select completion date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('completedAt')} />
          </Field>
          <Field label="Next Retry At" error={errors.nextRetryAt?.message as string}>
            <input className="input" placeholder="Select next retry date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('nextRetryAt')} />
          </Field>
          <Field label="Provider Response" error={errors.providerResponse?.message as string}>
            <textarea className="input" placeholder="Provider response JSON" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerResponse')} rows={3} />
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

