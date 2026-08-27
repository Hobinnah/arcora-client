{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { ConversationParticipant } from '../types/ConversationParticipant';
import { createConversationParticipant, updateConversationParticipant } from '../apis/useConversationParticipant';
import { fetchData } from '../apis/useApi';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const conversationParticipantSchema = z.object({
  conversationID: z.string().min(1, "Conversation is required"),
  userID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  tenantID: z.string().optional(),
  organizationMemberID: z.string().optional(),
  participantRole: z.string().max(50, "Participant Role must be less than 50 characters").optional(),
  joinedAt: z.string(),
  leftAt: z.string().optional(),
  lastReadAt: z.string().optional(),
  isMuted: z.boolean(),
  capturedDate: z.string().optional(),
});

type ConversationParticipantFormData = z.infer<typeof conversationParticipantSchema>;

interface ConversationParticipantFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialConversationParticipant?: ConversationParticipant | null;
  isEditMode?: boolean;
}

export default function ConversationParticipantForm({ onAlert, initialConversationParticipant = null, isEditMode = false }: ConversationParticipantFormProps) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_conversationID, setOpts_conversationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_conversationID_loading, setOpts_conversationID_loading] = React.useState(false);
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

  async function loadOptions_conversationID(){
    try { setOpts_conversationID_loading(true);
      const url = "api/conversation/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'conversationID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["subject", "name", "conversationName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_organizationMemberID(){
    try { setOpts_organizationMemberID_loading(true);
      const url = "api/organizationmember/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'organizationMemberID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["memberName", "name", "organizationMemberName", "title", "fullName", "email", "description"], String(it)),
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

  const getDefaultValues = React.useCallback((): ConversationParticipantFormData => {
    const src = (initialConversationParticipant as any) ?? {};
    if (isEditMode && initialConversationParticipant) {
      return {
        conversationID: (src?.conversationID ?? ""),
        userID: (() => {
          if (src?.userID !== undefined && src?.userID !== null) {
            return Number(src.userID);
          }
          return 0;
        })(),
        tenantID: (src?.tenantID ?? ""),
        organizationMemberID: (src?.organizationMemberID ?? ""),
        participantRole: (src?.participantRole ?? ""),
        joinedAt: src?.joinedAt ? new Date(src?.joinedAt as any).toISOString().split('T')[0] : "",
        leftAt: src?.leftAt ? new Date(src?.leftAt as any).toISOString().split('T')[0] : "",
        lastReadAt: src?.lastReadAt ? new Date(src?.lastReadAt as any).toISOString().split('T')[0] : "",
        isMuted: Boolean(src?.isMuted),
        capturedDate: src?.capturedDate ? new Date(src?.capturedDate as any).toISOString().split('T')[0] : "",
      };
    }
    return {
      conversationID: "",
      userID: 0,
      tenantID: "",
      organizationMemberID: "",
      participantRole: "",
      joinedAt: "",
      leftAt: "",
      lastReadAt: "",
      isMuted: false,
      capturedDate: new Date().toISOString().split('T')[0],
    };
  }, [isEditMode, initialConversationParticipant]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(conversationParticipantSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialConversationParticipant && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialConversationParticipant, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialConversationParticipant && opts_conversationID.length > 0) {
      const currentconversationID = (initialConversationParticipant as any)?.conversationID ;
      if (currentconversationID !== undefined && currentconversationID!== null) {
        const conversationIDValue = String(currentconversationID);
        if (opts_conversationID.some(opt => opt.value === String(conversationIDValue))) {
          setValue('conversationID', conversationIDValue);
        }
      }
    }
  }, [opts_conversationID, isEditMode, initialConversationParticipant, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialConversationParticipant && opts_userID.length > 0) {
      const currentuserID = (initialConversationParticipant as any)?.userID ;
      if (currentuserID !== undefined && currentuserID!== null) {
        const userIDValue = String(currentuserID);
        if (opts_userID.some(opt => opt.value === String(userIDValue))) {
          setValue('userID', userIDValue);
        }
      }
    }
  }, [opts_userID, isEditMode, initialConversationParticipant, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialConversationParticipant && opts_tenantID.length > 0) {
      const currenttenantID = (initialConversationParticipant as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = String(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialConversationParticipant, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialConversationParticipant && opts_organizationMemberID.length > 0) {
      const currentorganizationMemberID = (initialConversationParticipant as any)?.organizationMemberID ;
      if (currentorganizationMemberID !== undefined && currentorganizationMemberID!== null) {
        const organizationMemberIDValue = String(currentorganizationMemberID);
        if (opts_organizationMemberID.some(opt => opt.value === String(organizationMemberIDValue))) {
          setValue('organizationMemberID', organizationMemberIDValue);
        }
      }
    }
  }, [opts_organizationMemberID, isEditMode, initialConversationParticipant, setValue]);

  const onSubmitHandler = async (data: ConversationParticipantFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} conversationparticipant...`, 'info');
      const payload: any = {
        conversationParticipantID: (isEditMode ? ((initialConversationParticipant as any)?.conversationParticipantID ?? null) : null),
        conversationID: data.conversationID ?? '',
        userID: (data.userID === 0 || data.userID === undefined || data.userID === null) ? 0 : Number(data.userID),
        tenantID: data.tenantID ?? '',
        organizationMemberID: data.organizationMemberID ?? '',
        participantRole: data.participantRole ?? '',
        joinedAt: data.joinedAt || null,
        leftAt: data.leftAt || null,
        lastReadAt: data.lastReadAt || null,
        isMuted: data.isMuted,
        capturedDate: data.capturedDate || new Date().toISOString().split('T')[0],
      };
      let result: any;
      result = isEditMode ? await updateConversationParticipant(payload as ConversationParticipant) : await createConversationParticipant(payload as ConversationParticipant);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`ConversationParticipant "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/conversationparticipants');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit ConversationParticipant' : 'Create ConversationParticipant'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Conversation *" error={errors.conversationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('conversationID')}>
              <option value="">Select Conversation</option>
              {opts_conversationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_conversationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
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
          <Field label="Participant Role" error={errors.participantRole?.message as string}>
            <input className="input" placeholder="Enter participant role" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('participantRole')}  />
          </Field>
          <Field label="Joined At" error={errors.joinedAt?.message as string}>
            <input className="input" placeholder="Select join date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('joinedAt')} />
          </Field>
          <Field label="Left At" error={errors.leftAt?.message as string}>
            <input className="input" placeholder="Select leave date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('leftAt')} />
          </Field>
          <Field label="Last Read At" error={errors.lastReadAt?.message as string}>
            <input className="input" placeholder="Select last read date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('lastReadAt')} />
          </Field>
          <Field label="Is Muted" error={errors.isMuted?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isMuted')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Captured Date" error={errors.capturedDate?.message as string}>
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('capturedDate')} />
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

