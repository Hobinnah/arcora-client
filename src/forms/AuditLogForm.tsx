{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { AuditLog } from '../types/AuditLog';
import { createAuditLog, updateAuditLog } from '../apis/useAuditLog';
import { fetchData } from '../apis/useApi';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const auditLogSchema = z.object({
  actorUserID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  tenantID: z.string().optional(),
  organizationMemberID: z.string().optional(),
  organizationID: z.string().optional(),
  actorType: z.string().max(50, "Actor Type must be less than 50 characters").optional(),
  action: z.string().max(255, "Action must be less than 255 characters").min(1, "Action is required"),
  entityType: z.string().max(100, "Entity Type must be less than 100 characters").min(1, "Entity Type is required"),
  entityID: z.string().max(100, "Entity ID must be less than 100 characters").min(1, "Entity ID is required"),
  oldValues: z.string().max(256, "Old Values must be less than 256 characters").optional(),
  newValues: z.string().max(256, "New Values must be less than 256 characters").optional(),
  ipAddress: z.string().max(100, "IP Address must be less than 100 characters").optional(),
  userAgent: z.string().max(500, "User Agent must be less than 500 characters").optional(),
  correlationID: z.string().max(100, "Correlation ID must be less than 100 characters").optional(),
  note: z.string().max(256, "Note must be less than 256 characters").optional(),
});

type AuditLogFormData = z.infer<typeof auditLogSchema>;

interface AuditLogFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialAuditLog?: AuditLog | null;
  isEditMode?: boolean;
}

