{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { CreditReportingEnrollment } from '../types/CreditReportingEnrollment';
import { createCreditReportingEnrollment, updateCreditReportingEnrollment } from '../apis/useCreditReportingEnrollment';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const creditReportingEnrollmentSchema = z.object({
  leaseID: z.string().optional(),
  leaseRenewalID: z.string().optional(),
  tenantID: z.string().min(1, "Tenant is required"),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required"),
  providerName: z.string().max(100, "Provider Name must be less than 100 characters").optional(),
  providerReferenceID: z.string().max(255, "Provider Reference ID must be less than 255 characters").optional(),
});

type CreditReportingEnrollmentFormData = z.infer<typeof creditReportingEnrollmentSchema>;

interface CreditReportingEnrollmentFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialCreditReportingEnrollment?: CreditReportingEnrollment | null;
  isEditMode?: boolean;
}

export default function CreditReportingEnrollmentForm({ onAlert, initialCreditReportingEnrollment = null, isEditMode = false }: CreditReportingEnrollmentFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_leaseID, setOpts_leaseID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseID_loading, setOpts_leaseID_loading] = React.useState(false);
  const [opts_leaseRenewalID, setOpts_leaseRenewalID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseRenewalID_loading, setOpts_leaseRenewalID_loading] = React.useState(false);
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

  const getDefaultValues = React.useCallback((): CreditReportingEnrollmentFormData => {
    const src = (initialCreditReportingEnrollment as any) ?? {};
    if (isEditMode && initialCreditReportingEnrollment) {
      return {
        leaseID: (src?.leaseID ?? ""),
        leaseRenewalID: (src?.leaseRenewalID ?? ""),
        tenantID: (src?.tenantID ?? ""),
        status: (src?.status ?? ""),
        providerName: (src?.providerName ?? ""),
        providerReferenceID: (src?.providerReferenceID ?? ""),
      };
    }
    return {
      leaseID: "",
      leaseRenewalID: "",
      tenantID: "",
      status: "",
      providerName: "",
      providerReferenceID: "",
    };
  }, [isEditMode, initialCreditReportingEnrollment]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(creditReportingEnrollmentSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialCreditReportingEnrollment && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialCreditReportingEnrollment, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialCreditReportingEnrollment && opts_leaseID.length > 0) {
      const currentleaseID = (initialCreditReportingEnrollment as any)?.leaseID ;
      if (currentleaseID !== undefined && currentleaseID!== null) {
        const leaseIDValue = String(currentleaseID);
        if (opts_leaseID.some(opt => opt.value === String(leaseIDValue))) {
          setValue('leaseID', leaseIDValue);
        }
      }
    }
  }, [opts_leaseID, isEditMode, initialCreditReportingEnrollment, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialCreditReportingEnrollment && opts_leaseRenewalID.length > 0) {
      const currentleaseRenewalID = (initialCreditReportingEnrollment as any)?.leaseRenewalID ;
      if (currentleaseRenewalID !== undefined && currentleaseRenewalID!== null) {
        const leaseRenewalIDValue = String(currentleaseRenewalID);
        if (opts_leaseRenewalID.some(opt => opt.value === String(leaseRenewalIDValue))) {
          setValue('leaseRenewalID', leaseRenewalIDValue);
        }
      }
    }
  }, [opts_leaseRenewalID, isEditMode, initialCreditReportingEnrollment, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialCreditReportingEnrollment && opts_tenantID.length > 0) {
      const currenttenantID = (initialCreditReportingEnrollment as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = String(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialCreditReportingEnrollment, setValue]);

  const onSubmitHandler = async (data: CreditReportingEnrollmentFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} creditreportingenrollment...`, 'info');
      const payload: any = {
        creditReportingEnrollmentID: (isEditMode ? ((initialCreditReportingEnrollment as any)?.creditReportingEnrollmentID ?? null) : null),
        leaseID: data.leaseID ?? '',
        leaseRenewalID: data.leaseRenewalID ?? '',
        tenantID: data.tenantID ?? '',
        status: data.status ?? '',
        consentedAt : (isEditMode ? ((initialCreditReportingEnrollment as any)?.consentedAt ?? null) : null),
        cancelledAt : (isEditMode ? ((initialCreditReportingEnrollment as any)?.cancelledAt ?? null) : null),
        providerName: data.providerName ?? '',
        providerReferenceID: data.providerReferenceID ?? '',
        capturedDate : (isEditMode ? ((initialCreditReportingEnrollment as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialCreditReportingEnrollment as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialCreditReportingEnrollment as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialCreditReportingEnrollment as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateCreditReportingEnrollment(payload as CreditReportingEnrollment) : await createCreditReportingEnrollment(payload as CreditReportingEnrollment);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`CreditReportingEnrollment "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/creditreportingenrollments');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit CreditReportingEnrollment' : 'Create CreditReportingEnrollment'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
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
          <Field label="Tenant *" error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Status" error={errors.status?.message as string}>
            <input className="input" placeholder="Select status" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}  />
          </Field>
          <Field label="Provider Name" error={errors.providerName?.message as string}>
            <input className="input" placeholder="Enter provider name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('providerName')}  />
          </Field>
          <Field label="Provider Reference ID" error={errors.providerReferenceID?.message as string}>
            <textarea className="input" placeholder="Enter provider reference ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerReferenceID')} rows={3} />
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

