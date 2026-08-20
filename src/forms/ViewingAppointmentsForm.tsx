{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { ViewingAppointments } from '../types/ViewingAppointments';
import { createViewingAppointments, updateViewingAppointments } from '../apis/useViewingAppointments';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const viewingAppointmentsSchema = z.object({
  listingID: z.string().min(1, "Listing is required"),
  requestedByUserID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Requested By User is required")),
  tenantID: z.string().optional(),
  assignedOrganizationMemberID: z.string().optional(),
  scheduledFor: z.string(),
  durationMinutes: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Duration Minutes is required")),
  timeZone: z.string().max(100, "Time Zone must be less than 100 characters").min(1, "Time Zone is required"),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["REQUESTED", "CONFIRMED", "CANCELLED", "COMPLETED"].includes(v as any), "Invalid Status"),
  viewingType: z.string().max(50, "Viewing Type must be less than 50 characters").min(1, "Viewing Type is required").refine(v => (v ?? '') === '' || ["IN_PERSON", "VIRTUAL"].includes(v as any), "Invalid Viewing Type"),
  meetingUrl: z.string().max(500, "Meeting URL must be less than 500 characters").optional(),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
  cancelledAt: z.string().optional(),
  cancellationReason: z.string().max(256, "Cancellation Reason must be less than 256 characters").optional(),
});

type ViewingAppointmentsFormData = z.infer<typeof viewingAppointmentsSchema>;

interface ViewingAppointmentsFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialViewingAppointments?: ViewingAppointments | null;
  isEditMode?: boolean;
}

