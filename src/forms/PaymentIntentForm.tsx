{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { PaymentIntent } from '../types/PaymentIntent';
import { createPaymentIntent, updatePaymentIntent } from '../apis/usePaymentIntent';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const paymentIntentSchema = z.object({
  invoiceMasterID: z.string().optional(),
  autopayMandateID: z.string().optional(),
  tenantID: z.string().min(1, "Tenant is required"),
  paymentMethodID: z.string().min(1, "Payment Method is required"),
  amount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Amount is required")),
  currency: z.string().max(3, "Currency must be less than 3 characters").min(1, "Currency is required"),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["CREATED", "SCHEDULED", "PROCESSING", "REQUIRES_ACTION", "SUCCEEDED", "FAILED", "CANCELLED"].includes(v as any), "Invalid Status"),
  collectionMethod: z.string().max(50, "Collection Method must be less than 50 characters").min(1, "Collection Method is required"),
  providerName: z.string().max(100, "Provider Name must be less than 100 characters").min(1, "Provider Name is required"),
  providerPaymentIntentID: z.string().max(255, "Provider Payment Intent ID must be less than 255 characters").optional(),
  idempotencyKey: z.string().max(255, "Idempotency Key must be less than 255 characters").min(1, "Idempotency Key is required"),
  scheduledChargeAt: z.string(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  cancelledAt: z.string().optional(),
  failureReason: z.string().max(256, "Failure Reason must be less than 256 characters").optional(),
});

type PaymentIntentFormData = z.infer<typeof paymentIntentSchema>;

interface PaymentIntentFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialPaymentIntent?: PaymentIntent | null;
  isEditMode?: boolean;
}

