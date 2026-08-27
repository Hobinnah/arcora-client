{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { InvoiceMaster } from '../types/InvoiceMaster';
import { createInvoiceMaster, updateInvoiceMaster } from '../apis/useInvoiceMaster';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const invoiceMasterSchema = z.object({
  leaseID: z.string().min(1, "Lease is required"),
  leaseRenewalID: z.string().optional(),
  organizationID: z.string().min(1, "Organization is required"),
  tenantID: z.string().min(1, "Tenant is required"),
  invoiceNumber: z.string().max(100, "Invoice Number must be less than 100 characters").min(1, "Invoice Number is required"),
  billingPeriodStart: z.string(),
  billingPeriodEnd: z.string(),
  dueDate: z.string(),
  subtotalAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Subtotal Amount is required")),
  taxAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Tax Amount is required")),
  discountAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Discount Amount is required")),
  lateFeeAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Late Fee Amount is required")),
  adjustmentAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Adjustment Amount is required")),
  totalAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Total Amount is required")),
  amountPaid: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Amount Paid is required")),
  balanceDue: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Balance Due is required")),
  currency: z.string().max(3, "Currency must be less than 3 characters").min(1, "Currency is required"),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["DRAFT", "OPEN", "PARTIALLY_PAID", "PAID", "OVERDUE", "VOID", "DISPUTED"].includes(v as any), "Invalid Status"),
  issuedAt: z.string().optional(),
  paidAt: z.string().optional(),
  voidedAt: z.string().optional(),
  voidReason: z.string().max(1000, "Void Reason must be less than 1000 characters").optional(),
});

type InvoiceMasterFormData = z.infer<typeof invoiceMasterSchema>;

interface InvoiceMasterFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialInvoiceMaster?: InvoiceMaster | null;
  isEditMode?: boolean;
}