export default function ViewingAppointmentsForm({ onAlert, initialViewingAppointments = null, isEditMode = false }: ViewingAppointmentsFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_listingID, setOpts_listingID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_listingID_loading, setOpts_listingID_loading] = React.useState(false);
  const [opts_requestedByUserID, setOpts_requestedByUserID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_requestedByUserID_loading, setOpts_requestedByUserID_loading] = React.useState(false);
  const [opts_tenantID, setOpts_tenantID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_tenantID_loading, setOpts_tenantID_loading] = React.useState(false);
  const [opts_assignedOrganizationMemberID, setOpts_assignedOrganizationMemberID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_assignedOrganizationMemberID_loading, setOpts_assignedOrganizationMemberID_loading] = React.useState(false);

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

  async function loadOptions_listingID(){
    try { setOpts_listingID_loading(true);
      const url = "api/listing/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'listingID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "listingName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["listingID", "listingID", "id", "ID", "listingID", "listingId"], String(it))
      }));
      setOpts_listingID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_listingID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_listingID(); }, []);

  async function loadOptions_requestedByUserID(){
    try { setOpts_requestedByUserID_loading(true);
      const url = "api/account/getUsers" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'requestedByUserID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["displayName", "name", "requestedByUserName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["id", "id", "id", "ID", "requestedByUserID", "requestedByUserId"], String(it))
      }));
      setOpts_requestedByUserID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_requestedByUserID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_requestedByUserID(); }, []);

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

  async function loadOptions_assignedOrganizationMemberID(){
    try { setOpts_assignedOrganizationMemberID_loading(true);
      const url = "api/organizationmember/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'assignedOrganizationMemberID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "assignedOrganizationMemberName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["organizationMemberID", "organizationMemberID", "id", "ID", "assignedOrganizationMemberID", "assignedOrganizationMemberId"], String(it))
      }));
      setOpts_assignedOrganizationMemberID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_assignedOrganizationMemberID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_assignedOrganizationMemberID(); }, []);

  const getDefaultValues = React.useCallback((): ViewingAppointmentsFormData => {
    const src = (initialViewingAppointments as any) ?? {};
    if (isEditMode && initialViewingAppointments) {
      return {
        listingID: (src?.listingID ?? ""),
        requestedByUserID: (() => {
          if (src?.requestedByUserID !== undefined && src?.requestedByUserID !== null) {
            return Number(src.requestedByUserID);
          }
          return 0;
        })(),
        tenantID: (src?.tenantID ?? ""),
        assignedOrganizationMemberID: (src?.assignedOrganizationMemberID ?? ""),
        scheduledFor: src?.scheduledFor ? new Date(src?.scheduledFor as any).toISOString().split('T')[0] : "",
        durationMinutes: (src?.durationMinutes ?? 0),
        timeZone: (src?.timeZone ?? ""),
        status: (src?.status ?? ""),
        viewingType: (src?.viewingType ?? ""),
        meetingUrl: (src?.meetingUrl ?? ""),
        notes: (src?.notes ?? ""),
        cancelledAt: src?.cancelledAt ? new Date(src?.cancelledAt as any).toISOString().split('T')[0] : "",
        cancellationReason: (src?.cancellationReason ?? ""),
      };
    }
    return {
      listingID: "",
      requestedByUserID: 0,
      tenantID: "",
      assignedOrganizationMemberID: "",
      scheduledFor: "",
      durationMinutes: 0,
      timeZone: "",
      status: "REQUESTED",
      viewingType: "",
      meetingUrl: "",
      notes: "",
      cancelledAt: "",
      cancellationReason: "",
    };
  }, [isEditMode, initialViewingAppointments]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(viewingAppointmentsSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialViewingAppointments && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialViewingAppointments, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialViewingAppointments && opts_listingID.length > 0) {
      const currentlistingID = (initialViewingAppointments as any)?.listingID ;
      if (currentlistingID !== undefined && currentlistingID!== null) {
        const listingIDValue = Number(currentlistingID);
        if (opts_listingID.some(opt => opt.value === String(listingIDValue))) {
          setValue('listingID', listingIDValue);
        }
      }
    }
  }, [opts_listingID, isEditMode, initialViewingAppointments, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialViewingAppointments && opts_requestedByUserID.length > 0) {
      const currentrequestedByUserID = (initialViewingAppointments as any)?.requestedByUserID ;
      if (currentrequestedByUserID !== undefined && currentrequestedByUserID!== null) {
        const requestedByUserIDValue = Number(currentrequestedByUserID);
        if (opts_requestedByUserID.some(opt => opt.value === String(requestedByUserIDValue))) {
          setValue('requestedByUserID', requestedByUserIDValue);
        }
      }
    }
  }, [opts_requestedByUserID, isEditMode, initialViewingAppointments, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialViewingAppointments && opts_tenantID.length > 0) {
      const currenttenantID = (initialViewingAppointments as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = Number(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialViewingAppointments, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialViewingAppointments && opts_assignedOrganizationMemberID.length > 0) {
      const currentassignedOrganizationMemberID = (initialViewingAppointments as any)?.assignedOrganizationMemberID ;
      if (currentassignedOrganizationMemberID !== undefined && currentassignedOrganizationMemberID!== null) {
        const assignedOrganizationMemberIDValue = Number(currentassignedOrganizationMemberID);
        if (opts_assignedOrganizationMemberID.some(opt => opt.value === String(assignedOrganizationMemberIDValue))) {
          setValue('assignedOrganizationMemberID', assignedOrganizationMemberIDValue);
        }
      }
    }
  }, [opts_assignedOrganizationMemberID, isEditMode, initialViewingAppointments, setValue]);

  const onSubmitHandler = async (data: ViewingAppointmentsFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} viewingappointments...`, 'info');
      const payload: any = {
        viewingAppointmentID: (isEditMode ? ((initialViewingAppointments as any)?.viewingAppointmentID ?? null) : null),
        listingID: data.listingID ?? '',
        requestedByUserID: (data.requestedByUserID === 0 || data.requestedByUserID === undefined || data.requestedByUserID === null) ? 0 : Number(data.requestedByUserID),
        tenantID: data.tenantID ?? '',
        assignedOrganizationMemberID: data.assignedOrganizationMemberID ?? '',
        scheduledFor: data.scheduledFor || null,
        durationMinutes: data.durationMinutes,
        timeZone: data.timeZone ?? '',
        status: data.status ?? '',
        viewingType: data.viewingType ?? '',
        meetingUrl: data.meetingUrl ?? '',
        notes: data.notes ?? '',
        cancelledAt: data.cancelledAt || null,
        cancellationReason: data.cancellationReason ?? '',
        capturedDate : (isEditMode ? ((initialViewingAppointments as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialViewingAppointments as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialViewingAppointments as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialViewingAppointments as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateViewingAppointments(payload as ViewingAppointments) : await createViewingAppointments(payload as ViewingAppointments);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`ViewingAppointments "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/viewingappointments');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit ViewingAppointments' : 'Create ViewingAppointments'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Listing *" error={errors.listingID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('listingID')}>
              <option value="">Select Listing</option>
              {opts_listingID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_listingID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Requested By User *" error={errors.requestedByUserID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('requestedByUserID')}>
              <option value="">Select Requested By User</option>
              {opts_requestedByUserID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_requestedByUserID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Tenant " error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Assigned Organization Member " error={errors.assignedOrganizationMemberID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('assignedOrganizationMemberID')}>
              <option value="">Select Assigned Organization Member</option>
              {opts_assignedOrganizationMemberID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_assignedOrganizationMemberID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Scheduled For" error={errors.scheduledFor?.message as string}>
            <input className="input" placeholder="Select scheduled date/time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('scheduledFor')} />
          </Field>
          <Field label="Duration Minutes" error={errors.durationMinutes?.message as string}>
            <input className="input" placeholder="Enter duration in minutes" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('durationMinutes', { valueAsNumber: true })} />
          </Field>
          <Field label="Time Zone" error={errors.timeZone?.message as string}>
            <input className="input" placeholder="Enter time zone" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('timeZone')}  />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="REQUESTED">REQUESTED</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </Field>
          <Field label="Viewing Type *" error={errors.viewingType?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('viewingType')}>
              <option value="">Select Viewing Type</option>
              <option value="IN_PERSON">IN_PERSON</option>
              <option value="VIRTUAL">VIRTUAL</option>
            </select>
          </Field>
          <Field label="Meeting URL" error={errors.meetingUrl?.message as string}>
            <textarea className="input" placeholder="Enter meeting URL" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('meetingUrl')} rows={3} />
          </Field>
          <Field label="Notes" error={errors.notes?.message as string}>
            <textarea className="input" placeholder="Enter notes" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('notes')} rows={3} />
          </Field>
          <Field label="Cancelled At" error={errors.cancelledAt?.message as string}>
            <input className="input" placeholder="Select cancellation date/time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('cancelledAt')} />
          </Field>
          <Field label="Cancellation Reason" error={errors.cancellationReason?.message as string}>
            <textarea className="input" placeholder="Enter cancellation reason" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('cancellationReason')} rows={3} />
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

