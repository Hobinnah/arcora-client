{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { CreditReportingConsentAudit } from '../types/CreditReportingConsentAudit';
import { createCreditReportingConsentAudit, updateCreditReportingConsentAudit } from '../apis/useCreditReportingConsentAudit';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const creditReportingConsentAuditSchema = z.object({
  creditReportingEnrollmentID: z.string().max(256, "Credit Reporting Enrollment must be less than 256 characters").min(1, "Credit Reporting Enrollment is required"),
  tenantID: z.boolean(),
  action: z.string().max(50, "Action must be less than 50 characters").min(1, "Action is required"),
  consentVersion: z.string().max(50, "Consent Version must be less than 50 characters").optional(),
  consentTextHash: z.string().max(255, "Consent Text Hash must be less than 255 characters").optional(),
  providerReferenceID: z.string().max(255, "Provider Reference ID must be less than 255 characters").optional(),
  metadata: z.string().max(256, "Metadata must be less than 256 characters").optional(),
});

type CreditReportingConsentAuditFormData = z.infer<typeof creditReportingConsentAuditSchema>;

interface CreditReportingConsentAuditFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialCreditReportingConsentAudit?: CreditReportingConsentAudit | null;
  isEditMode?: boolean;
}

export default function CreditReportingConsentAuditForm({ onAlert, initialCreditReportingConsentAudit = null, isEditMode = false }: CreditReportingConsentAuditFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_creditReportingEnrollmentID, setOpts_creditReportingEnrollmentID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_creditReportingEnrollmentID_loading, setOpts_creditReportingEnrollmentID_loading] = React.useState(false);
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

  async function loadOptions_creditReportingEnrollmentID(){
    try { setOpts_creditReportingEnrollmentID_loading(true);
      const url = "api/creditreportingenrollment/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'creditReportingEnrollmentID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["providerName", "name", "creditReportingEnrollmentName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["creditReportingEnrollmentID", "creditReportingEnrollmentID", "id", "ID", "creditReportingEnrollmentID", "creditReportingEnrollmentId"], String(it))
      }));
      setOpts_creditReportingEnrollmentID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_creditReportingEnrollmentID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_creditReportingEnrollmentID(); }, []);

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

  const getDefaultValues = React.useCallback((): CreditReportingConsentAuditFormData => {
    const src = (initialCreditReportingConsentAudit as any) ?? {};
    if (isEditMode && initialCreditReportingConsentAudit) {
      return {
        creditReportingEnrollmentID: (src?.creditReportingEnrollmentID ?? ""),
        tenantID: Boolean(src?.tenantID),
        action: (src?.action ?? ""),
        consentVersion: (src?.consentVersion ?? ""),
        consentTextHash: (src?.consentTextHash ?? ""),
        providerReferenceID: (src?.providerReferenceID ?? ""),
        metadata: (src?.metadata ?? ""),
      };
    }
    return {
      creditReportingEnrollmentID: "",
      tenantID: false,
      action: "",
      consentVersion: "",
      consentTextHash: "",
      providerReferenceID: "",
      metadata: "",
    };
  }, [isEditMode, initialCreditReportingConsentAudit]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(creditReportingConsentAuditSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialCreditReportingConsentAudit && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialCreditReportingConsentAudit, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialCreditReportingConsentAudit && opts_creditReportingEnrollmentID.length > 0) {
      const currentcreditReportingEnrollmentID = (initialCreditReportingConsentAudit as any)?.creditReportingEnrollmentID ;
      if (currentcreditReportingEnrollmentID !== undefined && currentcreditReportingEnrollmentID!== null) {
        const creditReportingEnrollmentIDValue = Number(currentcreditReportingEnrollmentID);
        if (opts_creditReportingEnrollmentID.some(opt => opt.value === String(creditReportingEnrollmentIDValue))) {
          setValue('creditReportingEnrollmentID', creditReportingEnrollmentIDValue);
        }
      }
    }
  }, [opts_creditReportingEnrollmentID, isEditMode, initialCreditReportingConsentAudit, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialCreditReportingConsentAudit && opts_tenantID.length > 0) {
      const currenttenantID = (initialCreditReportingConsentAudit as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = Number(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialCreditReportingConsentAudit, setValue]);

  const onSubmitHandler = async (data: CreditReportingConsentAuditFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} creditreportingconsentaudit...`, 'info');
      const payload: any = {
        consentAuditID: (isEditMode ? ((initialCreditReportingConsentAudit as any)?.consentAuditID ?? null) : null),
        creditReportingEnrollmentID: data.creditReportingEnrollmentID ?? '',
        tenantID: data.tenantID,
        action: data.action ?? '',
        consentVersion: data.consentVersion ?? '',
        consentTextHash: data.consentTextHash ?? '',
        providerReferenceID: data.providerReferenceID ?? '',
        actionAt : (isEditMode ? ((initialCreditReportingConsentAudit as any)?.actionAt ?? null) : null),
        metadata: data.metadata ?? '',
        capturedDate : (isEditMode ? ((initialCreditReportingConsentAudit as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialCreditReportingConsentAudit as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateCreditReportingConsentAudit(payload as CreditReportingConsentAudit) : await createCreditReportingConsentAudit(payload as CreditReportingConsentAudit);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`CreditReportingConsentAudit "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/creditreportingconsentaudits');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit CreditReportingConsentAudit' : 'Create CreditReportingConsentAudit'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Credit Reporting Enrollment *" error={errors.creditReportingEnrollmentID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('creditReportingEnrollmentID')}>
              <option value="">Select Credit Reporting Enrollment</option>
              {opts_creditReportingEnrollmentID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_creditReportingEnrollmentID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Tenant *" error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Action" error={errors.action?.message as string}>
            <input className="input" placeholder="Enter action" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('action')}  />
          </Field>
          <Field label="Consent Version" error={errors.consentVersion?.message as string}>
            <input className="input" placeholder="Enter consent version" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('consentVersion')}  />
          </Field>
          <Field label="Consent Text Hash" error={errors.consentTextHash?.message as string}>
            <textarea className="input" placeholder="Enter consent text hash" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('consentTextHash')} rows={3} />
          </Field>
          <Field label="Provider Reference ID" error={errors.providerReferenceID?.message as string}>
            <textarea className="input" placeholder="Enter provider reference ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerReferenceID')} rows={3} />
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

