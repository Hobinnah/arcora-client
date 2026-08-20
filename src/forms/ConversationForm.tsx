{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { Conversation } from '../types/Conversation';
import { createConversation, updateConversation } from '../apis/useConversation';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const conversationSchema = z.object({
  conversationType: z.string().max(50, "Conversation Type must be less than 50 characters").min(1, "Conversation Type is required").refine(v => (v ?? '') === '' || ["DIRECT", "GROUP"].includes(v as any), "Invalid Conversation Type"),
  leaseID: z.string().optional(),
  leaseRenewalID: z.string().optional(),
  maintenanceRequestID: z.string().optional(),
  disputeID: z.string().optional(),
  subject: z.string().max(200, "Subject must be less than 200 characters").optional(),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["OPEN", "CLOSED"].includes(v as any), "Invalid Status"),
  lastMessageAt: z.string().optional(),
  closedAt: z.string().optional(),
  capturedDate: z.string().optional(),
  capturedBy: z.string().max(100, "Captured By must be less than 100 characters").optional(),
  updatedDate: z.string().optional(),
  updatedBy: z.string().max(100, "Updated By must be less than 100 characters").optional(),
});

type ConversationFormData = z.infer<typeof conversationSchema>;

interface ConversationFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialConversation?: Conversation | null;
  isEditMode?: boolean;
}

