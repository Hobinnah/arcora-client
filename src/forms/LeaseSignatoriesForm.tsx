{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { LeaseSignatories } from '../types/LeaseSignatories';
import { createLeaseSignatories, updateLeaseSignatories } from '../apis/useLeaseSignatories';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const leaseSignatoriesSchema = z.object({
  leaseDocumentID: z.string().min(1, "Lease Document is required"),
  userID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  tenantID: z.string().optional(),
  organizationMemberID: z.string().optional(),
  signatoryRole: z.string().max(50, "Signatory Role must be less than 50 characters").min(1, "Signatory Role is required"),
  name: z.string().max(100, "Name must be less than 100 characters").min(1, "Name is required"),
  email: z.string().max(255, "Email must be less than 255 characters").optional(),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["PENDING", "SIGNED", "DECLINED"].includes(v as any), "Invalid Status"),
  signatureOrder: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  providerSignerID: z.string().max(255, "Provider Signer ID must be less than 255 characters").optional(),
  viewedAt: z.string().optional(),
  signedAt: z.string().optional(),
  declinedAt: z.string().optional(),
});

type LeaseSignatoriesFormData = z.infer<typeof leaseSignatoriesSchema>;

interface LeaseSignatoriesFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialLeaseSignatories?: LeaseSignatories | null;
  isEditMode?: boolean;
}

