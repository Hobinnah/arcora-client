{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { AutopayConsentAudit } from '../types/AutopayConsentAudit';
import { createAutopayConsentAudit, updateAutopayConsentAudit } from '../apis/useAutopayConsentAudit';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const autopayConsentAuditSchema = z.object({
  autopayMandateID: z.string().min(1, "Autopay Mandate is required"),
  tenantID: z.string().min(1, "Tenant is required"),
  action: z.string().max(50, "Action must be less than 50 characters").min(1, "Action is required").refine(v => (v ?? '') === '' || ["CONSENTED", "REVOKED", "UPDATED"].includes(v as any), "Invalid Action"),
  consentVersion: z.string().max(50, "Consent Version must be less than 50 characters").optional(),
  consentTextHash: z.string().max(255, "Consent Text Hash must be less than 255 characters").optional(),
  ipAddress: z.string().max(100, "IP Address must be less than 100 characters").optional(),
  userAgent: z.string().max(500, "User Agent must be less than 500 characters").optional(),
  providerReferenceID: z.string().max(255, "Provider Reference ID must be less than 255 characters").optional(),
  actionAt: z.string(),
  metadata: z.string().max(256, "Metadata must be less than 256 characters").optional(),
});

type AutopayConsentAuditFormData = z.infer<typeof autopayConsentAuditSchema>;

interface AutopayConsentAuditFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialAutopayConsentAudit?: AutopayConsentAudit | null;
  isEditMode?: boolean;
}

export default function AutopayConsentAuditForm({ onAlert, initialAutopayConsentAudit = null, isEditMode = false }: AutopayConsentAuditFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_autopayMandateID, setOpts_autopayMandateID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_autopayMandateID_loading, setOpts_autopayMandateID_loading] = React.useState(false);
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

  async function loadOptions_autopayMandateID(){
    try { setOpts_autopayMandateID_loading(true);
      const url = "api/autopaymandate/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'autopayMandateID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["providerReferenceID", "name", "autopayMandateName", "title", "fullName", "email", "description"], String(it)),
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

  const getDefaultValues = React.useCallback((): AutopayConsentAuditFormData => {
    const src = (initialAutopayConsentAudit as any) ?? {};
    if (isEditMode && initialAutopayConsentAudit) {
      return {
        autopayMandateID: (src?.autopayMandateID ?? ""),
        tenantID: (src?.tenantID ?? ""),
        action: (src?.action ?? ""),
        consentVersion: (src?.consentVersion ?? ""),
        consentTextHash: (src?.consentTextHash ?? ""),
        ipAddress: (src?.ipAddress ?? ""),
        userAgent: (src?.userAgent ?? ""),
        providerReferenceID: (src?.providerReferenceID ?? ""),
        actionAt: src?.actionAt ? new Date(src?.actionAt as any).toISOString().split('T')[0] : "",
        metadata: (src?.metadata ?? ""),
      };
    }
    return {
      autopayMandateID: "",
      tenantID: "",
      action: "",
      consentVersion: "",
      consentTextHash: "",
      ipAddress: "",
      userAgent: "",
      providerReferenceID: "",
      actionAt: "",
      metadata: "",
    };
  }, [isEditMode, initialAutopayConsentAudit]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(autopayConsentAuditSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialAutopayConsentAudit && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialAutopayConsentAudit, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialAutopayConsentAudit && opts_autopayMandateID.length > 0) {
      const currentautopayMandateID = (initialAutopayConsentAudit as any)?.autopayMandateID ;
      if (currentautopayMandateID !== undefined && currentautopayMandateID!== null) {
        const autopayMandateIDValue = String(currentautopayMandateID);
        if (opts_autopayMandateID.some(opt => opt.value === String(autopayMandateIDValue))) {
          setValue('autopayMandateID', autopayMandateIDValue);
        }
      }
    }
  }, [opts_autopayMandateID, isEditMode, initialAutopayConsentAudit, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialAutopayConsentAudit && opts_tenantID.length > 0) {
      const currenttenantID = (initialAutopayConsentAudit as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = String(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialAutopayConsentAudit, setValue]);

  const onSubmitHandler = async (data: AutopayConsentAuditFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} autopayconsentaudit...`, 'info');
      const payload: any = {
        autopayConsentAuditID: (isEditMode ? ((initialAutopayConsentAudit as any)?.autopayConsentAuditID ?? null) : null),
        autopayMandateID: data.autopayMandateID ?? '',
        tenantID: data.tenantID ?? '',
        action: data.action ?? '',
        consentVersion: data.consentVersion ?? '',
        consentTextHash: data.consentTextHash ?? '',
        ipAddress: data.ipAddress ?? '',
        userAgent: data.userAgent ?? '',
        providerReferenceID: data.providerReferenceID ?? '',
        actionAt: data.actionAt || null,
        metadata: data.metadata ?? '',
        capturedBy: (isEditMode ? ((initialAutopayConsentAudit as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        capturedDate : (isEditMode ? ((initialAutopayConsentAudit as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
      };
      let result: any;
      result = isEditMode ? await updateAutopayConsentAudit(payload as AutopayConsentAudit) : await createAutopayConsentAudit(payload as AutopayConsentAudit);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`AutopayConsentAudit "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/autopayconsentaudits');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit AutopayConsentAudit' : 'Create AutopayConsentAudit'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Autopay Mandate *" error={errors.autopayMandateID?.message as string}>
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
          <Field label="Action *" error={errors.action?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('action')}>
              <option value="">Select Action</option>
              <option value="CONSENTED">CONSENTED</option>
              <option value="REVOKED">REVOKED</option>
              <option value="UPDATED">UPDATED</option>
            </select>
          </Field>
          <Field label="Consent Version" error={errors.consentVersion?.message as string}>
            <input className="input" placeholder="Enter consent version" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('consentVersion')}  />
          </Field>
          <Field label="Consent Text Hash" error={errors.consentTextHash?.message as string}>
            <textarea className="input" placeholder="Enter consent text hash" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('consentTextHash')} rows={3} />
          </Field>
          <Field label="IP Address" error={errors.ipAddress?.message as string}>
            <input className="input" placeholder="Enter IP address" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('ipAddress')}  />
          </Field>
          <Field label="User Agent" error={errors.userAgent?.message as string}>
            <textarea className="input" placeholder="Enter user agent" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('userAgent')} rows={3} />
          </Field>
          <Field label="Provider Reference ID" error={errors.providerReferenceID?.message as string}>
            <textarea className="input" placeholder="Enter provider reference ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerReferenceID')} rows={3} />
          </Field>
          <Field label="Action At" error={errors.actionAt?.message as string}>
            <input className="input" placeholder="Select action date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('actionAt')} />
          </Field>
          <Field label="Metadata" error={errors.metadata?.message as string}>
            <textarea className="input" placeholder="Enter metadata" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('metadata')} rows={3} />
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