export default function ConversationForm({ onAlert, initialConversation = null, isEditMode = false }: ConversationFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_leaseID, setOpts_leaseID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseID_loading, setOpts_leaseID_loading] = React.useState(false);
  const [opts_leaseRenewalID, setOpts_leaseRenewalID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseRenewalID_loading, setOpts_leaseRenewalID_loading] = React.useState(false);
  const [opts_maintenanceRequestID, setOpts_maintenanceRequestID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_maintenanceRequestID_loading, setOpts_maintenanceRequestID_loading] = React.useState(false);
  const [opts_disputeID, setOpts_disputeID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_disputeID_loading, setOpts_disputeID_loading] = React.useState(false);

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
        label: firstNonEmpty(it, ["leaseNumber", "name", "leaseName", "title", "fullName", "email", "description"], String(it)),
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
        label: firstNonEmpty(it, ["renewalNumber", "name", "leaseRenewalName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_maintenanceRequestID(){
    try { setOpts_maintenanceRequestID_loading(true);
      const url = "api/maintenancerequest/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'maintenanceRequestID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["title", "name", "maintenanceRequestName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["maintenanceRequestID", "maintenanceRequestID", "id", "ID", "maintenanceRequestID", "maintenanceRequestId"], String(it))
      }));
      setOpts_maintenanceRequestID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_maintenanceRequestID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_maintenanceRequestID(); }, []);

  async function loadOptions_disputeID(){
    try { setOpts_disputeID_loading(true);
      const url = "api/dispute/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'disputeID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["disputeTitle", "name", "disputeName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["disputeID", "disputeID", "id", "ID", "disputeID", "disputeId"], String(it))
      }));
      setOpts_disputeID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_disputeID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_disputeID(); }, []);

  const getDefaultValues = React.useCallback((): ConversationFormData => {
    const src = (initialConversation as any) ?? {};
    if (isEditMode && initialConversation) {
      return {
        conversationType: (src?.conversationType ?? ""),
        leaseID: (src?.leaseID ?? ""),
        leaseRenewalID: (src?.leaseRenewalID ?? ""),
        maintenanceRequestID: (src?.maintenanceRequestID ?? ""),
        disputeID: (src?.disputeID ?? ""),
        subject: (src?.subject ?? ""),
        status: (src?.status ?? ""),
        lastMessageAt: src?.lastMessageAt ? new Date(src?.lastMessageAt as any).toISOString().split('T')[0] : "",
        closedAt: src?.closedAt ? new Date(src?.closedAt as any).toISOString().split('T')[0] : "",
        capturedDate: src?.capturedDate ? new Date(src?.capturedDate as any).toISOString().split('T')[0] : "",
        capturedBy: (src?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate: src?.updatedDate ? new Date(src?.updatedDate as any).toISOString().split('T')[0] : "",
        updatedBy: (src?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
    }
    return {
      conversationType: "",
      leaseID: "",
      leaseRenewalID: "",
      maintenanceRequestID: "",
      disputeID: "",
      subject: "",
      status: "OPEN",
      lastMessageAt: "",
      closedAt: "",
      capturedDate: new Date().toISOString().split('T')[0],
      capturedBy: ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim(),
      updatedDate: "",
      updatedBy: ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim(),
    };
  }, [isEditMode, initialConversation]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(conversationSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialConversation && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialConversation, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialConversation && opts_leaseID.length > 0) {
      const currentleaseID = (initialConversation as any)?.leaseID ;
      if (currentleaseID !== undefined && currentleaseID!== null) {
        const leaseIDValue = Number(currentleaseID);
        if (opts_leaseID.some(opt => opt.value === String(leaseIDValue))) {
          setValue('leaseID', leaseIDValue);
        }
      }
    }
  }, [opts_leaseID, isEditMode, initialConversation, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialConversation && opts_leaseRenewalID.length > 0) {
      const currentleaseRenewalID = (initialConversation as any)?.leaseRenewalID ;
      if (currentleaseRenewalID !== undefined && currentleaseRenewalID!== null) {
        const leaseRenewalIDValue = Number(currentleaseRenewalID);
        if (opts_leaseRenewalID.some(opt => opt.value === String(leaseRenewalIDValue))) {
          setValue('leaseRenewalID', leaseRenewalIDValue);
        }
      }
    }
  }, [opts_leaseRenewalID, isEditMode, initialConversation, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialConversation && opts_maintenanceRequestID.length > 0) {
      const currentmaintenanceRequestID = (initialConversation as any)?.maintenanceRequestID ;
      if (currentmaintenanceRequestID !== undefined && currentmaintenanceRequestID!== null) {
        const maintenanceRequestIDValue = Number(currentmaintenanceRequestID);
        if (opts_maintenanceRequestID.some(opt => opt.value === String(maintenanceRequestIDValue))) {
          setValue('maintenanceRequestID', maintenanceRequestIDValue);
        }
      }
    }
  }, [opts_maintenanceRequestID, isEditMode, initialConversation, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialConversation && opts_disputeID.length > 0) {
      const currentdisputeID = (initialConversation as any)?.disputeID ;
      if (currentdisputeID !== undefined && currentdisputeID!== null) {
        const disputeIDValue = Number(currentdisputeID);
        if (opts_disputeID.some(opt => opt.value === String(disputeIDValue))) {
          setValue('disputeID', disputeIDValue);
        }
      }
    }
  }, [opts_disputeID, isEditMode, initialConversation, setValue]);

  const onSubmitHandler = async (data: ConversationFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} conversation...`, 'info');
      const payload: any = {
        conversationID: (isEditMode ? ((initialConversation as any)?.conversationID ?? null) : null),
        conversationType: data.conversationType ?? '',
        leaseID: data.leaseID ?? '',
        leaseRenewalID: data.leaseRenewalID ?? '',
        maintenanceRequestID: data.maintenanceRequestID ?? '',
        disputeID: data.disputeID ?? '',
        subject: data.subject ?? '',
        status: data.status ?? '',
        lastMessageAt: data.lastMessageAt || null,
        closedAt: data.closedAt || null,
        capturedDate: data.capturedDate || new Date().toISOString().split('T')[0],
        capturedBy: (data.capturedBy || ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate: data.updatedDate || null,
        updatedBy: (data.updatedBy || ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateConversation(payload as Conversation) : await createConversation(payload as Conversation);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`Conversation "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/conversations');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit Conversation' : 'Create Conversation'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Conversation Type *" error={errors.conversationType?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('conversationType')}>
              <option value="">Select Conversation Type</option>
              <option value="DIRECT">DIRECT</option>
              <option value="GROUP">GROUP</option>
            </select>
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
          <Field label="Maintenance Request " error={errors.maintenanceRequestID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('maintenanceRequestID')}>
              <option value="">Select Maintenance Request</option>
              {opts_maintenanceRequestID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_maintenanceRequestID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Dispute " error={errors.disputeID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('disputeID')}>
              <option value="">Select Dispute</option>
              {opts_disputeID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_disputeID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Subject" error={errors.subject?.message as string}>
            <input className="input" placeholder="Enter subject" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('subject')}  />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </Field>
          <Field label="Last Message At" error={errors.lastMessageAt?.message as string}>
            <input className="input" placeholder="Date and time of last message" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('lastMessageAt')} />
          </Field>
          <Field label="Closed At" error={errors.closedAt?.message as string}>
            <input className="input" placeholder="Date and time closed" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('closedAt')} />
          </Field>
          <Field label="Captured Date" error={errors.capturedDate?.message as string}>
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('capturedDate')} />
          </Field>
          <Field label="Captured By" error={errors.capturedBy?.message as string}>
            <input className="input" placeholder="" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('capturedBy')} readOnly />
          </Field>
          <Field label="Updated Date" error={errors.updatedDate?.message as string}>
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('updatedDate')} />
          </Field>
          <Field label="Updated By" error={errors.updatedBy?.message as string}>
            <input className="input" placeholder="" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('updatedBy')} readOnly />
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