export default function LeaseSignatoriesForm({ onAlert, initialLeaseSignatories = null, isEditMode = false }: LeaseSignatoriesFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_leaseDocumentID, setOpts_leaseDocumentID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseDocumentID_loading, setOpts_leaseDocumentID_loading] = React.useState(false);
  const [opts_userID, setOpts_userID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_userID_loading, setOpts_userID_loading] = React.useState(false);
  const [opts_tenantID, setOpts_tenantID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_tenantID_loading, setOpts_tenantID_loading] = React.useState(false);
  const [opts_organizationMemberID, setOpts_organizationMemberID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_organizationMemberID_loading, setOpts_organizationMemberID_loading] = React.useState(false);

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

  async function loadOptions_leaseDocumentID(){
    try { setOpts_leaseDocumentID_loading(true);
      const url = "api/leasedocument/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'leaseDocumentID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "leaseDocumentName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["leaseDocumentID", "leaseDocumentID", "id", "ID", "leaseDocumentID", "leaseDocumentId"], String(it))
      }));
      setOpts_leaseDocumentID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_leaseDocumentID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_leaseDocumentID(); }, []);

  async function loadOptions_userID(){
    try { setOpts_userID_loading(true);
      const url = "api/account/getUsers" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'userID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["displayName", "name", "userName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["id", "id", "id", "ID", "userID", "userId"], String(it))
      }));
      setOpts_userID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_userID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_userID(); }, []);

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

  async function loadOptions_organizationMemberID(){
    try { setOpts_organizationMemberID_loading(true);
      const url = "api/organizationmember/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'organizationMemberID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "organizationMemberName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["organizationMemberID", "organizationMemberID", "id", "ID", "organizationMemberID", "organizationMemberId"], String(it))
      }));
      setOpts_organizationMemberID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_organizationMemberID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_organizationMemberID(); }, []);

  const getDefaultValues = React.useCallback((): LeaseSignatoriesFormData => {
    const src = (initialLeaseSignatories as any) ?? {};
    if (isEditMode && initialLeaseSignatories) {
      return {
        leaseDocumentID: (src?.leaseDocumentID ?? ""),
        userID: (() => {
          if (src?.userID !== undefined && src?.userID !== null) {
            return Number(src.userID);
          }
          return 0;
        })(),
        tenantID: (src?.tenantID ?? ""),
        organizationMemberID: (src?.organizationMemberID ?? ""),
        signatoryRole: (src?.signatoryRole ?? ""),
        name: (src?.name ?? ""),
        email: (src?.email ?? ""),
        status: (src?.status ?? ""),
        signatureOrder: (src?.signatureOrder ?? 0),
        providerSignerID: (src?.providerSignerID ?? ""),
        viewedAt: src?.viewedAt ? new Date(src?.viewedAt as any).toISOString().split('T')[0] : "",
        signedAt: src?.signedAt ? new Date(src?.signedAt as any).toISOString().split('T')[0] : "",
        declinedAt: src?.declinedAt ? new Date(src?.declinedAt as any).toISOString().split('T')[0] : "",
      };
    }
    return {
      leaseDocumentID: "",
      userID: 0,
      tenantID: "",
      organizationMemberID: "",
      signatoryRole: "",
      name: "",
      email: "",
      status: "PENDING",
      signatureOrder: 0,
      providerSignerID: "",
      viewedAt: "",
      signedAt: "",
      declinedAt: "",
    };
  }, [isEditMode, initialLeaseSignatories]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(leaseSignatoriesSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialLeaseSignatories && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialLeaseSignatories, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLeaseSignatories && opts_leaseDocumentID.length > 0) {
      const currentleaseDocumentID = (initialLeaseSignatories as any)?.leaseDocumentID ;
      if (currentleaseDocumentID !== undefined && currentleaseDocumentID!== null) {
        const leaseDocumentIDValue = String(currentleaseDocumentID);
        if (opts_leaseDocumentID.some(opt => opt.value === String(leaseDocumentIDValue))) {
          setValue('leaseDocumentID', leaseDocumentIDValue);
        }
      }
    }
  }, [opts_leaseDocumentID, isEditMode, initialLeaseSignatories, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLeaseSignatories && opts_userID.length > 0) {
      const currentuserID = (initialLeaseSignatories as any)?.userID ;
      if (currentuserID !== undefined && currentuserID!== null) {
        const userIDValue = String(currentuserID);
        if (opts_userID.some(opt => opt.value === String(userIDValue))) {
          setValue('userID', userIDValue);
        }
      }
    }
  }, [opts_userID, isEditMode, initialLeaseSignatories, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLeaseSignatories && opts_tenantID.length > 0) {
      const currenttenantID = (initialLeaseSignatories as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = String(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialLeaseSignatories, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLeaseSignatories && opts_organizationMemberID.length > 0) {
      const currentorganizationMemberID = (initialLeaseSignatories as any)?.organizationMemberID ;
      if (currentorganizationMemberID !== undefined && currentorganizationMemberID!== null) {
        const organizationMemberIDValue = String(currentorganizationMemberID);
        if (opts_organizationMemberID.some(opt => opt.value === String(organizationMemberIDValue))) {
          setValue('organizationMemberID', organizationMemberIDValue);
        }
      }
    }
  }, [opts_organizationMemberID, isEditMode, initialLeaseSignatories, setValue]);

  const onSubmitHandler = async (data: LeaseSignatoriesFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} leasesignatories...`, 'info');
      const payload: any = {
        leaseSignatoryID: (isEditMode ? ((initialLeaseSignatories as any)?.leaseSignatoryID ?? null) : null),
        leaseDocumentID: data.leaseDocumentID ?? '',
        userID: (data.userID === 0 || data.userID === undefined || data.userID === null) ? 0 : Number(data.userID),
        tenantID: data.tenantID ?? '',
        organizationMemberID: data.organizationMemberID ?? '',
        signatoryRole: data.signatoryRole ?? '',
        name: data.name ?? '',
        email: data.email ?? '',
        status: data.status ?? '',
        signatureOrder: data.signatureOrder,
        providerSignerID: data.providerSignerID ?? '',
        viewedAt: data.viewedAt || null,
        signedAt: data.signedAt || null,
        declinedAt: data.declinedAt || null,
        capturedDate : (isEditMode ? ((initialLeaseSignatories as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialLeaseSignatories as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateLeaseSignatories(payload as LeaseSignatories) : await createLeaseSignatories(payload as LeaseSignatories);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`LeaseSignatories "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/leasesignatories');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit LeaseSignatories' : 'Create LeaseSignatories'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Lease Document *" error={errors.leaseDocumentID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('leaseDocumentID')}>
              <option value="">Select Lease Document</option>
              {opts_leaseDocumentID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_leaseDocumentID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="User " error={errors.userID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('userID')}>
              <option value="">Select User</option>
              {opts_userID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_userID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Tenant " error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Organization Member " error={errors.organizationMemberID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationMemberID')}>
              <option value="">Select Organization Member</option>
              {opts_organizationMemberID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationMemberID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Signatory Role" error={errors.signatoryRole?.message as string}>
            <input className="input" placeholder="Enter signatory role" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('signatoryRole')}  />
          </Field>
          <Field label="Name" error={errors.name?.message as string}>
            <input className="input" placeholder="Enter name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('name')}  />
          </Field>
          <Field label="Email" error={errors.email?.message as string}>
            <textarea className="input" placeholder="Enter email" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('email')} rows={3} />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="PENDING">PENDING</option>
              <option value="SIGNED">SIGNED</option>
              <option value="DECLINED">DECLINED</option>
            </select>
          </Field>
          <Field label="Signature Order" error={errors.signatureOrder?.message as string}>
            <input className="input" placeholder="Enter signature order" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('signatureOrder', { valueAsNumber: true })} />
          </Field>
          <Field label="Provider Signer ID" error={errors.providerSignerID?.message as string}>
            <textarea className="input" placeholder="Enter provider signer ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerSignerID')} rows={3} />
          </Field>
          <Field label="Viewed At" error={errors.viewedAt?.message as string}>
            <input className="input" placeholder="Select viewed date/time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('viewedAt')} />
          </Field>
          <Field label="Signed At" error={errors.signedAt?.message as string}>
            <input className="input" placeholder="Select signed date/time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('signedAt')} />
          </Field>
          <Field label="Declined At" error={errors.declinedAt?.message as string}>
            <input className="input" placeholder="Select declined date/time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('declinedAt')} />
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

