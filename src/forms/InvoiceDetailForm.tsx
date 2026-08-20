{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { InvoiceDetail } from '../types/InvoiceDetail';
import { createInvoiceDetail, updateInvoiceDetail } from '../apis/useInvoiceDetail';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const invoiceDetailSchema = z.object({
  invoiceMasterID: z.string().min(1, "Invoice Master is required"),
  leaseRecurringChargeID: z.string().optional(),
  feeID: z.string().optional(),
  lineType: z.string().max(50, "Line Type must be less than 50 characters").min(1, "Line Type is required"),
  description: z.string().max(255, "Description must be less than 255 characters").min(1, "Description is required"),
  servicePeriodStart: z.string().optional(),
  servicePeriodEnd: z.string().optional(),
  quantity: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Quantity is required")),
  unitAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Unit Amount is required")),
  lineAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Line Amount is required")),
  taxRate: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  taxAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Tax Amount is required")),
  totalLineAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Total Line Amount is required")),
});

type InvoiceDetailFormData = z.infer<typeof invoiceDetailSchema>;

interface InvoiceDetailFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialInvoiceDetail?: InvoiceDetail | null;
  isEditMode?: boolean;
}

export default function InvoiceDetailForm({ onAlert, initialInvoiceDetail = null, isEditMode = false }: InvoiceDetailFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_invoiceMasterID, setOpts_invoiceMasterID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_invoiceMasterID_loading, setOpts_invoiceMasterID_loading] = React.useState(false);
  const [opts_leaseRecurringChargeID, setOpts_leaseRecurringChargeID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseRecurringChargeID_loading, setOpts_leaseRecurringChargeID_loading] = React.useState(false);
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

  async function loadOptions_invoiceMasterID(){
    try { setOpts_invoiceMasterID_loading(true);
      const url = "api/invoicemaster/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'invoiceMasterID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["description", "name", "invoiceMasterName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_leaseRecurringChargeID(){
    try { setOpts_leaseRecurringChargeID_loading(true);
      const url = "api/leaserecurringcharge/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'leaseRecurringChargeID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["description", "name", "leaseRecurringChargeName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["leaseRecurringChargeID", "leaseRecurringChargeID", "id", "ID", "leaseRecurringChargeID", "leaseRecurringChargeId"], String(it))
      }));
      setOpts_leaseRecurringChargeID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_leaseRecurringChargeID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_leaseRecurringChargeID(); }, []);

  async function loadOptions_feeID(){
    try { setOpts_feeID_loading(true);
      const url = "api/fee/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'feeID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["description", "name", "feeName", "title", "fullName", "email", "description"], String(it)),
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

  const getDefaultValues = React.useCallback((): InvoiceDetailFormData => {
    const src = (initialInvoiceDetail as any) ?? {};
    if (isEditMode && initialInvoiceDetail) {
      return {
        invoiceMasterID: (src?.invoiceMasterID ?? ""),
        leaseRecurringChargeID: (src?.leaseRecurringChargeID ?? ""),
        feeID: (src?.feeID ?? ""),
        lineType: (src?.lineType ?? ""),
        description: (src?.description ?? ""),
        servicePeriodStart: src?.servicePeriodStart ? new Date(src?.servicePeriodStart as any).toISOString().split('T')[0] : "",
        servicePeriodEnd: src?.servicePeriodEnd ? new Date(src?.servicePeriodEnd as any).toISOString().split('T')[0] : "",
        quantity: (src?.quantity ?? 0),
        unitAmount: (src?.unitAmount ?? 0),
        lineAmount: (src?.lineAmount ?? 0),
        taxRate: (src?.taxRate ?? 0),
        taxAmount: (src?.taxAmount ?? 0),
        totalLineAmount: (src?.totalLineAmount ?? 0),
      };
    }
    return {
      invoiceMasterID: "",
      leaseRecurringChargeID: "",
      feeID: "",
      lineType: "",
      description: "",
      servicePeriodStart: "",
      servicePeriodEnd: "",
      quantity: 0,
      unitAmount: 0,
      lineAmount: 0,
      taxRate: 0,
      taxAmount: 0,
      totalLineAmount: 0,
    };
  }, [isEditMode, initialInvoiceDetail]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(invoiceDetailSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialInvoiceDetail && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialInvoiceDetail, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialInvoiceDetail && opts_invoiceMasterID.length > 0) {
      const currentinvoiceMasterID = (initialInvoiceDetail as any)?.invoiceMasterID ;
      if (currentinvoiceMasterID !== undefined && currentinvoiceMasterID!== null) {
        const invoiceMasterIDValue = Number(currentinvoiceMasterID);
        if (opts_invoiceMasterID.some(opt => opt.value === String(invoiceMasterIDValue))) {
          setValue('invoiceMasterID', invoiceMasterIDValue);
        }
      }
    }
  }, [opts_invoiceMasterID, isEditMode, initialInvoiceDetail, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialInvoiceDetail && opts_leaseRecurringChargeID.length > 0) {
      const currentleaseRecurringChargeID = (initialInvoiceDetail as any)?.leaseRecurringChargeID ;
      if (currentleaseRecurringChargeID !== undefined && currentleaseRecurringChargeID!== null) {
        const leaseRecurringChargeIDValue = Number(currentleaseRecurringChargeID);
        if (opts_leaseRecurringChargeID.some(opt => opt.value === String(leaseRecurringChargeIDValue))) {
          setValue('leaseRecurringChargeID', leaseRecurringChargeIDValue);
        }
      }
    }
  }, [opts_leaseRecurringChargeID, isEditMode, initialInvoiceDetail, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialInvoiceDetail && opts_feeID.length > 0) {
      const currentfeeID = (initialInvoiceDetail as any)?.feeID ;
      if (currentfeeID !== undefined && currentfeeID!== null) {
        const feeIDValue = Number(currentfeeID);
        if (opts_feeID.some(opt => opt.value === String(feeIDValue))) {
          setValue('feeID', feeIDValue);
        }
      }
    }
  }, [opts_feeID, isEditMode, initialInvoiceDetail, setValue]);

  const onSubmitHandler = async (data: InvoiceDetailFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} invoicedetail...`, 'info');
      const payload: any = {
        invoiceDetailID: (isEditMode ? ((initialInvoiceDetail as any)?.invoiceDetailID ?? null) : null),
        invoiceMasterID: data.invoiceMasterID ?? '',
        leaseRecurringChargeID: data.leaseRecurringChargeID ?? '',
        feeID: data.feeID ?? '',
        lineType: data.lineType ?? '',
        description: data.description ?? '',
        servicePeriodStart: data.servicePeriodStart || null,
        servicePeriodEnd: data.servicePeriodEnd || null,
        quantity: data.quantity,
        unitAmount: data.unitAmount,
        lineAmount: data.lineAmount,
        taxRate: data.taxRate,
        taxAmount: data.taxAmount,
        totalLineAmount: data.totalLineAmount,
        capturedBy: (isEditMode ? ((initialInvoiceDetail as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        capturedDate : (isEditMode ? ((initialInvoiceDetail as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
      };
      let result: any;
      result = isEditMode ? await updateInvoiceDetail(payload as InvoiceDetail) : await createInvoiceDetail(payload as InvoiceDetail);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`InvoiceDetail "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/invoicedetails');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit InvoiceDetail' : 'Create InvoiceDetail'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Invoice Master *" error={errors.invoiceMasterID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('invoiceMasterID')}>
              <option value="">Select Invoice Master</option>
              {opts_invoiceMasterID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_invoiceMasterID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Lease Recurring Charge " error={errors.leaseRecurringChargeID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('leaseRecurringChargeID')}>
              <option value="">Select Lease Recurring Charge</option>
              {opts_leaseRecurringChargeID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_leaseRecurringChargeID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Fee " error={errors.feeID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('feeID')}>
              <option value="">Select Fee</option>
              {opts_feeID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_feeID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Line Type" error={errors.lineType?.message as string}>
            <input className="input" placeholder="Enter line type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('lineType')}  />
          </Field>
          <Field label="Description" error={errors.description?.message as string}>
            <textarea className="input" placeholder="Enter description" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('description')} rows={3} />
          </Field>
          <Field label="Service Period Start" error={errors.servicePeriodStart?.message as string}>
            <input className="input" placeholder="Select start date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('servicePeriodStart')} />
          </Field>
          <Field label="Service Period End" error={errors.servicePeriodEnd?.message as string}>
            <input className="input" placeholder="Select end date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('servicePeriodEnd')} />
          </Field>
          <Field label="Quantity" error={errors.quantity?.message as string}>
            <input className="input" placeholder="Enter quantity" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('quantity', { valueAsNumber: true })} />
          </Field>
          <Field label="Unit Amount" error={errors.unitAmount?.message as string}>
            <input className="input" placeholder="Enter unit amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('unitAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Line Amount" error={errors.lineAmount?.message as string}>
            <input className="input" placeholder="Enter line amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('lineAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Tax Rate" error={errors.taxRate?.message as string}>
            <input className="input" placeholder="Enter tax rate" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('taxRate', { valueAsNumber: true })} />
          </Field>
          <Field label="Tax Amount" error={errors.taxAmount?.message as string}>
            <input className="input" placeholder="Enter tax amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('taxAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Total Line Amount" error={errors.totalLineAmount?.message as string}>
            <input className="input" placeholder="Enter total line amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('totalLineAmount', { valueAsNumber: true })} />
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

