{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { AutopayMandate } from '../types/AutopayMandate';
import { createAutopayMandate, updateAutopayMandate } from '../apis/useAutopayMandate';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const autopayMandateSchema = z.object({
  leaseID: z.string().min(1, "Lease is required"),
  leaseRenewalID: z.string().optional(),
  tenantID: z.string().min(1, "Tenant is required"),
  paymentMethodID: z.string().min(1, "Payment Method is required"),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["PENDING", "ACTIVE", "CANCELLED"].includes(v as any), "Invalid Status"),
  mandateType: z.string().max(50, "Mandate Type must be less than 50 characters").min(1, "Mandate Type is required").refine(v => (v ?? '') === '' || ["VARIABLE", "FIXED"].includes(v as any), "Invalid Mandate Type"),
  paymentRail: z.string().max(50, "Payment Rail must be less than 50 characters").min(1, "Payment Rail is required"),
  maximumAmountPerDebit: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  currency: z.string().max(3, "Currency must be less than 3 characters").min(1, "Currency is required"),
  frequency: z.string().max(50, "Frequency must be less than 50 characters").min(1, "Frequency is required").refine(v => (v ?? '') === '' || ["MONTHLY", "WEEKLY", "DAILY"].includes(v as any), "Invalid Frequency"),
  startDate: z.string(),
  endDate: z.string().optional(),
  providerName: z.string().max(100, "Provider Name must be less than 100 characters").min(1, "Provider Name is required"),
  providerMandateID: z.string().max(255, "Provider Mandate ID must be less than 255 characters").optional(),
  consentVersion: z.string().max(50, "Consent Version must be less than 50 characters").min(1, "Consent Version is required"),
  consentTextHash: z.string().max(255, "Consent Text Hash must be less than 255 characters").optional(),
  consentIpAddress: z.string().max(100, "Consent IP Address must be less than 100 characters").optional(),
  consentedAt: z.string().optional(),
  activatedAt: z.string().optional(),
  cancelledAt: z.string().optional(),
  cancellationReason: z.string().max(256, "Cancellation Reason must be less than 256 characters").optional(),
});

type AutopayMandateFormData = z.infer<typeof autopayMandateSchema>;

interface AutopayMandateFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialAutopayMandate?: AutopayMandate | null;
  isEditMode?: boolean;
}

