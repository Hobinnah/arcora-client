{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { PayoutItem } from '../types/PayoutItem';
import { createPayoutItem, updatePayoutItem } from '../apis/usePayoutItem';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const payoutItemSchema = z.object({
  payoutID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Payout is required")),
  paymentID: z.string().min(1, "Payment is required"),
  grossAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Gross Amount is required")),
  deductionAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Deduction Amount is required")),
  netPayoutAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Net Payout Amount is required")),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
});

type PayoutItemFormData = z.infer<typeof payoutItemSchema>;

interface PayoutItemFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialPayoutItem?: PayoutItem | null;
  isEditMode?: boolean;
}

export default function PayoutItemForm({ onAlert, initialPayoutItem = null, isEditMode = false }: PayoutItemFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_payoutID, setOpts_payoutID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_payoutID_loading, setOpts_payoutID_loading] = React.useState(false);
  const [opts_paymentID, setOpts_paymentID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_paymentID_loading, setOpts_paymentID_loading] = React.useState(false);

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

  async function loadOptions_payoutID(){
    try { setOpts_payoutID_loading(true);
      const url = "api/payout/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'payoutID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["payoutID", "name", "payoutName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["payoutID", "payoutID", "id", "ID", "payoutID", "payoutId"], String(it))
      }));
      setOpts_payoutID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_payoutID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_payoutID(); }, []);

  async function loadOptions_paymentID(){
    try { setOpts_paymentID_loading(true);
      const url = "api/payment/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'paymentID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["paymentID", "name", "paymentName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["paymentID", "paymentID", "id", "ID", "paymentID", "paymentId"], String(it))
      }));
      setOpts_paymentID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_paymentID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_paymentID(); }, []);

  const getDefaultValues = React.useCallback((): PayoutItemFormData => {
    const src = (initialPayoutItem as any) ?? {};
    if (isEditMode && initialPayoutItem) {
      return {
        payoutID: (() => {
          if (src?.payoutID !== undefined && src?.payoutID !== null) {
            return Number(src.payoutID);
          }
          return 0;
        })(),
        paymentID: (src?.paymentID ?? ""),
        grossAmount: (src?.grossAmount ?? 0),
        deductionAmount: (src?.deductionAmount ?? 0),
        netPayoutAmount: (src?.netPayoutAmount ?? 0),
        description: (src?.description ?? ""),
      };
    }
    return {
      payoutID: 0,
      paymentID: "",
      grossAmount: 0,
      deductionAmount: 0,
      netPayoutAmount: 0,
      description: "",
    };
  }, [isEditMode, initialPayoutItem]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(payoutItemSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialPayoutItem && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialPayoutItem, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialPayoutItem && opts_payoutID.length > 0) {
      const currentpayoutID = (initialPayoutItem as any)?.payoutID ;
      if (currentpayoutID !== undefined && currentpayoutID!== null) {
        const payoutIDValue = String(currentpayoutID);
        if (opts_payoutID.some(opt => opt.value === String(payoutIDValue))) {
          setValue('payoutID', payoutIDValue);
        }
      }
    }
  }, [opts_payoutID, isEditMode, initialPayoutItem, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialPayoutItem && opts_paymentID.length > 0) {
      const currentpaymentID = (initialPayoutItem as any)?.paymentID ;
      if (currentpaymentID !== undefined && currentpaymentID!== null) {
        const paymentIDValue = String(currentpaymentID);
        if (opts_paymentID.some(opt => opt.value === String(paymentIDValue))) {
          setValue('paymentID', paymentIDValue);
        }
      }
    }
  }, [opts_paymentID, isEditMode, initialPayoutItem, setValue]);

  const onSubmitHandler = async (data: PayoutItemFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} payoutitem...`, 'info');
      const payload: any = {
        payoutItemID: (isEditMode ? ((initialPayoutItem as any)?.payoutItemID ?? 0) : 0),
        payoutID: (data.payoutID === 0 || data.payoutID === undefined || data.payoutID === null) ? 0 : Number(data.payoutID),
        paymentID: data.paymentID ?? '',
        grossAmount: data.grossAmount,
        deductionAmount: data.deductionAmount,
        netPayoutAmount: data.netPayoutAmount,
        description: data.description ?? '',
        capturedDate : (isEditMode ? ((initialPayoutItem as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialPayoutItem as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updatePayoutItem(payload as PayoutItem) : await createPayoutItem(payload as PayoutItem);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`PayoutItem "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/payoutitems');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit PayoutItem' : 'Create PayoutItem'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Payout *" error={errors.payoutID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('payoutID')}>
              <option value="">Select Payout</option>
              {opts_payoutID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_payoutID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Payment *" error={errors.paymentID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paymentID')}>
              <option value="">Select Payment</option>
              {opts_paymentID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_paymentID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Gross Amount" error={errors.grossAmount?.message as string}>
            <input className="input" placeholder="Enter gross amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('grossAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Deduction Amount" error={errors.deductionAmount?.message as string}>
            <input className="input" placeholder="Enter deduction amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('deductionAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Net Payout Amount" error={errors.netPayoutAmount?.message as string}>
            <input className="input" placeholder="Enter net payout amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('netPayoutAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Description" error={errors.description?.message as string}>
            <textarea className="input" placeholder="Enter description" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('description')} rows={3} />
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

