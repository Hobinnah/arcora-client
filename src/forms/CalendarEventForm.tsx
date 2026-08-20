{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { CalendarEvent } from '../types/CalendarEvent';
import { createCalendarEvent, updateCalendarEvent } from '../apis/useCalendarEvent';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const calendarEventSchema = z.object({
  listingID: z.string().min(1, "Listing is required"),
  leaseID: z.string().optional(),
  rentalApplicationID: z.string().optional(),
  reservationHoldID: z.string().optional(),
  maintenanceRequestID: z.string().optional(),
  eventType: z.string().max(50, "Event Type must be less than 50 characters").min(1, "Event Type is required"),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required"),
  startAt: z.string(),
  endAt: z.string(),
  isAllDay: z.boolean(),
  title: z.string().max(255, "Title must be less than 255 characters").optional(),
  occupantName: z.string().max(100, "Occupant Name must be less than 100 characters").optional(),
  occupantCount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  sourceSystem: z.string().max(100, "Source System must be less than 100 characters").optional(),
  sourceReferenceID: z.string().max(255, "Source Reference ID must be less than 255 characters").optional(),
  externalCalendarID: z.string().max(255, "External Calendar ID must be less than 255 characters").optional(),
  blocksAvailability: z.boolean(),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
});

type CalendarEventFormData = z.infer<typeof calendarEventSchema>;

interface CalendarEventFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialCalendarEvent?: CalendarEvent | null;
  isEditMode?: boolean;
}

