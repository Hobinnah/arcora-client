{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { ConversationMessage } from '../types/ConversationMessage';
import { createConversationMessage, updateConversationMessage } from '../apis/useConversationMessage';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const conversationMessageSchema = z.object({
  conversationID: z.string().min(1, "Conversation is required"),
  senderUserID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  senderTenantID: z.string().optional(),
  senderOrganizationMemberID: z.string().optional(),
  message: z.string().max(256, "Message must be less than 256 characters").min(1, "Message is required"),
  messageType: z.string().max(50, "Message Type must be less than 50 characters").min(1, "Message Type is required"),
  replyToMessageID: z.string().optional(),
});

type ConversationMessageFormData = z.infer<typeof conversationMessageSchema>;

interface ConversationMessageFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialConversationMessage?: ConversationMessage | null;
  isEditMode?: boolean;
}

export default function ConversationMessageForm({ onAlert, initialConversationMessage = null, isEditMode = false }: ConversationMessageFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_conversationID, setOpts_conversationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_conversationID_loading, setOpts_conversationID_loading] = React.useState(false);
  const [opts_senderUserID, setOpts_senderUserID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_senderUserID_loading, setOpts_senderUserID_loading] = React.useState(false);
  const [opts_senderTenantID, setOpts_senderTenantID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_senderTenantID_loading, setOpts_senderTenantID_loading] = React.useState(false);
  const [opts_senderOrganizationMemberID, setOpts_senderOrganizationMemberID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_senderOrganizationMemberID_loading, setOpts_senderOrganizationMemberID_loading] = React.useState(false);
  const [opts_replyToMessageID, setOpts_replyToMessageID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_replyToMessageID_loading, setOpts_replyToMessageID_loading] = React.useState(false);

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

  async function loadOptions_conversationID(){
    try { setOpts_conversationID_loading(true);
      const url = "api/conversation/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'conversationID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["conversationID", "name", "conversationName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["conversationID", "conversationID", "id", "ID", "conversationID", "conversationId"], String(it))
      }));
      setOpts_conversationID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_conversationID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_conversationID(); }, []);

  async function loadOptions_senderUserID(){
    try { setOpts_senderUserID_loading(true);
      const url = "api/account/getUsers" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'senderUserID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["displayName", "name", "senderUserName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["id", "id", "id", "ID", "senderUserID", "senderUserId"], String(it))
      }));
      setOpts_senderUserID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_senderUserID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_senderUserID(); }, []);

  async function loadOptions_senderTenantID(){
    try { setOpts_senderTenantID_loading(true);
      const url = "api/tenant/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'senderTenantID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "senderTenantName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["tenantID", "tenantID", "id", "ID", "senderTenantID", "senderTenantId"], String(it))
      }));
      setOpts_senderTenantID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_senderTenantID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_senderTenantID(); }, []);

  async function loadOptions_senderOrganizationMemberID(){
    try { setOpts_senderOrganizationMemberID_loading(true);
      const url = "api/organizationmember/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'senderOrganizationMemberID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["displayName", "name", "senderOrganizationMemberName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["organizationMemberID", "organizationMemberID", "id", "ID", "senderOrganizationMemberID", "senderOrganizationMemberId"], String(it))
      }));
      setOpts_senderOrganizationMemberID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_senderOrganizationMemberID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_senderOrganizationMemberID(); }, []);

  async function loadOptions_replyToMessageID(){
    try { setOpts_replyToMessageID_loading(true);
      const url = "api/conversationmessage/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'replyToMessageID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["message", "name", "replyToMessageName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["conversationMessageID", "conversationMessageID", "id", "ID", "replyToMessageID", "replyToMessageId"], String(it))
      }));
      setOpts_replyToMessageID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_replyToMessageID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_replyToMessageID(); }, []);

  const getDefaultValues = React.useCallback((): ConversationMessageFormData => {
    const src = (initialConversationMessage as any) ?? {};
    if (isEditMode && initialConversationMessage) {
      return {
        conversationID: (src?.conversationID ?? ""),
        senderUserID: (() => {
          if (src?.senderUserID !== undefined && src?.senderUserID !== null) {
            return Number(src.senderUserID);
          }
          return 0;
        })(),
        senderTenantID: (src?.senderTenantID ?? ""),
        senderOrganizationMemberID: (src?.senderOrganizationMemberID ?? ""),
        message: (src?.message ?? ""),
        messageType: (src?.messageType ?? ""),
        replyToMessageID: (src?.replyToMessageID ?? ""),
      };
    }
    return {
      conversationID: "",
      senderUserID: 0,
      senderTenantID: "",
      senderOrganizationMemberID: "",
      message: "",
      messageType: "",
      replyToMessageID: "",
    };
  }, [isEditMode, initialConversationMessage]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(conversationMessageSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialConversationMessage && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialConversationMessage, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialConversationMessage && opts_conversationID.length > 0) {
      const currentconversationID = (initialConversationMessage as any)?.conversationID ;
      if (currentconversationID !== undefined && currentconversationID!== null) {
        const conversationIDValue = Number(currentconversationID);
        if (opts_conversationID.some(opt => opt.value === String(conversationIDValue))) {
          setValue('conversationID', conversationIDValue);
        }
      }
    }
  }, [opts_conversationID, isEditMode, initialConversationMessage, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialConversationMessage && opts_senderUserID.length > 0) {
      const currentsenderUserID = (initialConversationMessage as any)?.senderUserID ;
      if (currentsenderUserID !== undefined && currentsenderUserID!== null) {
        const senderUserIDValue = Number(currentsenderUserID);
        if (opts_senderUserID.some(opt => opt.value === String(senderUserIDValue))) {
          setValue('senderUserID', senderUserIDValue);
        }
      }
    }
  }, [opts_senderUserID, isEditMode, initialConversationMessage, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialConversationMessage && opts_senderTenantID.length > 0) {
      const currentsenderTenantID = (initialConversationMessage as any)?.senderTenantID ;
      if (currentsenderTenantID !== undefined && currentsenderTenantID!== null) {
        const senderTenantIDValue = Number(currentsenderTenantID);
        if (opts_senderTenantID.some(opt => opt.value === String(senderTenantIDValue))) {
          setValue('senderTenantID', senderTenantIDValue);
        }
      }
    }
  }, [opts_senderTenantID, isEditMode, initialConversationMessage, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialConversationMessage && opts_senderOrganizationMemberID.length > 0) {
      const currentsenderOrganizationMemberID = (initialConversationMessage as any)?.senderOrganizationMemberID ;
      if (currentsenderOrganizationMemberID !== undefined && currentsenderOrganizationMemberID!== null) {
        const senderOrganizationMemberIDValue = Number(currentsenderOrganizationMemberID);
        if (opts_senderOrganizationMemberID.some(opt => opt.value === String(senderOrganizationMemberIDValue))) {
          setValue('senderOrganizationMemberID', senderOrganizationMemberIDValue);
        }
      }
    }
  }, [opts_senderOrganizationMemberID, isEditMode, initialConversationMessage, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialConversationMessage && opts_replyToMessageID.length > 0) {
      const currentreplyToMessageID = (initialConversationMessage as any)?.replyToMessageID ;
      if (currentreplyToMessageID !== undefined && currentreplyToMessageID!== null) {
        const replyToMessageIDValue = Number(currentreplyToMessageID);
        if (opts_replyToMessageID.some(opt => opt.value === String(replyToMessageIDValue))) {
          setValue('replyToMessageID', replyToMessageIDValue);
        }
      }
    }
  }, [opts_replyToMessageID, isEditMode, initialConversationMessage, setValue]);

  const onSubmitHandler = async (data: ConversationMessageFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} conversationmessage...`, 'info');
      const payload: any = {
        conversationMessageID: (isEditMode ? ((initialConversationMessage as any)?.conversationMessageID ?? null) : null),
        conversationID: data.conversationID ?? '',
        senderUserID: (data.senderUserID === 0 || data.senderUserID === undefined || data.senderUserID === null) ? 0 : Number(data.senderUserID),
        senderTenantID: data.senderTenantID ?? '',
        senderOrganizationMemberID: data.senderOrganizationMemberID ?? '',
        message: data.message ?? '',
        messageType: data.messageType ?? '',
        replyToMessageID: data.replyToMessageID ?? '',
        sentAt : (isEditMode ? ((initialConversationMessage as any)?.sentAt ?? null) : null),
        editedAt : (isEditMode ? ((initialConversationMessage as any)?.editedAt ?? null) : null),
        deletedAt : (isEditMode ? ((initialConversationMessage as any)?.deletedAt ?? null) : null),
        capturedDate : (isEditMode ? ((initialConversationMessage as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialConversationMessage as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateConversationMessage(payload as ConversationMessage) : await createConversationMessage(payload as ConversationMessage);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`ConversationMessage "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/conversationmessages');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit ConversationMessage' : 'Create ConversationMessage'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Conversation *" error={errors.conversationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('conversationID')}>
              <option value="">Select Conversation</option>
              {opts_conversationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_conversationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Sender User " error={errors.senderUserID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('senderUserID')}>
              <option value="">Select Sender User</option>
              {opts_senderUserID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_senderUserID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Sender Tenant " error={errors.senderTenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('senderTenantID')}>
              <option value="">Select Sender Tenant</option>
              {opts_senderTenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_senderTenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Sender Organization Member " error={errors.senderOrganizationMemberID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('senderOrganizationMemberID')}>
              <option value="">Select Sender Organization Member</option>
              {opts_senderOrganizationMemberID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_senderOrganizationMemberID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Message" error={errors.message?.message as string}>
            <textarea className="input" placeholder="Enter message" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('message')} rows={3} />
          </Field>
          <Field label="Message Type" error={errors.messageType?.message as string}>
            <input className="input" placeholder="Enter message type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('messageType')}  />
          </Field>
          <Field label="Reply To Message " error={errors.replyToMessageID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('replyToMessageID')}>
              <option value="">Select Reply To Message</option>
              {opts_replyToMessageID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_replyToMessageID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
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