export default function PaymentIntentForm({ onAlert, initialPaymentIntent = null, isEditMode = false }: PaymentIntentFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_invoiceMasterID, setOpts_invoiceMasterID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_invoiceMasterID_loading, setOpts_invoiceMasterID_loading] = React.useState(false);
  const [opts_autopayMandateID, setOpts_autopayMandateID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_autopayMandateID_loading, setOpts_autopayMandateID_loading] = React.useState(false);
  const [opts_tenantID, setOpts_tenantID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_tenantID_loading, setOpts_tenantID_loading] = React.useState(false);
  const [opts_paymentMethodID, setOpts_paymentMethodID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_paymentMethodID_loading, setOpts_paymentMethodID_loading] = React.useState(false);

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

  async function loadOptions_invoiceMasterID(){
    try { setOpts_invoiceMasterID_loading(true);
      const url = "api/invoicemaster/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'invoiceMasterID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["invoiceNumber", "name", "invoiceMasterName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["invoiceMasterID", "invoiceMasterID", "id", "ID", "invoiceMasterID", "invoiceMasterId"], String(it))
      }));
      setOpts_invoiceMasterID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_invoiceMasterID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_invoiceMasterID(); }, []);

  async function loadOptions_autopayMandateID(){
    try { setOpts_autopayMandateID_loading(true);
      const url = "api/autopaymandate/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'autopayMandateID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["mandateReference", "name", "autopayMandateName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["autopayMandateID", "autopayMandateID", "id", "ID", "autopayMandateID", "autopayMandateId"], String(it))
      }));
      setOpts_autopayMandateID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_autopayMandateID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_autopayMandateID(); }, []);

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

  async function loadOptions_paymentMethodID(){
    try { setOpts_paymentMethodID_loading(true);
      const url = "api/paymentmethod/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'paymentMethodID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["methodName", "name", "paymentMethodName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["paymentMethodID", "paymentMethodID", "id", "ID", "paymentMethodID", "paymentMethodId"], String(it))
      }));
      setOpts_paymentMethodID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_paymentMethodID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_paymentMethodID(); }, []);

  const getDefaultValues = React.useCallback((): PaymentIntentFormData => {
    const src = (initialPaymentIntent as any) ?? {};
    if (isEditMode && initialPaymentIntent) {
      return {
        invoiceMasterID: (src?.invoiceMasterID ?? ""),
        autopayMandateID: (src?.autopayMandateID ?? ""),
        tenantID: (src?.tenantID ?? ""),
        paymentMethodID: (src?.paymentMethodID ?? ""),
        amount: (src?.amount ?? 0),
        currency: (src?.currency ?? ""),
        status: (src?.status ?? ""),
        collectionMethod: (src?.collectionMethod ?? ""),
        providerName: (src?.providerName ?? ""),
        providerPaymentIntentID: (src?.providerPaymentIntentID ?? ""),
        idempotencyKey: (src?.idempotencyKey ?? ""),
        scheduledChargeAt: src?.scheduledChargeAt ? new Date(src?.scheduledChargeAt as any).toISOString().split('T')[0] : "",
        startedAt: src?.startedAt ? new Date(src?.startedAt as any).toISOString().split('T')[0] : "",
        completedAt: src?.completedAt ? new Date(src?.completedAt as any).toISOString().split('T')[0] : "",
        cancelledAt: src?.cancelledAt ? new Date(src?.cancelledAt as any).toISOString().split('T')[0] : "",
        failureReason: (src?.failureReason ?? ""),
      };
    }
    return {
      invoiceMasterID: "",
      autopayMandateID: "",
      tenantID: "",
      paymentMethodID: "",
      amount: 0,
      currency: "",
      status: "CREATED",
      collectionMethod: "",
      providerName: "",
      providerPaymentIntentID: "",
      idempotencyKey: "",
      scheduledChargeAt: "",
      startedAt: "",
      completedAt: "",
      cancelledAt: "",
      failureReason: "",
    };
  }, [isEditMode, initialPaymentIntent]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(paymentIntentSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialPaymentIntent && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialPaymentIntent, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialPaymentIntent && opts_invoiceMasterID.length > 0) {
      const currentinvoiceMasterID = (initialPaymentIntent as any)?.invoiceMasterID ;
      if (currentinvoiceMasterID !== undefined && currentinvoiceMasterID!== null) {
        const invoiceMasterIDValue = String(currentinvoiceMasterID);
        if (opts_invoiceMasterID.some(opt => opt.value === String(invoiceMasterIDValue))) {
          setValue('invoiceMasterID', invoiceMasterIDValue);
        }
      }
    }
  }, [opts_invoiceMasterID, isEditMode, initialPaymentIntent, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialPaymentIntent && opts_autopayMandateID.length > 0) {
      const currentautopayMandateID = (initialPaymentIntent as any)?.autopayMandateID ;
      if (currentautopayMandateID !== undefined && currentautopayMandateID!== null) {
        const autopayMandateIDValue = String(currentautopayMandateID);
        if (opts_autopayMandateID.some(opt => opt.value === String(autopayMandateIDValue))) {
          setValue('autopayMandateID', autopayMandateIDValue);
        }
      }
    }
  }, [opts_autopayMandateID, isEditMode, initialPaymentIntent, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialPaymentIntent && opts_tenantID.length > 0) {
      const currenttenantID = (initialPaymentIntent as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = String(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialPaymentIntent, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialPaymentIntent && opts_paymentMethodID.length > 0) {
      const currentpaymentMethodID = (initialPaymentIntent as any)?.paymentMethodID ;
      if (currentpaymentMethodID !== undefined && currentpaymentMethodID!== null) {
        const paymentMethodIDValue = String(currentpaymentMethodID);
        if (opts_paymentMethodID.some(opt => opt.value === String(paymentMethodIDValue))) {
          setValue('paymentMethodID', paymentMethodIDValue);
        }
      }
    }
  }, [opts_paymentMethodID, isEditMode, initialPaymentIntent, setValue]);

  const onSubmitHandler = async (data: PaymentIntentFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} paymentintent...`, 'info');
      const payload: any = {
        paymentIntentID: (isEditMode ? ((initialPaymentIntent as any)?.paymentIntentID ?? null) : null),
        invoiceMasterID: data.invoiceMasterID ?? '',
        autopayMandateID: data.autopayMandateID ?? '',
        tenantID: data.tenantID ?? '',
        paymentMethodID: data.paymentMethodID ?? '',
        amount: data.amount,
        currency: data.currency ?? '',
        status: data.status ?? '',
        collectionMethod: data.collectionMethod ?? '',
        providerName: data.providerName ?? '',
        providerPaymentIntentID: data.providerPaymentIntentID ?? '',
        idempotencyKey: data.idempotencyKey ?? '',
        scheduledChargeAt: data.scheduledChargeAt || null,
        startedAt: data.startedAt || null,
        cancelledAt: data.cancelledAt || null,
        failureReason: data.failureReason ?? '',
        capturedDate : (isEditMode ? ((initialPaymentIntent as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialPaymentIntent as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialPaymentIntent as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialPaymentIntent as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        completedAt: data.status === 'Completed'
          ? ((initialPaymentIntent as any)?.completedAt || new Date().toISOString().split('T')[0])
          : (initialPaymentIntent as any)?.completedAt || null,
      };
      let result: any;
      result = isEditMode ? await updatePaymentIntent(payload as PaymentIntent) : await createPaymentIntent(payload as PaymentIntent);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`PaymentIntent "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/paymentintents');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit PaymentIntent' : 'Create PaymentIntent'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Invoice Master " error={errors.invoiceMasterID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('invoiceMasterID')}>
              <option value="">Select Invoice Master</option>
              {opts_invoiceMasterID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_invoiceMasterID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Autopay Mandate " error={errors.autopayMandateID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('autopayMandateID')}>
              <option value="">Select Autopay Mandate</option>
              {opts_autopayMandateID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_autopayMandateID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Tenant *" error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Payment Method *" error={errors.paymentMethodID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paymentMethodID')}>
              <option value="">Select Payment Method</option>
              {opts_paymentMethodID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_paymentMethodID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
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
              <option value="CREATED">CREATED</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="REQUIRES_ACTION">REQUIRES_ACTION</option>
              <option value="SUCCEEDED">SUCCEEDED</option>
              <option value="FAILED">FAILED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </Field>
          <Field label="Collection Method" error={errors.collectionMethod?.message as string}>
            <input className="input" placeholder="Enter collection method" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('collectionMethod')}  />
          </Field>
          <Field label="Provider Name" error={errors.providerName?.message as string}>
            <input className="input" placeholder="Enter provider name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('providerName')}  />
          </Field>
          <Field label="Provider Payment Intent ID" error={errors.providerPaymentIntentID?.message as string}>
            <textarea className="input" placeholder="Enter provider payment intent ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerPaymentIntentID')} rows={3} />
          </Field>
          <Field label="Idempotency Key" error={errors.idempotencyKey?.message as string}>
            <textarea className="input" placeholder="Enter idempotency key" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('idempotencyKey')} rows={3} />
          </Field>
          <Field label="Scheduled Charge At" error={errors.scheduledChargeAt?.message as string}>
            <input className="input" placeholder="Select scheduled charge date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('scheduledChargeAt')} />
          </Field>
          <Field label="Started At" error={errors.startedAt?.message as string}>
            <input className="input" placeholder="Select start date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('startedAt')} />
          </Field>
          <Field label="Completed At" error={errors.completedAt?.message as string}>
            <input className="input" placeholder="Select completion date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('completedAt')} />
          </Field>
          <Field label="Cancelled At" error={errors.cancelledAt?.message as string}>
            <input className="input" placeholder="Select cancellation date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('cancelledAt')} />
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

