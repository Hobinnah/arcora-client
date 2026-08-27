{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { PaymentAllocation } from '../types/PaymentAllocation';
import { createPaymentAllocation, updatePaymentAllocation } from '../apis/usePaymentAllocation';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const paymentAllocationSchema = z.object({
  paymentID: z.string().min(1, "Payment is required"),
  invoiceMasterID: z.string().min(1, "Invoice Master is required"),
  invoiceDetailID: z.string().optional(),
  allocatedAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Allocated Amount is required")),
  allocationType: z.string().max(100, "Allocation Type must be less than 100 characters").min(1, "Allocation Type is required"),
  allocatedAt: z.string(),
});

type PaymentAllocationFormData = z.infer<typeof paymentAllocationSchema>;

interface PaymentAllocationFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialPaymentAllocation?: PaymentAllocation | null;
  isEditMode?: boolean;
}

export default function PaymentAllocationForm({ onAlert, initialPaymentAllocation = null, isEditMode = false }: PaymentAllocationFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_paymentID, setOpts_paymentID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_paymentID_loading, setOpts_paymentID_loading] = React.useState(false);
  const [opts_invoiceMasterID, setOpts_invoiceMasterID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_invoiceMasterID_loading, setOpts_invoiceMasterID_loading] = React.useState(false);
  const [opts_invoiceDetailID, setOpts_invoiceDetailID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_invoiceDetailID_loading, setOpts_invoiceDetailID_loading] = React.useState(false);

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

  async function loadOptions_invoiceMasterID(){
    try { setOpts_invoiceMasterID_loading(true);
      const url = "api/invoicemaster/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'invoiceMasterID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["invoiceMasterID", "name", "invoiceMasterName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_invoiceDetailID(){
    try { setOpts_invoiceDetailID_loading(true);
      const url = "api/invoicedetail/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'invoiceDetailID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["invoiceDetailID", "name", "invoiceDetailName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["invoiceDetailID", "invoiceDetailID", "id", "ID", "invoiceDetailID", "invoiceDetailId"], String(it))
      }));
      setOpts_invoiceDetailID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_invoiceDetailID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_invoiceDetailID(); }, []);

  const getDefaultValues = React.useCallback((): PaymentAllocationFormData => {
    const src = (initialPaymentAllocation as any) ?? {};
    if (isEditMode && initialPaymentAllocation) {
      return {
        paymentID: (src?.paymentID ?? ""),
        invoiceMasterID: (src?.invoiceMasterID ?? ""),
        invoiceDetailID: (src?.invoiceDetailID ?? ""),
        allocatedAmount: (src?.allocatedAmount ?? 0),
        allocationType: (src?.allocationType ?? ""),
        allocatedAt: src?.allocatedAt ? new Date(src?.allocatedAt as any).toISOString().split('T')[0] : "",
      };
    }
    return {
      paymentID: "",
      invoiceMasterID: "",
      invoiceDetailID: "",
      allocatedAmount: 0,
      allocationType: "",
      allocatedAt: "",
    };
  }, [isEditMode, initialPaymentAllocation]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(paymentAllocationSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialPaymentAllocation && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialPaymentAllocation, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialPaymentAllocation && opts_paymentID.length > 0) {
      const currentpaymentID = (initialPaymentAllocation as any)?.paymentID ;
      if (currentpaymentID !== undefined && currentpaymentID!== null) {
        const paymentIDValue = String(currentpaymentID);
        if (opts_paymentID.some(opt => opt.value === String(paymentIDValue))) {
          setValue('paymentID', paymentIDValue);
        }
      }
    }
  }, [opts_paymentID, isEditMode, initialPaymentAllocation, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialPaymentAllocation && opts_invoiceMasterID.length > 0) {
      const currentinvoiceMasterID = (initialPaymentAllocation as any)?.invoiceMasterID ;
      if (currentinvoiceMasterID !== undefined && currentinvoiceMasterID!== null) {
        const invoiceMasterIDValue = String(currentinvoiceMasterID);
        if (opts_invoiceMasterID.some(opt => opt.value === String(invoiceMasterIDValue))) {
          setValue('invoiceMasterID', invoiceMasterIDValue);
        }
      }
    }
  }, [opts_invoiceMasterID, isEditMode, initialPaymentAllocation, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialPaymentAllocation && opts_invoiceDetailID.length > 0) {
      const currentinvoiceDetailID = (initialPaymentAllocation as any)?.invoiceDetailID ;
      if (currentinvoiceDetailID !== undefined && currentinvoiceDetailID!== null) {
        const invoiceDetailIDValue = String(currentinvoiceDetailID);
        if (opts_invoiceDetailID.some(opt => opt.value === String(invoiceDetailIDValue))) {
          setValue('invoiceDetailID', invoiceDetailIDValue);
        }
      }
    }
  }, [opts_invoiceDetailID, isEditMode, initialPaymentAllocation, setValue]);

  const onSubmitHandler = async (data: PaymentAllocationFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} paymentallocation...`, 'info');
      const payload: any = {
        paymentAllocationID: (isEditMode ? ((initialPaymentAllocation as any)?.paymentAllocationID ?? 0) : 0),
        paymentID: data.paymentID ?? '',
        invoiceMasterID: data.invoiceMasterID ?? '',
        invoiceDetailID: data.invoiceDetailID ?? '',
        allocatedAmount: data.allocatedAmount,
        allocationType: data.allocationType ?? '',
        allocatedAt: data.allocatedAt || null,
        capturedDate : (isEditMode ? ((initialPaymentAllocation as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialPaymentAllocation as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updatePaymentAllocation(payload as PaymentAllocation) : await createPaymentAllocation(payload as PaymentAllocation);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`PaymentAllocation "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/paymentallocations');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit PaymentAllocation' : 'Create PaymentAllocation'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Payment *" error={errors.paymentID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paymentID')}>
              <option value="">Select Payment</option>
              {opts_paymentID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_paymentID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Invoice Master *" error={errors.invoiceMasterID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('invoiceMasterID')}>
              <option value="">Select Invoice Master</option>
              {opts_invoiceMasterID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_invoiceMasterID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Invoice Detail " error={errors.invoiceDetailID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('invoiceDetailID')}>
              <option value="">Select Invoice Detail</option>
              {opts_invoiceDetailID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_invoiceDetailID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Allocated Amount" error={errors.allocatedAmount?.message as string}>
            <input className="input" placeholder="Enter allocated amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('allocatedAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Allocation Type" error={errors.allocationType?.message as string}>
            <input className="input" placeholder="Enter allocation type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('allocationType')}  />
          </Field>
          <Field label="Allocated At" error={errors.allocatedAt?.message as string}>
            <input className="input" placeholder="Select allocation date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('allocatedAt')} />
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

