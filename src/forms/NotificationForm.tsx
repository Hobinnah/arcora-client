{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { Notification } from '../types/Notification';
import { createNotification, updateNotification } from '../apis/useNotification';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const notificationSchema = z.object({
  recipientUserID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  tenantID: z.string().optional(),
  organizationID: z.string().optional(),
  organizationMemberID: z.string().optional(),
  recipientEmail: z.string().max(255, "Recipient Email must be less than 255 characters").optional(),
  recipientPhoneNumber: z.string().max(50, "Recipient Phone Number must be less than 50 characters").optional(),
  channel: z.string().max(50, "Channel must be less than 50 characters").min(1, "Channel is required"),
  templateCode: z.string().max(100, "Template Code must be less than 100 characters").optional(),
  subject: z.string().max(255, "Subject must be less than 255 characters").optional(),
  body: z.string().max(256, "Body must be less than 256 characters").min(1, "Body is required"),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required"),
  scheduledAt: z.string(),
  sentAt: z.string().optional(),
  deliveredAt: z.string().optional(),
  readAt: z.string().optional(),
  failureReason: z.string().max(256, "Failure Reason must be less than 256 characters").optional(),
  providerMessageID: z.string().max(255, "Provider Message ID must be less than 255 characters").optional(),
  metadata: z.string().max(256, "Metadata must be less than 256 characters").optional(),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

interface NotificationFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialNotification?: Notification | null;
  isEditMode?: boolean;
}

export default function NotificationForm({ onAlert, initialNotification = null, isEditMode = false }: NotificationFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_recipientUserID, setOpts_recipientUserID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_recipientUserID_loading, setOpts_recipientUserID_loading] = React.useState(false);
  const [opts_tenantID, setOpts_tenantID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_tenantID_loading, setOpts_tenantID_loading] = React.useState(false);
  const [opts_organizationID, setOpts_organizationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_organizationID_loading, setOpts_organizationID_loading] = React.useState(false);
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

  async function loadOptions_recipientUserID(){
    try { setOpts_recipientUserID_loading(true);
      const url = "api/account/getUsers" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'recipientUserID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["displayName", "name", "recipientUserName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["id", "id", "id", "ID", "recipientUserID", "recipientUserId"], String(it))
      }));
      setOpts_recipientUserID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_recipientUserID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_recipientUserID(); }, []);

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

  const getDefaultValues = React.useCallback((): NotificationFormData => {
    const src = (initialNotification as any) ?? {};
    if (isEditMode && initialNotification) {
      return {
        recipientUserID: (() => {
          if (src?.recipientUserID !== undefined && src?.recipientUserID !== null) {
            return Number(src.recipientUserID);
          }
          return 0;
        })(),
        tenantID: (src?.tenantID ?? ""),
        organizationID: (src?.organizationID ?? ""),
        organizationMemberID: (src?.organizationMemberID ?? ""),
        recipientEmail: (src?.recipientEmail ?? ""),
        recipientPhoneNumber: (src?.recipientPhoneNumber ?? ""),
        channel: (src?.channel ?? ""),
        templateCode: (src?.templateCode ?? ""),
        subject: (src?.subject ?? ""),
        body: (src?.body ?? ""),
        status: (src?.status ?? ""),
        scheduledAt: src?.scheduledAt ? new Date(src?.scheduledAt as any).toISOString().split('T')[0] : "",
        sentAt: src?.sentAt ? new Date(src?.sentAt as any).toISOString().split('T')[0] : "",
        deliveredAt: src?.deliveredAt ? new Date(src?.deliveredAt as any).toISOString().split('T')[0] : "",
        readAt: src?.readAt ? new Date(src?.readAt as any).toISOString().split('T')[0] : "",
        failureReason: (src?.failureReason ?? ""),
        providerMessageID: (src?.providerMessageID ?? ""),
        metadata: (src?.metadata ?? ""),
      };
    }
    return {
      recipientUserID: 0,
      tenantID: "",
      organizationID: "",
      organizationMemberID: "",
      recipientEmail: "",
      recipientPhoneNumber: "",
      channel: "",
      templateCode: "",
      subject: "",
      body: "",
      status: "",
      scheduledAt: "",
      sentAt: "",
      deliveredAt: "",
      readAt: "",
      failureReason: "",
      providerMessageID: "",
      metadata: "",
    };
  }, [isEditMode, initialNotification]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(notificationSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialNotification && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialNotification, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialNotification && opts_recipientUserID.length > 0) {
      const currentrecipientUserID = (initialNotification as any)?.recipientUserID ;
      if (currentrecipientUserID !== undefined && currentrecipientUserID!== null) {
        const recipientUserIDValue = String(currentrecipientUserID);
        if (opts_recipientUserID.some(opt => opt.value === String(recipientUserIDValue))) {
          setValue('recipientUserID', recipientUserIDValue);
        }
      }
    }
  }, [opts_recipientUserID, isEditMode, initialNotification, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialNotification && opts_tenantID.length > 0) {
      const currenttenantID = (initialNotification as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = String(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialNotification, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialNotification && opts_organizationID.length > 0) {
      const currentorganizationID = (initialNotification as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = String(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialNotification, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialNotification && opts_organizationMemberID.length > 0) {
      const currentorganizationMemberID = (initialNotification as any)?.organizationMemberID ;
      if (currentorganizationMemberID !== undefined && currentorganizationMemberID!== null) {
        const organizationMemberIDValue = String(currentorganizationMemberID);
        if (opts_organizationMemberID.some(opt => opt.value === String(organizationMemberIDValue))) {
          setValue('organizationMemberID', organizationMemberIDValue);
        }
      }
    }
  }, [opts_organizationMemberID, isEditMode, initialNotification, setValue]);

  const onSubmitHandler = async (data: NotificationFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} notification...`, 'info');
      const payload: any = {
        notificationID: (isEditMode ? ((initialNotification as any)?.notificationID ?? null) : null),
        recipientUserID: (data.recipientUserID === 0 || data.recipientUserID === undefined || data.recipientUserID === null) ? 0 : Number(data.recipientUserID),
        tenantID: data.tenantID ?? '',
        organizationID: data.organizationID ?? '',
        organizationMemberID: data.organizationMemberID ?? '',
        recipientEmail: data.recipientEmail ?? '',
        recipientPhoneNumber: data.recipientPhoneNumber ?? '',
        channel: data.channel ?? '',
        templateCode: data.templateCode ?? '',
        subject: data.subject ?? '',
        body: data.body ?? '',
        status: data.status ?? '',
        scheduledAt: data.scheduledAt || null,
        sentAt: data.sentAt || null,
        deliveredAt: data.deliveredAt || null,
        readAt: data.readAt || null,
        failureReason: data.failureReason ?? '',
        providerMessageID: data.providerMessageID ?? '',
        metadata: data.metadata ?? '',
        capturedDate : (isEditMode ? ((initialNotification as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialNotification as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateNotification(payload as Notification) : await createNotification(payload as Notification);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`Notification "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/notifications');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit Notification' : 'Create Notification'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Recipient User " error={errors.recipientUserID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('recipientUserID')}>
              <option value="">Select Recipient User</option>
              {opts_recipientUserID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_recipientUserID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Tenant ID " error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant ID</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Organization ID " error={errors.organizationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationID')}>
              <option value="">Select Organization ID</option>
              {opts_organizationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Organization Member ID " error={errors.organizationMemberID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationMemberID')}>
              <option value="">Select Organization Member ID</option>
              {opts_organizationMemberID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationMemberID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Recipient Email" error={errors.recipientEmail?.message as string}>
            <textarea className="input" placeholder="Enter recipient email" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('recipientEmail')} rows={3} />
          </Field>
          <Field label="Recipient Phone Number" error={errors.recipientPhoneNumber?.message as string}>
            <input className="input" placeholder="Enter recipient phone number" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('recipientPhoneNumber')}  />
          </Field>
          <Field label="Channel" error={errors.channel?.message as string}>
            <input className="input" placeholder="Select channel" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('channel')}  />
          </Field>
          <Field label="Template Code" error={errors.templateCode?.message as string}>
            <input className="input" placeholder="Enter template code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('templateCode')}  />
          </Field>
          <Field label="Subject" error={errors.subject?.message as string}>
            <textarea className="input" placeholder="Enter subject" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('subject')} rows={3} />
          </Field>
          <Field label="Body" error={errors.body?.message as string}>
            <textarea className="input" placeholder="Enter body content" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('body')} rows={3} />
          </Field>
          <Field label="Status" error={errors.status?.message as string}>
            <input className="input" placeholder="Select status" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}  />
          </Field>
          <Field label="Scheduled At" error={errors.scheduledAt?.message as string}>
            <input className="input" placeholder="Select scheduled time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('scheduledAt')} />
          </Field>
          <Field label="Sent At" error={errors.sentAt?.message as string}>
            <input className="input" placeholder="Sent time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('sentAt')} />
          </Field>
          <Field label="Delivered At" error={errors.deliveredAt?.message as string}>
            <input className="input" placeholder="Delivery time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('deliveredAt')} />
          </Field>
          <Field label="Read At" error={errors.readAt?.message as string}>
            <input className="input" placeholder="Read time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('readAt')} />
          </Field>
          <Field label="Failure Reason" error={errors.failureReason?.message as string}>
            <textarea className="input" placeholder="Enter failure reason" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('failureReason')} rows={3} />
          </Field>
          <Field label="Provider Message ID" error={errors.providerMessageID?.message as string}>
            <textarea className="input" placeholder="Enter provider message ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerMessageID')} rows={3} />
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

