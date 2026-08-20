{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { Chargeback } from '../types/Chargeback';
import { createChargeback, updateChargeback } from '../apis/useChargeback';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const chargebackSchema = z.object({
  paymentID: z.string().min(1, "Payment is required"),
  tenantID: z.string().optional(),
  organizationID: z.string().optional(),
  providerDisputeID: z.string().max(255, "Provider Dispute ID must be less than 255 characters").min(1, "Provider Dispute ID is required"),
  amount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Amount is required")),
  currency: z.string().max(3, "Currency must be less than 3 characters").min(1, "Currency is required"),
  reasonCode: z.string().max(100, "Reason Code must be less than 100 characters").optional(),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["OPEN", "CLOSED", "RESOLVED"].includes(v as any), "Invalid Status"),
  openedAt: z.string(),
  evidenceDueAt: z.string().optional(),
  evidenceSubmittedAt: z.string().optional(),
  resolvedAt: z.string().optional(),
  outcome: z.string().max(50, "Outcome must be less than 50 characters").optional(),
  providerResponse: z.string().max(256, "Provider Response must be less than 256 characters").optional(),
});

type ChargebackFormData = z.infer<typeof chargebackSchema>;

interface ChargebackFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialChargeback?: Chargeback | null;
  isEditMode?: boolean;
}

export default function ChargebackForm({ onAlert, initialChargeback = null, isEditMode = false }: ChargebackFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_paymentID, setOpts_paymentID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_paymentID_loading, setOpts_paymentID_loading] = React.useState(false);
  const [opts_tenantID, setOpts_tenantID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_tenantID_loading, setOpts_tenantID_loading] = React.useState(false);
  const [opts_organizationID, setOpts_organizationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_organizationID_loading, setOpts_organizationID_loading] = React.useState(false);

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
        label: firstNonEmpty(it, ["providerChargeID", "name", "paymentName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_organizationID(){
    try { setOpts_organizationID_loading(true);
      const url = "api/organization/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'organizationID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["organizationName", "name", "organizationName", "title", "fullName", "email", "description"], String(it)),
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

  const getDefaultValues = React.useCallback((): ChargebackFormData => {
    const src = (initialChargeback as any) ?? {};
    if (isEditMode && initialChargeback) {
      return {
        paymentID: (src?.paymentID ?? ""),
        tenantID: (src?.tenantID ?? ""),
        organizationID: (src?.organizationID ?? ""),
        providerDisputeID: (src?.providerDisputeID ?? ""),
        amount: (src?.amount ?? 0),
        currency: (src?.currency ?? ""),
        reasonCode: (src?.reasonCode ?? ""),
        status: (src?.status ?? ""),
        openedAt: src?.openedAt ? new Date(src?.openedAt as any).toISOString().split('T')[0] : "",
        evidenceDueAt: src?.evidenceDueAt ? new Date(src?.evidenceDueAt as any).toISOString().split('T')[0] : "",
        evidenceSubmittedAt: src?.evidenceSubmittedAt ? new Date(src?.evidenceSubmittedAt as any).toISOString().split('T')[0] : "",
        resolvedAt: src?.resolvedAt ? new Date(src?.resolvedAt as any).toISOString().split('T')[0] : "",
        outcome: (src?.outcome ?? ""),
        providerResponse: (src?.providerResponse ?? ""),
      };
    }
    return {
      paymentID: "",
      tenantID: "",
      organizationID: "",
      providerDisputeID: "",
      amount: 0,
      currency: "",
      reasonCode: "",
      status: "OPEN",
      openedAt: "",
      evidenceDueAt: "",
      evidenceSubmittedAt: "",
      resolvedAt: "",
      outcome: "",
      providerResponse: "",
    };
  }, [isEditMode, initialChargeback]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(chargebackSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialChargeback && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialChargeback, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialChargeback && opts_paymentID.length > 0) {
      const currentpaymentID = (initialChargeback as any)?.paymentID ;
      if (currentpaymentID !== undefined && currentpaymentID!== null) {
        const paymentIDValue = Number(currentpaymentID);
        if (opts_paymentID.some(opt => opt.value === String(paymentIDValue))) {
          setValue('paymentID', paymentIDValue);
        }
      }
    }
  }, [opts_paymentID, isEditMode, initialChargeback, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialChargeback && opts_tenantID.length > 0) {
      const currenttenantID = (initialChargeback as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = Number(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialChargeback, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialChargeback && opts_organizationID.length > 0) {
      const currentorganizationID = (initialChargeback as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = Number(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialChargeback, setValue]);

  const onSubmitHandler = async (data: ChargebackFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} chargeback...`, 'info');
      const payload: any = {
        chargebackID: (isEditMode ? ((initialChargeback as any)?.chargebackID ?? null) : null),
        paymentID: data.paymentID ?? '',
        tenantID: data.tenantID ?? '',
        organizationID: data.organizationID ?? '',
        providerDisputeID: data.providerDisputeID ?? '',
        amount: data.amount,
        currency: data.currency ?? '',
        reasonCode: data.reasonCode ?? '',
        status: data.status ?? '',
        openedAt: data.openedAt || null,
        evidenceDueAt: data.evidenceDueAt || null,
        evidenceSubmittedAt: data.evidenceSubmittedAt || null,
        resolvedAt: data.resolvedAt || null,
        outcome: data.outcome ?? '',
        providerResponse: data.providerResponse ?? '',
        capturedDate : (isEditMode ? ((initialChargeback as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialChargeback as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateChargeback(payload as Chargeback) : await createChargeback(payload as Chargeback);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`Chargeback "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/chargebacks');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit Chargeback' : 'Create Chargeback'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Payment *" error={errors.paymentID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paymentID')}>
              <option value="">Select Payment</option>
              {opts_paymentID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_paymentID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
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
          <Field label="Provider Dispute ID" error={errors.providerDisputeID?.message as string}>
            <textarea className="input" placeholder="Enter provider dispute ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerDisputeID')} rows={3} />
          </Field>
          <Field label="Amount" error={errors.amount?.message as string}>
            <input className="input" placeholder="Enter amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('amount', { valueAsNumber: true })} />
          </Field>
          <Field label="Currency" error={errors.currency?.message as string}>
            <input className="input" placeholder="Enter currency code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}  />
          </Field>
          <Field label="Reason Code" error={errors.reasonCode?.message as string}>
            <input className="input" placeholder="Enter reason code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('reasonCode')}  />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </Field>
          <Field label="Opened At" error={errors.openedAt?.message as string}>
            <input className="input" placeholder="Select opened date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('openedAt')} />
          </Field>
          <Field label="Evidence Due At" error={errors.evidenceDueAt?.message as string}>
            <input className="input" placeholder="Select evidence due date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('evidenceDueAt')} />
          </Field>
          <Field label="Evidence Submitted At" error={errors.evidenceSubmittedAt?.message as string}>
            <input className="input" placeholder="Select evidence submission date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('evidenceSubmittedAt')} />
          </Field>
          <Field label="Resolved At" error={errors.resolvedAt?.message as string}>
            <input className="input" placeholder="Select resolution date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('resolvedAt')} />
          </Field>
          <Field label="Outcome" error={errors.outcome?.message as string}>
            <input className="input" placeholder="Enter outcome" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('outcome')}  />
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

