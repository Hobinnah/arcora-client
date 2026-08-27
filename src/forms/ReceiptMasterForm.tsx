{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { ReceiptMaster } from '../types/ReceiptMaster';
import { createReceiptMaster, updateReceiptMaster } from '../apis/useReceiptMaster';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const receiptMasterSchema = z.object({
  paymentID: z.string().min(1, "Payment is required"),
  tenantID: z.string().min(1, "Tenant is required"),
  receiptNumber: z.string().max(100, "Receipt Number must be less than 100 characters").min(1, "Receipt Number is required"),
  amount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Amount is required")),
  currency: z.string().max(10, "Currency must be less than 10 characters").min(1, "Currency is required"),
  issuedAt: z.string(),
  voidedAt: z.string().optional(),
  voidReason: z.string().max(256, "Void Reason must be less than 256 characters").optional(),
});

type ReceiptMasterFormData = z.infer<typeof receiptMasterSchema>;

interface ReceiptMasterFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialReceiptMaster?: ReceiptMaster | null;
  isEditMode?: boolean;
}

export default function ReceiptMasterForm({ onAlert, initialReceiptMaster = null, isEditMode = false }: ReceiptMasterFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_paymentID, setOpts_paymentID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_paymentID_loading, setOpts_paymentID_loading] = React.useState(false);
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

  const getDefaultValues = React.useCallback((): ReceiptMasterFormData => {
    const src = (initialReceiptMaster as any) ?? {};
    if (isEditMode && initialReceiptMaster) {
      return {
        paymentID: (src?.paymentID ?? ""),
        tenantID: (src?.tenantID ?? ""),
        receiptNumber: (src?.receiptNumber ?? ""),
        amount: (src?.amount ?? 0),
        currency: (src?.currency ?? ""),
        issuedAt: src?.issuedAt ? new Date(src?.issuedAt as any).toISOString().split('T')[0] : "",
        voidedAt: src?.voidedAt ? new Date(src?.voidedAt as any).toISOString().split('T')[0] : "",
        voidReason: (src?.voidReason ?? ""),
      };
    }
    return {
      paymentID: "",
      tenantID: "",
      receiptNumber: "",
      amount: 0,
      currency: "",
      issuedAt: "",
      voidedAt: "",
      voidReason: "",
    };
  }, [isEditMode, initialReceiptMaster]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(receiptMasterSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialReceiptMaster && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialReceiptMaster, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialReceiptMaster && opts_paymentID.length > 0) {
      const currentpaymentID = (initialReceiptMaster as any)?.paymentID ;
      if (currentpaymentID !== undefined && currentpaymentID!== null) {
        const paymentIDValue = String(currentpaymentID);
        if (opts_paymentID.some(opt => opt.value === String(paymentIDValue))) {
          setValue('paymentID', paymentIDValue);
        }
      }
    }
  }, [opts_paymentID, isEditMode, initialReceiptMaster, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialReceiptMaster && opts_tenantID.length > 0) {
      const currenttenantID = (initialReceiptMaster as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = String(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialReceiptMaster, setValue]);

  const onSubmitHandler = async (data: ReceiptMasterFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} receiptmaster...`, 'info');
      const payload: any = {
        receiptMasterID: (isEditMode ? ((initialReceiptMaster as any)?.receiptMasterID ?? 0) : 0),
        paymentID: data.paymentID ?? '',
        tenantID: data.tenantID ?? '',
        receiptNumber: data.receiptNumber ?? '',
        amount: data.amount,
        currency: data.currency ?? '',
        issuedAt: data.issuedAt || null,
        voidedAt: data.voidedAt || null,
        voidReason: data.voidReason ?? '',
        capturedBy: (isEditMode ? ((initialReceiptMaster as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        capturedDate : (isEditMode ? ((initialReceiptMaster as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
      };
      let result: any;
      result = isEditMode ? await updateReceiptMaster(payload as ReceiptMaster) : await createReceiptMaster(payload as ReceiptMaster);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`ReceiptMaster "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/receiptmasters');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit ReceiptMaster' : 'Create ReceiptMaster'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Payment *" error={errors.paymentID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paymentID')}>
              <option value="">Select Payment</option>
              {opts_paymentID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_paymentID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Tenant *" error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Receipt Number" error={errors.receiptNumber?.message as string}>
            <input className="input" placeholder="Enter receipt number" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('receiptNumber')}  />
          </Field>
          <Field label="Amount" error={errors.amount?.message as string}>
            <input className="input" placeholder="Enter amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('amount', { valueAsNumber: true })} />
          </Field>
          <Field label="Currency" error={errors.currency?.message as string}>
            <input className="input" placeholder="Enter currency" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}  />
          </Field>
          <Field label="Issued At" error={errors.issuedAt?.message as string}>
            <input className="input" placeholder="Select issued date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('issuedAt')} />
          </Field>
          <Field label="Voided At" error={errors.voidedAt?.message as string}>
            <input className="input" placeholder="Select voided date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('voidedAt')} />
          </Field>
          <Field label="Void Reason" error={errors.voidReason?.message as string}>
            <textarea className="input" placeholder="Enter void reason" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('voidReason')} rows={3} />
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