export default function AutopayMandateForm({ onAlert, initialAutopayMandate = null, isEditMode = false }: AutopayMandateFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_leaseID, setOpts_leaseID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseID_loading, setOpts_leaseID_loading] = React.useState(false);
  const [opts_leaseRenewalID, setOpts_leaseRenewalID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseRenewalID_loading, setOpts_leaseRenewalID_loading] = React.useState(false);
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

  async function loadOptions_leaseID(){
    try { setOpts_leaseID_loading(true);
      const url = "api/lease/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'leaseID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["leaseName", "name", "leaseName", "title", "fullName", "email", "description"], String(it)),
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
        label: firstNonEmpty(it, ["renewalDescription", "name", "leaseRenewalName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_tenantID(){
    try { setOpts_tenantID_loading(true);
      const url = "api/tenant/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'tenantID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["tenantName", "name", "tenantName", "title", "fullName", "email", "description"], String(it)),
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

  const getDefaultValues = React.useCallback((): AutopayMandateFormData => {
    const src = (initialAutopayMandate as any) ?? {};
    if (isEditMode && initialAutopayMandate) {
      return {
        leaseID: (src?.leaseID ?? ""),
        leaseRenewalID: (src?.leaseRenewalID ?? ""),
        tenantID: (src?.tenantID ?? ""),
        paymentMethodID: (src?.paymentMethodID ?? ""),
        status: (src?.status ?? ""),
        mandateType: (src?.mandateType ?? ""),
        paymentRail: (src?.paymentRail ?? ""),
        maximumAmountPerDebit: (src?.maximumAmountPerDebit ?? 0),
        currency: (src?.currency ?? ""),
        frequency: (src?.frequency ?? ""),
        startDate: src?.startDate ? new Date(src?.startDate as any).toISOString().split('T')[0] : "",
        endDate: src?.endDate ? new Date(src?.endDate as any).toISOString().split('T')[0] : "",
        providerName: (src?.providerName ?? ""),
        providerMandateID: (src?.providerMandateID ?? ""),
        consentVersion: (src?.consentVersion ?? ""),
        consentTextHash: (src?.consentTextHash ?? ""),
        consentIpAddress: (src?.consentIpAddress ?? ""),
        consentedAt: src?.consentedAt ? new Date(src?.consentedAt as any).toISOString().split('T')[0] : "",
        activatedAt: src?.activatedAt ? new Date(src?.activatedAt as any).toISOString().split('T')[0] : "",
        cancelledAt: src?.cancelledAt ? new Date(src?.cancelledAt as any).toISOString().split('T')[0] : "",
        cancellationReason: (src?.cancellationReason ?? ""),
      };
    }
    return {
      leaseID: "",
      leaseRenewalID: "",
      tenantID: "",
      paymentMethodID: "",
      status: "PENDING",
      mandateType: "",
      paymentRail: "",
      maximumAmountPerDebit: 0,
      currency: "",
      frequency: "",
      startDate: "",
      endDate: "",
      providerName: "",
      providerMandateID: "",
      consentVersion: "",
      consentTextHash: "",
      consentIpAddress: "",
      consentedAt: "",
      activatedAt: "",
      cancelledAt: "",
      cancellationReason: "",
    };
  }, [isEditMode, initialAutopayMandate]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(autopayMandateSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialAutopayMandate && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialAutopayMandate, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialAutopayMandate && opts_leaseID.length > 0) {
      const currentleaseID = (initialAutopayMandate as any)?.leaseID ;
      if (currentleaseID !== undefined && currentleaseID!== null) {
        const leaseIDValue = String(currentleaseID);
        if (opts_leaseID.some(opt => opt.value === String(leaseIDValue))) {
          setValue('leaseID', leaseIDValue);
        }
      }
    }
  }, [opts_leaseID, isEditMode, initialAutopayMandate, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialAutopayMandate && opts_leaseRenewalID.length > 0) {
      const currentleaseRenewalID = (initialAutopayMandate as any)?.leaseRenewalID ;
      if (currentleaseRenewalID !== undefined && currentleaseRenewalID!== null) {
        const leaseRenewalIDValue = String(currentleaseRenewalID);
        if (opts_leaseRenewalID.some(opt => opt.value === String(leaseRenewalIDValue))) {
          setValue('leaseRenewalID', leaseRenewalIDValue);
        }
      }
    }
  }, [opts_leaseRenewalID, isEditMode, initialAutopayMandate, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialAutopayMandate && opts_tenantID.length > 0) {
      const currenttenantID = (initialAutopayMandate as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = String(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialAutopayMandate, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialAutopayMandate && opts_paymentMethodID.length > 0) {
      const currentpaymentMethodID = (initialAutopayMandate as any)?.paymentMethodID ;
      if (currentpaymentMethodID !== undefined && currentpaymentMethodID!== null) {
        const paymentMethodIDValue = String(currentpaymentMethodID);
        if (opts_paymentMethodID.some(opt => opt.value === String(paymentMethodIDValue))) {
          setValue('paymentMethodID', paymentMethodIDValue);
        }
      }
    }
  }, [opts_paymentMethodID, isEditMode, initialAutopayMandate, setValue]);

  const onSubmitHandler = async (data: AutopayMandateFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} autopaymandate...`, 'info');
      const payload: any = {
        autopayMandateID: (isEditMode ? ((initialAutopayMandate as any)?.autopayMandateID ?? null) : null),
        leaseID: data.leaseID ?? '',
        leaseRenewalID: data.leaseRenewalID ?? '',
        tenantID: data.tenantID ?? '',
        paymentMethodID: data.paymentMethodID ?? '',
        status: data.status ?? '',
        mandateType: data.mandateType ?? '',
        paymentRail: data.paymentRail ?? '',
        maximumAmountPerDebit: data.maximumAmountPerDebit,
        currency: data.currency ?? '',
        frequency: data.frequency ?? '',
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        providerName: data.providerName ?? '',
        providerMandateID: data.providerMandateID ?? '',
        consentVersion: data.consentVersion ?? '',
        consentTextHash: data.consentTextHash ?? '',
        consentIpAddress: data.consentIpAddress ?? '',
        consentedAt: data.consentedAt || null,
        activatedAt: data.activatedAt || null,
        cancelledAt: data.cancelledAt || null,
        cancellationReason: data.cancellationReason ?? '',
        capturedBy: (isEditMode ? ((initialAutopayMandate as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        capturedDate : (isEditMode ? ((initialAutopayMandate as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        updatedDate : (isEditMode ? ((initialAutopayMandate as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialAutopayMandate as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateAutopayMandate(payload as AutopayMandate) : await createAutopayMandate(payload as AutopayMandate);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`AutopayMandate "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/autopaymandates');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit AutopayMandate' : 'Create AutopayMandate'}</h3></div>
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
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="PENDING">PENDING</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </Field>
          <Field label="Mandate Type *" error={errors.mandateType?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('mandateType')}>
              <option value="">Select Mandate Type</option>
              <option value="VARIABLE">VARIABLE</option>
              <option value="FIXED">FIXED</option>
            </select>
          </Field>
          <Field label="Payment Rail" error={errors.paymentRail?.message as string}>
            <input className="input" placeholder="Enter payment rail" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paymentRail')}  />
          </Field>
          <Field label="Maximum Amount Per Debit" error={errors.maximumAmountPerDebit?.message as string}>
            <input className="input" placeholder="Enter maximum amount per debit" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('maximumAmountPerDebit', { valueAsNumber: true })} />
          </Field>
          <Field label="Currency" error={errors.currency?.message as string}>
            <input className="input" placeholder="Enter currency code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}  />
          </Field>
          <Field label="Frequency *" error={errors.frequency?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('frequency')}>
              <option value="">Select Frequency</option>
              <option value="MONTHLY">MONTHLY</option>
              <option value="WEEKLY">WEEKLY</option>
              <option value="DAILY">DAILY</option>
            </select>
          </Field>
          <Field label="Start Date" error={errors.startDate?.message as string}>
            <input className="input" placeholder="Select start date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('startDate')} />
          </Field>
          <Field label="End Date" error={errors.endDate?.message as string}>
            <input className="input" placeholder="Select end date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('endDate')} />
          </Field>
          <Field label="Provider Name" error={errors.providerName?.message as string}>
            <input className="input" placeholder="Enter provider name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('providerName')}  />
          </Field>
          <Field label="Provider Mandate ID" error={errors.providerMandateID?.message as string}>
            <textarea className="input" placeholder="Enter provider mandate ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerMandateID')} rows={3} />
          </Field>
          <Field label="Consent Version" error={errors.consentVersion?.message as string}>
            <input className="input" placeholder="Enter consent version" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('consentVersion')}  />
          </Field>
          <Field label="Consent Text Hash" error={errors.consentTextHash?.message as string}>
            <textarea className="input" placeholder="Enter consent text hash" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('consentTextHash')} rows={3} />
          </Field>
          <Field label="Consent IP Address" error={errors.consentIpAddress?.message as string}>
            <input className="input" placeholder="Enter consent IP address" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('consentIpAddress')}  />
          </Field>
          <Field label="Consented At" error={errors.consentedAt?.message as string}>
            <input className="input" placeholder="Select consent date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('consentedAt')} />
          </Field>
          <Field label="Activated At" error={errors.activatedAt?.message as string}>
            <input className="input" placeholder="Select activation date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('activatedAt')} />
          </Field>
          <Field label="Cancelled At" error={errors.cancelledAt?.message as string}>
            <input className="input" placeholder="Select cancellation date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('cancelledAt')} />
          </Field>
          <Field label="Cancellation Reason" error={errors.cancellationReason?.message as string}>
            <textarea className="input" placeholder="Enter cancellation reason" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('cancellationReason')} rows={3} />
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