export default function InvoiceMasterForm({ onAlert, initialInvoiceMaster = null, isEditMode = false }: InvoiceMasterFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_leaseID, setOpts_leaseID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseID_loading, setOpts_leaseID_loading] = React.useState(false);
  const [opts_leaseRenewalID, setOpts_leaseRenewalID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseRenewalID_loading, setOpts_leaseRenewalID_loading] = React.useState(false);
  const [opts_organizationID, setOpts_organizationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_organizationID_loading, setOpts_organizationID_loading] = React.useState(false);
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

  async function loadOptions_leaseRenewalID(){
    try { setOpts_leaseRenewalID_loading(true);
      const url = "api/leaserenewal/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'leaseRenewalID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["leaseRenewalID", "name", "leaseRenewalName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_organizationID(){
    try { setOpts_organizationID_loading(true);
      const url = "api/organization/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'organizationID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "organizationName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_tenantID(){
    try { setOpts_tenantID_loading(true);
      const url = "api/tenant/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'tenantID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "tenantName", "title", "fullName", "email", "description"], String(it)),
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

  const getDefaultValues = React.useCallback((): InvoiceMasterFormData => {
    const src = (initialInvoiceMaster as any) ?? {};
    if (isEditMode && initialInvoiceMaster) {
      return {
        leaseID: (src?.leaseID ?? ""),
        leaseRenewalID: (src?.leaseRenewalID ?? ""),
        organizationID: (src?.organizationID ?? ""),
        tenantID: (src?.tenantID ?? ""),
        invoiceNumber: (src?.invoiceNumber ?? ""),
        billingPeriodStart: src?.billingPeriodStart ? new Date(src?.billingPeriodStart as any).toISOString().split('T')[0] : "",
        billingPeriodEnd: src?.billingPeriodEnd ? new Date(src?.billingPeriodEnd as any).toISOString().split('T')[0] : "",
        dueDate: src?.dueDate ? new Date(src?.dueDate as any).toISOString().split('T')[0] : "",
        subtotalAmount: (src?.subtotalAmount ?? 0),
        taxAmount: (src?.taxAmount ?? 0),
        discountAmount: (src?.discountAmount ?? 0),
        lateFeeAmount: (src?.lateFeeAmount ?? 0),
        adjustmentAmount: (src?.adjustmentAmount ?? 0),
        totalAmount: (src?.totalAmount ?? 0),
        amountPaid: (src?.amountPaid ?? 0),
        balanceDue: (src?.balanceDue ?? 0),
        currency: (src?.currency ?? ""),
        status: (src?.status ?? ""),
        issuedAt: src?.issuedAt ? new Date(src?.issuedAt as any).toISOString().split('T')[0] : "",
        paidAt: src?.paidAt ? new Date(src?.paidAt as any).toISOString().split('T')[0] : "",
        voidedAt: src?.voidedAt ? new Date(src?.voidedAt as any).toISOString().split('T')[0] : "",
        voidReason: (src?.voidReason ?? ""),
      };
    }
    return {
      leaseID: "",
      leaseRenewalID: "",
      organizationID: "",
      tenantID: "",
      invoiceNumber: "",
      billingPeriodStart: "",
      billingPeriodEnd: "",
      dueDate: "",
      subtotalAmount: 0,
      taxAmount: 0,
      discountAmount: 0,
      lateFeeAmount: 0,
      adjustmentAmount: 0,
      totalAmount: 0,
      amountPaid: 0,
      balanceDue: 0,
      currency: "",
      status: "DRAFT",
      issuedAt: "",
      paidAt: "",
      voidedAt: "",
      voidReason: "",
    };
  }, [isEditMode, initialInvoiceMaster]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(invoiceMasterSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialInvoiceMaster && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialInvoiceMaster, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialInvoiceMaster && opts_leaseID.length > 0) {
      const currentleaseID = (initialInvoiceMaster as any)?.leaseID ;
      if (currentleaseID !== undefined && currentleaseID!== null) {
        const leaseIDValue = String(currentleaseID);
        if (opts_leaseID.some(opt => opt.value === String(leaseIDValue))) {
          setValue('leaseID', leaseIDValue);
        }
      }
    }
  }, [opts_leaseID, isEditMode, initialInvoiceMaster, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialInvoiceMaster && opts_leaseRenewalID.length > 0) {
      const currentleaseRenewalID = (initialInvoiceMaster as any)?.leaseRenewalID ;
      if (currentleaseRenewalID !== undefined && currentleaseRenewalID!== null) {
        const leaseRenewalIDValue = String(currentleaseRenewalID);
        if (opts_leaseRenewalID.some(opt => opt.value === String(leaseRenewalIDValue))) {
          setValue('leaseRenewalID', leaseRenewalIDValue);
        }
      }
    }
  }, [opts_leaseRenewalID, isEditMode, initialInvoiceMaster, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialInvoiceMaster && opts_organizationID.length > 0) {
      const currentorganizationID = (initialInvoiceMaster as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = String(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialInvoiceMaster, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialInvoiceMaster && opts_tenantID.length > 0) {
      const currenttenantID = (initialInvoiceMaster as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = String(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialInvoiceMaster, setValue]);

  const onSubmitHandler = async (data: InvoiceMasterFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} invoicemaster...`, 'info');
      const payload: any = {
        invoiceMasterID: (isEditMode ? ((initialInvoiceMaster as any)?.invoiceMasterID ?? null) : null),
        leaseID: data.leaseID ?? '',
        leaseRenewalID: data.leaseRenewalID ?? '',
        organizationID: data.organizationID ?? '',
        tenantID: data.tenantID ?? '',
        invoiceNumber: data.invoiceNumber ?? '',
        billingPeriodStart: data.billingPeriodStart || null,
        billingPeriodEnd: data.billingPeriodEnd || null,
        dueDate: data.dueDate || null,
        subtotalAmount: data.subtotalAmount,
        taxAmount: data.taxAmount,
        discountAmount: data.discountAmount,
        lateFeeAmount: data.lateFeeAmount,
        adjustmentAmount: data.adjustmentAmount,
        totalAmount: data.totalAmount,
        amountPaid: data.amountPaid,
        balanceDue: data.balanceDue,
        currency: data.currency ?? '',
        status: data.status ?? '',
        issuedAt: data.issuedAt || null,
        paidAt: data.paidAt || null,
        voidedAt: data.voidedAt || null,
        voidReason: data.voidReason ?? '',
        capturedDate : (isEditMode ? ((initialInvoiceMaster as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialInvoiceMaster as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialInvoiceMaster as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialInvoiceMaster as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateInvoiceMaster(payload as InvoiceMaster) : await createInvoiceMaster(payload as InvoiceMaster);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`InvoiceMaster "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/invoicemasters');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit InvoiceMaster' : 'Create InvoiceMaster'}</h3></div>
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
          <Field label="Organization *" error={errors.organizationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationID')}>
              <option value="">Select Organization</option>
              {opts_organizationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Tenant *" error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Invoice Number" error={errors.invoiceNumber?.message as string}>
            <input className="input" placeholder="Enter invoice number" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('invoiceNumber')}  />
          </Field>
          <Field label="Billing Period Start" error={errors.billingPeriodStart?.message as string}>
            <input className="input" placeholder="Select billing period start" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('billingPeriodStart')} />
          </Field>
          <Field label="Billing Period End" error={errors.billingPeriodEnd?.message as string}>
            <input className="input" placeholder="Select billing period end" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('billingPeriodEnd')} />
          </Field>
          <Field label="Due Date" error={errors.dueDate?.message as string}>
            <input className="input" placeholder="Select due date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('dueDate')} />
          </Field>
          <Field label="Subtotal Amount" error={errors.subtotalAmount?.message as string}>
            <input className="input" placeholder="Enter subtotal amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('subtotalAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Tax Amount" error={errors.taxAmount?.message as string}>
            <input className="input" placeholder="Enter tax amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('taxAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Discount Amount" error={errors.discountAmount?.message as string}>
            <input className="input" placeholder="Enter discount amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('discountAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Late Fee Amount" error={errors.lateFeeAmount?.message as string}>
            <input className="input" placeholder="Enter late fee amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('lateFeeAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Adjustment Amount" error={errors.adjustmentAmount?.message as string}>
            <input className="input" placeholder="Enter adjustment amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('adjustmentAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Total Amount" error={errors.totalAmount?.message as string}>
            <input className="input" placeholder="Enter total amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('totalAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Amount Paid" error={errors.amountPaid?.message as string}>
            <input className="input" placeholder="Enter amount paid" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('amountPaid', { valueAsNumber: true })} />
          </Field>
          <Field label="Balance Due" error={errors.balanceDue?.message as string}>
            <input className="input" placeholder="Enter balance due" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('balanceDue', { valueAsNumber: true })} />
          </Field>
          <Field label="Currency" error={errors.currency?.message as string}>
            <input className="input" placeholder="Enter currency code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}  />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="OPEN">OPEN</option>
              <option value="PARTIALLY_PAID">PARTIALLY_PAID</option>
              <option value="PAID">PAID</option>
              <option value="OVERDUE">OVERDUE</option>
              <option value="VOID">VOID</option>
              <option value="DISPUTED">DISPUTED</option>
            </select>
          </Field>
          <Field label="Issued At" error={errors.issuedAt?.message as string}>
            <input className="input" placeholder="Select issued date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('issuedAt')} />
          </Field>
          <Field label="Paid At" error={errors.paidAt?.message as string}>
            <input className="input" placeholder="Select paid date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paidAt')} />
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

