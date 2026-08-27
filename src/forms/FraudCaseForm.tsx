{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { FraudCase } from '../types/FraudCase';
import { createFraudCase, updateFraudCase } from '../apis/useFraudCase';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const fraudCaseSchema = z.object({
  tenantID: z.string().optional(),
  organizationID: z.string().optional(),
  leaseID: z.string().optional(),
  leaseRenewalID: z.string().optional(),
  paymentIntentID: z.string().optional(),
  paymentID: z.string().optional(),
  chargebackID: z.string().optional(),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required"),
  riskScore: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  reason: z.string().max(256, "Reason must be less than 256 characters").optional(),
  isBlocking: z.boolean(),
  resolution: z.string().max(100, "Resolution must be less than 100 characters").optional(),
});

type FraudCaseFormData = z.infer<typeof fraudCaseSchema>;

interface FraudCaseFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialFraudCase?: FraudCase | null;
  isEditMode?: boolean;
}

export default function FraudCaseForm({ onAlert, initialFraudCase = null, isEditMode = false }: FraudCaseFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_tenantID, setOpts_tenantID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_tenantID_loading, setOpts_tenantID_loading] = React.useState(false);
  const [opts_organizationID, setOpts_organizationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_organizationID_loading, setOpts_organizationID_loading] = React.useState(false);
  const [opts_leaseID, setOpts_leaseID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseID_loading, setOpts_leaseID_loading] = React.useState(false);
  const [opts_leaseRenewalID, setOpts_leaseRenewalID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseRenewalID_loading, setOpts_leaseRenewalID_loading] = React.useState(false);
  const [opts_paymentIntentID, setOpts_paymentIntentID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_paymentIntentID_loading, setOpts_paymentIntentID_loading] = React.useState(false);
  const [opts_paymentID, setOpts_paymentID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_paymentID_loading, setOpts_paymentID_loading] = React.useState(false);
  const [opts_chargebackID, setOpts_chargebackID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_chargebackID_loading, setOpts_chargebackID_loading] = React.useState(false);

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

  async function loadOptions_paymentIntentID(){
    try { setOpts_paymentIntentID_loading(true);
      const url = "api/paymentintent/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'paymentIntentID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["paymentIntentID", "name", "paymentIntentName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_chargebackID(){
    try { setOpts_chargebackID_loading(true);
      const url = "api/chargeback/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'chargebackID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["chargebackID", "name", "chargebackName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["chargebackID", "chargebackID", "id", "ID", "chargebackID", "chargebackId"], String(it))
      }));
      setOpts_chargebackID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_chargebackID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_chargebackID(); }, []);

  const getDefaultValues = React.useCallback((): FraudCaseFormData => {
    const src = (initialFraudCase as any) ?? {};
    if (isEditMode && initialFraudCase) {
      return {
        tenantID: (src?.tenantID ?? ""),
        organizationID: (src?.organizationID ?? ""),
        leaseID: (src?.leaseID ?? ""),
        leaseRenewalID: (src?.leaseRenewalID ?? ""),
        paymentIntentID: (src?.paymentIntentID ?? ""),
        paymentID: (src?.paymentID ?? ""),
        chargebackID: (src?.chargebackID ?? ""),
        status: (src?.status ?? ""),
        riskScore: (src?.riskScore ?? 0),
        reason: (src?.reason ?? ""),
        isBlocking: Boolean(src?.isBlocking),
        resolution: (src?.resolution ?? ""),
      };
    }
    return {
      tenantID: "",
      organizationID: "",
      leaseID: "",
      leaseRenewalID: "",
      paymentIntentID: "",
      paymentID: "",
      chargebackID: "",
      status: "",
      riskScore: 0,
      reason: "",
      isBlocking: false,
      resolution: "",
    };
  }, [isEditMode, initialFraudCase]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(fraudCaseSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialFraudCase && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialFraudCase, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialFraudCase && opts_tenantID.length > 0) {
      const currenttenantID = (initialFraudCase as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = String(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialFraudCase, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialFraudCase && opts_organizationID.length > 0) {
      const currentorganizationID = (initialFraudCase as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = String(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialFraudCase, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialFraudCase && opts_leaseID.length > 0) {
      const currentleaseID = (initialFraudCase as any)?.leaseID ;
      if (currentleaseID !== undefined && currentleaseID!== null) {
        const leaseIDValue = String(currentleaseID);
        if (opts_leaseID.some(opt => opt.value === String(leaseIDValue))) {
          setValue('leaseID', leaseIDValue);
        }
      }
    }
  }, [opts_leaseID, isEditMode, initialFraudCase, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialFraudCase && opts_leaseRenewalID.length > 0) {
      const currentleaseRenewalID = (initialFraudCase as any)?.leaseRenewalID ;
      if (currentleaseRenewalID !== undefined && currentleaseRenewalID!== null) {
        const leaseRenewalIDValue = String(currentleaseRenewalID);
        if (opts_leaseRenewalID.some(opt => opt.value === String(leaseRenewalIDValue))) {
          setValue('leaseRenewalID', leaseRenewalIDValue);
        }
      }
    }
  }, [opts_leaseRenewalID, isEditMode, initialFraudCase, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialFraudCase && opts_paymentIntentID.length > 0) {
      const currentpaymentIntentID = (initialFraudCase as any)?.paymentIntentID ;
      if (currentpaymentIntentID !== undefined && currentpaymentIntentID!== null) {
        const paymentIntentIDValue = String(currentpaymentIntentID);
        if (opts_paymentIntentID.some(opt => opt.value === String(paymentIntentIDValue))) {
          setValue('paymentIntentID', paymentIntentIDValue);
        }
      }
    }
  }, [opts_paymentIntentID, isEditMode, initialFraudCase, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialFraudCase && opts_paymentID.length > 0) {
      const currentpaymentID = (initialFraudCase as any)?.paymentID ;
      if (currentpaymentID !== undefined && currentpaymentID!== null) {
        const paymentIDValue = String(currentpaymentID);
        if (opts_paymentID.some(opt => opt.value === String(paymentIDValue))) {
          setValue('paymentID', paymentIDValue);
        }
      }
    }
  }, [opts_paymentID, isEditMode, initialFraudCase, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialFraudCase && opts_chargebackID.length > 0) {
      const currentchargebackID = (initialFraudCase as any)?.chargebackID ;
      if (currentchargebackID !== undefined && currentchargebackID!== null) {
        const chargebackIDValue = String(currentchargebackID);
        if (opts_chargebackID.some(opt => opt.value === String(chargebackIDValue))) {
          setValue('chargebackID', chargebackIDValue);
        }
      }
    }
  }, [opts_chargebackID, isEditMode, initialFraudCase, setValue]);

  const onSubmitHandler = async (data: FraudCaseFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} fraudcase...`, 'info');
      const payload: any = {
        fraudCaseID: (isEditMode ? ((initialFraudCase as any)?.fraudCaseID ?? null) : null),
        tenantID: data.tenantID ?? '',
        organizationID: data.organizationID ?? '',
        leaseID: data.leaseID ?? '',
        leaseRenewalID: data.leaseRenewalID ?? '',
        paymentIntentID: data.paymentIntentID ?? '',
        paymentID: data.paymentID ?? '',
        chargebackID: data.chargebackID ?? '',
        status: data.status ?? '',
        riskScore: data.riskScore,
        reason: data.reason ?? '',
        isBlocking: data.isBlocking,
        openedAt : (isEditMode ? ((initialFraudCase as any)?.openedAt ?? null) : null),
        reviewedAt : (isEditMode ? ((initialFraudCase as any)?.reviewedAt ?? null) : null),
        closedAt : (isEditMode ? ((initialFraudCase as any)?.closedAt ?? null) : null),
        resolution: data.resolution ?? '',
        capturedDate : (isEditMode ? ((initialFraudCase as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialFraudCase as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateFraudCase(payload as FraudCase) : await createFraudCase(payload as FraudCase);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`FraudCase "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/fraudcases');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit FraudCase' : 'Create FraudCase'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Tenant " error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Organization " error={errors.organizationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationID')}>
              <option value="">Select Organization</option>
              {opts_organizationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Lease " error={errors.leaseID?.message as string}>
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
          <Field label="Payment Intent " error={errors.paymentIntentID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paymentIntentID')}>
              <option value="">Select Payment Intent</option>
              {opts_paymentIntentID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_paymentIntentID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Payment " error={errors.paymentID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paymentID')}>
              <option value="">Select Payment</option>
              {opts_paymentID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_paymentID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Chargeback " error={errors.chargebackID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('chargebackID')}>
              <option value="">Select Chargeback</option>
              {opts_chargebackID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_chargebackID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Status" error={errors.status?.message as string}>
            <input className="input" placeholder="Select status" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}  />
          </Field>
          <Field label="Risk Score" error={errors.riskScore?.message as string}>
            <input className="input" placeholder="Enter risk score" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('riskScore', { valueAsNumber: true })} />
          </Field>
          <Field label="Reason" error={errors.reason?.message as string}>
            <textarea className="input" placeholder="Enter reason" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('reason')} rows={3} />
          </Field>
          <Field label="Is Blocking" error={errors.isBlocking?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isBlocking')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Resolution" error={errors.resolution?.message as string}>
            <input className="input" placeholder="Enter resolution details" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('resolution')}  />
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