export default function AuditLogForm({ onAlert, initialAuditLog = null, isEditMode = false }: AuditLogFormProps) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_actorUserID, setOpts_actorUserID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_actorUserID_loading, setOpts_actorUserID_loading] = React.useState(false);
  const [opts_tenantID, setOpts_tenantID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_tenantID_loading, setOpts_tenantID_loading] = React.useState(false);
  const [opts_organizationMemberID, setOpts_organizationMemberID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_organizationMemberID_loading, setOpts_organizationMemberID_loading] = React.useState(false);
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

  async function loadOptions_actorUserID(){
    try { setOpts_actorUserID_loading(true);
      const url = "api/account/getUsers" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'actorUserID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["displayName", "name", "actorUserName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["id", "id", "id", "ID", "actorUserID", "actorUserId"], String(it))
      }));
      setOpts_actorUserID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_actorUserID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_actorUserID(); }, []);

  async function loadOptions_tenantID(){
    try { setOpts_tenantID_loading(true);
      const url = "api/tenant/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'tenantID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["", "name", "tenantName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["", "tenantID", "id", "ID", "tenantID", "tenantId"], String(it))
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
        label: firstNonEmpty(it, ["", "name", "organizationMemberName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["", "organizationMemberID", "id", "ID", "organizationMemberID", "organizationMemberId"], String(it))
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

  async function loadOptions_organizationID(){
    try { setOpts_organizationID_loading(true);
      const url = "api/organization/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'organizationID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["", "name", "organizationName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["", "organizationID", "id", "ID", "organizationID", "organizationId"], String(it))
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

  const getDefaultValues = React.useCallback((): AuditLogFormData => {
    const src = (initialAuditLog as any) ?? {};
    if (isEditMode && initialAuditLog) {
      return {
        actorUserID: (() => {
          if (src?.actorUserID !== undefined && src?.actorUserID !== null) {
            return Number(src.actorUserID);
          }
          return 0;
        })(),
        tenantID: (src?.tenantID ?? ""),
        organizationMemberID: (src?.organizationMemberID ?? ""),
        organizationID: (src?.organizationID ?? ""),
        actorType: (src?.actorType ?? ""),
        action: (src?.action ?? ""),
        entityType: (src?.entityType ?? ""),
        entityID: (src?.entityID ?? ""),
        oldValues: (src?.oldValues ?? ""),
        newValues: (src?.newValues ?? ""),
        ipAddress: (src?.ipAddress ?? ""),
        userAgent: (src?.userAgent ?? ""),
        correlationID: (src?.correlationID ?? ""),
        note: (src?.note ?? ""),
      };
    }
    return {
      actorUserID: 0,
      tenantID: "",
      organizationMemberID: "",
      organizationID: "",
      actorType: "",
      action: "",
      entityType: "",
      entityID: "",
      oldValues: "",
      newValues: "",
      ipAddress: "",
      userAgent: "",
      correlationID: "",
      note: "",
    };
  }, [isEditMode, initialAuditLog]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(auditLogSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialAuditLog && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialAuditLog, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialAuditLog && opts_actorUserID.length > 0) {
      const currentactorUserID = (initialAuditLog as any)?.actorUserID ;
      if (currentactorUserID !== undefined && currentactorUserID!== null) {
        const actorUserIDValue = String(currentactorUserID);
        if (opts_actorUserID.some(opt => opt.value === String(actorUserIDValue))) {
          setValue('actorUserID', actorUserIDValue);
        }
      }
    }
  }, [opts_actorUserID, isEditMode, initialAuditLog, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialAuditLog && opts_tenantID.length > 0) {
      const currenttenantID = (initialAuditLog as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = String(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialAuditLog, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialAuditLog && opts_organizationMemberID.length > 0) {
      const currentorganizationMemberID = (initialAuditLog as any)?.organizationMemberID ;
      if (currentorganizationMemberID !== undefined && currentorganizationMemberID!== null) {
        const organizationMemberIDValue = String(currentorganizationMemberID);
        if (opts_organizationMemberID.some(opt => opt.value === String(organizationMemberIDValue))) {
          setValue('organizationMemberID', organizationMemberIDValue);
        }
      }
    }
  }, [opts_organizationMemberID, isEditMode, initialAuditLog, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialAuditLog && opts_organizationID.length > 0) {
      const currentorganizationID = (initialAuditLog as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = String(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialAuditLog, setValue]);

  const onSubmitHandler = async (data: AuditLogFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} auditlog...`, 'info');
      const payload: any = {
        auditLogID: (isEditMode ? ((initialAuditLog as any)?.auditLogID ?? null) : null),
        actorUserID: (data.actorUserID === 0 || data.actorUserID === undefined || data.actorUserID === null) ? 0 : Number(data.actorUserID),
        tenantID: data.tenantID ?? '',
        organizationMemberID: data.organizationMemberID ?? '',
        organizationID: data.organizationID ?? '',
        actorType: data.actorType ?? '',
        action: data.action ?? '',
        entityType: data.entityType ?? '',
        entityID: data.entityID ?? '',
        oldValues: data.oldValues ?? '',
        newValues: data.newValues ?? '',
        ipAddress: data.ipAddress ?? '',
        userAgent: data.userAgent ?? '',
        correlationID: data.correlationID ?? '',
        note: data.note ?? '',
        capturedDate : (isEditMode ? ((initialAuditLog as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
      };
      let result: any;
      result = isEditMode ? await updateAuditLog(payload as AuditLog) : await createAuditLog(payload as AuditLog);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`AuditLog "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/auditlogs');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit AuditLog' : 'Create AuditLog'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Actor User " error={errors.actorUserID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('actorUserID')}>
              <option value="">Select Actor User</option>
              {opts_actorUserID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_actorUserID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Tenant ID " error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant ID</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Organization Member ID " error={errors.organizationMemberID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationMemberID')}>
              <option value="">Select Organization Member ID</option>
              {opts_organizationMemberID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationMemberID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Organization ID " error={errors.organizationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationID')}>
              <option value="">Select Organization ID</option>
              {opts_organizationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Actor Type" error={errors.actorType?.message as string}>
            <input className="input" placeholder="Enter actor type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('actorType')}  />
          </Field>
          <Field label="Action" error={errors.action?.message as string}>
            <textarea className="input" placeholder="Enter action" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('action')} rows={3} />
          </Field>
          <Field label="Entity Type" error={errors.entityType?.message as string}>
            <input className="input" placeholder="Enter entity type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('entityType')}  />
          </Field>
          <Field label="Entity ID" error={errors.entityID?.message as string}>
            <input className="input" placeholder="Enter entity ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('entityID')}  />
          </Field>
          <Field label="Old Values" error={errors.oldValues?.message as string}>
            <textarea className="input" placeholder="Enter old values" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('oldValues')} rows={3} />
          </Field>
          <Field label="New Values" error={errors.newValues?.message as string}>
            <textarea className="input" placeholder="Enter new values" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('newValues')} rows={3} />
          </Field>
          <Field label="IP Address" error={errors.ipAddress?.message as string}>
            <input className="input" placeholder="Enter IP address" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('ipAddress')}  />
          </Field>
          <Field label="User Agent" error={errors.userAgent?.message as string}>
            <textarea className="input" placeholder="Enter user agent" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('userAgent')} rows={3} />
          </Field>
          <Field label="Correlation ID" error={errors.correlationID?.message as string}>
            <input className="input" placeholder="Enter correlation ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('correlationID')}  />
          </Field>
          <Field label="Note" error={errors.note?.message as string}>
            <textarea className="input" placeholder="Enter notes" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('note')} rows={3} />
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