export default function CalendarEventForm({ onAlert, initialCalendarEvent = null, isEditMode = false }: CalendarEventFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_listingID, setOpts_listingID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_listingID_loading, setOpts_listingID_loading] = React.useState(false);
  const [opts_leaseID, setOpts_leaseID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseID_loading, setOpts_leaseID_loading] = React.useState(false);
  const [opts_rentalApplicationID, setOpts_rentalApplicationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_rentalApplicationID_loading, setOpts_rentalApplicationID_loading] = React.useState(false);
  const [opts_reservationHoldID, setOpts_reservationHoldID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_reservationHoldID_loading, setOpts_reservationHoldID_loading] = React.useState(false);
  const [opts_maintenanceRequestID, setOpts_maintenanceRequestID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_maintenanceRequestID_loading, setOpts_maintenanceRequestID_loading] = React.useState(false);

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

  async function loadOptions_leaseID(){
    try { setOpts_leaseID_loading(true);
      const url = "api/lease/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'leaseID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "leaseName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_rentalApplicationID(){
    try { setOpts_rentalApplicationID_loading(true);
      const url = "api/rentalapplication/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'rentalApplicationID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "rentalApplicationName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["rentalApplicationID", "rentalApplicationID", "id", "ID", "rentalApplicationID", "rentalApplicationId"], String(it))
      }));
      setOpts_rentalApplicationID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_rentalApplicationID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_rentalApplicationID(); }, []);

  async function loadOptions_reservationHoldID(){
    try { setOpts_reservationHoldID_loading(true);
      const url = "api/reservationhold/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'reservationHoldID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "reservationHoldName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["reservationHoldID", "reservationHoldID", "id", "ID", "reservationHoldID", "reservationHoldId"], String(it))
      }));
      setOpts_reservationHoldID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_reservationHoldID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_reservationHoldID(); }, []);

  async function loadOptions_maintenanceRequestID(){
    try { setOpts_maintenanceRequestID_loading(true);
      const url = "api/maintenancerequest/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'maintenanceRequestID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "maintenanceRequestName", "title", "fullName", "email", "description"], String(it)),
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

  const getDefaultValues = React.useCallback((): CalendarEventFormData => {
    const src = (initialCalendarEvent as any) ?? {};
    if (isEditMode && initialCalendarEvent) {
      return {
        listingID: (src?.listingID ?? ""),
        leaseID: (src?.leaseID ?? ""),
        rentalApplicationID: (src?.rentalApplicationID ?? ""),
        reservationHoldID: (src?.reservationHoldID ?? ""),
        maintenanceRequestID: (src?.maintenanceRequestID ?? ""),
        eventType: (src?.eventType ?? ""),
        status: (src?.status ?? ""),
        startAt: src?.startAt ? new Date(src?.startAt as any).toISOString().split('T')[0] : "",
        endAt: src?.endAt ? new Date(src?.endAt as any).toISOString().split('T')[0] : "",
        isAllDay: Boolean(src?.isAllDay),
        title: (src?.title ?? ""),
        occupantName: (src?.occupantName ?? ""),
        occupantCount: (src?.occupantCount ?? 0),
        sourceSystem: (src?.sourceSystem ?? ""),
        sourceReferenceID: (src?.sourceReferenceID ?? ""),
        externalCalendarID: (src?.externalCalendarID ?? ""),
        blocksAvailability: Boolean(src?.blocksAvailability),
        notes: (src?.notes ?? ""),
      };
    }
    return {
      listingID: "",
      leaseID: "",
      rentalApplicationID: "",
      reservationHoldID: "",
      maintenanceRequestID: "",
      eventType: "",
      status: "",
      startAt: "",
      endAt: "",
      isAllDay: false,
      title: "",
      occupantName: "",
      occupantCount: 0,
      sourceSystem: "",
      sourceReferenceID: "",
      externalCalendarID: "",
      blocksAvailability: false,
      notes: "",
    };
  }, [isEditMode, initialCalendarEvent]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(calendarEventSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialCalendarEvent && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialCalendarEvent, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialCalendarEvent && opts_listingID.length > 0) {
      const currentlistingID = (initialCalendarEvent as any)?.listingID ;
      if (currentlistingID !== undefined && currentlistingID!== null) {
        const listingIDValue = Number(currentlistingID);
        if (opts_listingID.some(opt => opt.value === String(listingIDValue))) {
          setValue('listingID', listingIDValue);
        }
      }
    }
  }, [opts_listingID, isEditMode, initialCalendarEvent, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialCalendarEvent && opts_leaseID.length > 0) {
      const currentleaseID = (initialCalendarEvent as any)?.leaseID ;
      if (currentleaseID !== undefined && currentleaseID!== null) {
        const leaseIDValue = Number(currentleaseID);
        if (opts_leaseID.some(opt => opt.value === String(leaseIDValue))) {
          setValue('leaseID', leaseIDValue);
        }
      }
    }
  }, [opts_leaseID, isEditMode, initialCalendarEvent, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialCalendarEvent && opts_rentalApplicationID.length > 0) {
      const currentrentalApplicationID = (initialCalendarEvent as any)?.rentalApplicationID ;
      if (currentrentalApplicationID !== undefined && currentrentalApplicationID!== null) {
        const rentalApplicationIDValue = Number(currentrentalApplicationID);
        if (opts_rentalApplicationID.some(opt => opt.value === String(rentalApplicationIDValue))) {
          setValue('rentalApplicationID', rentalApplicationIDValue);
        }
      }
    }
  }, [opts_rentalApplicationID, isEditMode, initialCalendarEvent, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialCalendarEvent && opts_reservationHoldID.length > 0) {
      const currentreservationHoldID = (initialCalendarEvent as any)?.reservationHoldID ;
      if (currentreservationHoldID !== undefined && currentreservationHoldID!== null) {
        const reservationHoldIDValue = Number(currentreservationHoldID);
        if (opts_reservationHoldID.some(opt => opt.value === String(reservationHoldIDValue))) {
          setValue('reservationHoldID', reservationHoldIDValue);
        }
      }
    }
  }, [opts_reservationHoldID, isEditMode, initialCalendarEvent, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialCalendarEvent && opts_maintenanceRequestID.length > 0) {
      const currentmaintenanceRequestID = (initialCalendarEvent as any)?.maintenanceRequestID ;
      if (currentmaintenanceRequestID !== undefined && currentmaintenanceRequestID!== null) {
        const maintenanceRequestIDValue = Number(currentmaintenanceRequestID);
        if (opts_maintenanceRequestID.some(opt => opt.value === String(maintenanceRequestIDValue))) {
          setValue('maintenanceRequestID', maintenanceRequestIDValue);
        }
      }
    }
  }, [opts_maintenanceRequestID, isEditMode, initialCalendarEvent, setValue]);

  const onSubmitHandler = async (data: CalendarEventFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} calendarevent...`, 'info');
      const payload: any = {
        calendarEventID: (isEditMode ? ((initialCalendarEvent as any)?.calendarEventID ?? null) : null),
        listingID: data.listingID ?? '',
        leaseID: data.leaseID ?? '',
        rentalApplicationID: data.rentalApplicationID ?? '',
        reservationHoldID: data.reservationHoldID ?? '',
        maintenanceRequestID: data.maintenanceRequestID ?? '',
        eventType: data.eventType ?? '',
        status: data.status ?? '',
        startAt: data.startAt || null,
        endAt: data.endAt || null,
        isAllDay: data.isAllDay,
        title: data.title ?? '',
        occupantName: data.occupantName ?? '',
        occupantCount: data.occupantCount,
        sourceSystem: data.sourceSystem ?? '',
        sourceReferenceID: data.sourceReferenceID ?? '',
        externalCalendarID: data.externalCalendarID ?? '',
        blocksAvailability: data.blocksAvailability,
        notes: data.notes ?? '',
        capturedDate : (isEditMode ? ((initialCalendarEvent as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialCalendarEvent as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialCalendarEvent as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialCalendarEvent as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateCalendarEvent(payload as CalendarEvent) : await createCalendarEvent(payload as CalendarEvent);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`CalendarEvent "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/calendarevents');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit CalendarEvent' : 'Create CalendarEvent'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Listing *" error={errors.listingID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('listingID')}>
              <option value="">Select Listing</option>
              {opts_listingID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_listingID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Lease " error={errors.leaseID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('leaseID')}>
              <option value="">Select Lease</option>
              {opts_leaseID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_leaseID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Rental Application " error={errors.rentalApplicationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('rentalApplicationID')}>
              <option value="">Select Rental Application</option>
              {opts_rentalApplicationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_rentalApplicationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Reservation Hold " error={errors.reservationHoldID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('reservationHoldID')}>
              <option value="">Select Reservation Hold</option>
              {opts_reservationHoldID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_reservationHoldID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Maintenance Request " error={errors.maintenanceRequestID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('maintenanceRequestID')}>
              <option value="">Select Maintenance Request</option>
              {opts_maintenanceRequestID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_maintenanceRequestID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Event Type" error={errors.eventType?.message as string}>
            <input className="input" placeholder="Select event type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('eventType')}  />
          </Field>
          <Field label="Status" error={errors.status?.message as string}>
            <input className="input" placeholder="Select status" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}  />
          </Field>
          <Field label="Start At" error={errors.startAt?.message as string}>
            <input className="input" placeholder="Select start date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('startAt')} />
          </Field>
          <Field label="End At" error={errors.endAt?.message as string}>
            <input className="input" placeholder="Select end date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('endAt')} />
          </Field>
          <Field label="Is All Day" error={errors.isAllDay?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isAllDay')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Title" error={errors.title?.message as string}>
            <textarea className="input" placeholder="Enter event title" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('title')} rows={3} />
          </Field>
          <Field label="Occupant Name" error={errors.occupantName?.message as string}>
            <input className="input" placeholder="Enter occupant name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('occupantName')}  />
          </Field>
          <Field label="Occupant Count" error={errors.occupantCount?.message as string}>
            <input className="input" placeholder="Enter occupant count" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('occupantCount', { valueAsNumber: true })} />
          </Field>
          <Field label="Source System" error={errors.sourceSystem?.message as string}>
            <input className="input" placeholder="Enter source system" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('sourceSystem')}  />
          </Field>
          <Field label="Source Reference ID" error={errors.sourceReferenceID?.message as string}>
            <textarea className="input" placeholder="Enter source reference ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('sourceReferenceID')} rows={3} />
          </Field>
          <Field label="External Calendar ID" error={errors.externalCalendarID?.message as string}>
            <textarea className="input" placeholder="Enter external calendar ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('externalCalendarID')} rows={3} />
          </Field>
          <Field label="Blocks Availability" error={errors.blocksAvailability?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('blocksAvailability')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Notes" error={errors.notes?.message as string}>
            <textarea className="input" placeholder="Enter notes" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('notes')} rows={3} />
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

