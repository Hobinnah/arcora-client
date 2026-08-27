{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { OrganizationMember } from '../types/OrganizationMember';
import { createOrganizationMember, updateOrganizationMember } from '../apis/useOrganizationMember';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const organizationMemberSchema = z.object({
  organizationID: z.string().min(1, "Organization is required"),
  userID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "User is required")),
  roleName: z.string().max(50, "Role Name must be less than 50 characters").min(1, "Role Name is required").refine(v => (v ?? '') === '' || ["OWNER", "ACCOUNTANT", "MANAGER", "TENANT", "STAFF", "ADMIN"].includes(v as any), "Invalid Role Name"),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["INVITED", "ACTIVE", "DEACTIVATED"].includes(v as any), "Invalid Status"),
  isPrimaryOwner: z.boolean(),
  invitedAt: z.string().optional(),
  acceptedAt: z.string().optional(),
  deactivatedAt: z.string().optional(),
});

type OrganizationMemberFormData = z.infer<typeof organizationMemberSchema>;

interface OrganizationMemberFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialOrganizationMember?: OrganizationMember | null;
  isEditMode?: boolean;
}

export default function OrganizationMemberForm({ onAlert, initialOrganizationMember = null, isEditMode = false }: OrganizationMemberFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_organizationID, setOpts_organizationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_organizationID_loading, setOpts_organizationID_loading] = React.useState(false);
  const [opts_userID, setOpts_userID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_userID_loading, setOpts_userID_loading] = React.useState(false);

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

  async function loadOptions_organizationID(){
    try { setOpts_organizationID_loading(true);
      const url = "api/organization/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'organizationID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["displayName", "name", "organizationName", "title", "fullName", "email", "description"], String(it)),
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

  const getDefaultValues = React.useCallback((): OrganizationMemberFormData => {
    const src = (initialOrganizationMember as any) ?? {};
    if (isEditMode && initialOrganizationMember) {
      return {
        organizationID: (src?.organizationID ?? ""),
        userID: (() => {
          if (src?.userID !== undefined && src?.userID !== null) {
            return Number(src.userID);
          }
          return 0;
        })(),
        roleName: (src?.roleName ?? ""),
        status: (src?.status ?? ""),
        isPrimaryOwner: Boolean(src?.isPrimaryOwner),
        invitedAt: src?.invitedAt ? new Date(src?.invitedAt as any).toISOString().split('T')[0] : "",
        acceptedAt: src?.acceptedAt ? new Date(src?.acceptedAt as any).toISOString().split('T')[0] : "",
        deactivatedAt: src?.deactivatedAt ? new Date(src?.deactivatedAt as any).toISOString().split('T')[0] : "",
      };
    }
    return {
      organizationID: "",
      userID: 0,
      roleName: "",
      status: "INVITED",
      isPrimaryOwner: false,
      invitedAt: "",
      acceptedAt: "",
      deactivatedAt: "",
    };
  }, [isEditMode, initialOrganizationMember]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(organizationMemberSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialOrganizationMember && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialOrganizationMember, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialOrganizationMember && opts_organizationID.length > 0) {
      const currentorganizationID = (initialOrganizationMember as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = String(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialOrganizationMember, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialOrganizationMember && opts_userID.length > 0) {
      const currentuserID = (initialOrganizationMember as any)?.userID ;
      if (currentuserID !== undefined && currentuserID!== null) {
        const userIDValue = String(currentuserID);
        if (opts_userID.some(opt => opt.value === String(userIDValue))) {
          setValue('userID', userIDValue);
        }
      }
    }
  }, [opts_userID, isEditMode, initialOrganizationMember, setValue]);

  const onSubmitHandler = async (data: OrganizationMemberFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} organizationmember...`, 'info');
      const payload: any = {
        organizationMemberID: (isEditMode ? ((initialOrganizationMember as any)?.organizationMemberID ?? null) : null),
        organizationID: data.organizationID ?? '',
        userID: (data.userID === 0 || data.userID === undefined || data.userID === null) ? 0 : Number(data.userID),
        roleName: data.roleName ?? '',
        status: data.status ?? '',
        isPrimaryOwner: data.isPrimaryOwner,
        invitedAt: data.invitedAt || null,
        acceptedAt: data.acceptedAt || null,
        deactivatedAt: data.deactivatedAt || null,
        capturedDate : (isEditMode ? ((initialOrganizationMember as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialOrganizationMember as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialOrganizationMember as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialOrganizationMember as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateOrganizationMember(payload as OrganizationMember) : await createOrganizationMember(payload as OrganizationMember);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`OrganizationMember "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/organizationmembers');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit OrganizationMember' : 'Create OrganizationMember'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Organization *" error={errors.organizationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationID')}>
              <option value="">Select Organization</option>
              {opts_organizationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="User *" error={errors.userID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('userID')}>
              <option value="">Select User</option>
              {opts_userID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_userID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Role Name *" error={errors.roleName?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('roleName')}>
              <option value="">Select Role Name</option>
              <option value="OWNER">OWNER</option>
              <option value="ACCOUNTANT">ACCOUNTANT</option>
              <option value="MANAGER">MANAGER</option>
              <option value="TENANT">TENANT</option>
              <option value="STAFF">STAFF</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="INVITED">INVITED</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="DEACTIVATED">DEACTIVATED</option>
            </select>
          </Field>
          <Field label="Is Primary Owner" error={errors.isPrimaryOwner?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isPrimaryOwner')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Invited At" error={errors.invitedAt?.message as string}>
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('invitedAt')} />
          </Field>
          <Field label="Accepted At" error={errors.acceptedAt?.message as string}>
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('acceptedAt')} />
          </Field>
          <Field label="Deactivated At" error={errors.deactivatedAt?.message as string}>
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('deactivatedAt')} />
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

