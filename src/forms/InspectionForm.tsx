{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { Inspection } from '../types/Inspection';
import { createInspection, updateInspection } from '../apis/useInspection';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const inspectionSchema = z.object({
  propertyID: z.string().optional(),
  rentalUnitID: z.string().optional(),
  leaseID: z.string().optional(),
  leaseRenewalID: z.string().optional(),
  inspectionType: z.string().max(50, "Inspection Type must be less than 50 characters").min(1, "Inspection Type is required"),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(v as any), "Invalid Status"),
  scheduledFor: z.string().optional(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  overallCondition: z.string().max(50, "Overall Condition must be less than 50 characters").optional(),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
  capturedDate: z.string().optional(),
  capturedBy: z.string().max(100, "Captured By must be less than 100 characters").optional(),
  updatedDate: z.string().optional(),
  updatedBy: z.string().max(100, "Updated By must be less than 100 characters").optional(),
});

type InspectionFormData = z.infer<typeof inspectionSchema>;

interface InspectionFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialInspection?: Inspection | null;
  isEditMode?: boolean;
}

export default function InspectionForm({ onAlert, initialInspection = null, isEditMode = false }: InspectionFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_propertyID, setOpts_propertyID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_propertyID_loading, setOpts_propertyID_loading] = React.useState(false);
  const [opts_rentalUnitID, setOpts_rentalUnitID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_rentalUnitID_loading, setOpts_rentalUnitID_loading] = React.useState(false);
  const [opts_leaseID, setOpts_leaseID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseID_loading, setOpts_leaseID_loading] = React.useState(false);
  const [opts_leaseRenewalID, setOpts_leaseRenewalID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseRenewalID_loading, setOpts_leaseRenewalID_loading] = React.useState(false);

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

  async function loadOptions_propertyID(){
    try { setOpts_propertyID_loading(true);
      const url = "api/property/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'propertyID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["propertyName", "name", "propertyName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["propertyID", "propertyID", "id", "ID", "propertyID", "propertyId"], String(it))
      }));
      setOpts_propertyID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_propertyID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_propertyID(); }, []);

  async function loadOptions_rentalUnitID(){
    try { setOpts_rentalUnitID_loading(true);
      const url = "api/rentalunit/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'rentalUnitID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["unitNumber", "name", "rentalUnitName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["rentalUnitID", "rentalUnitID", "id", "ID", "rentalUnitID", "rentalUnitId"], String(it))
      }));
      setOpts_rentalUnitID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_rentalUnitID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_rentalUnitID(); }, []);

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

  const getDefaultValues = React.useCallback((): InspectionFormData => {
    const src = (initialInspection as any) ?? {};
    if (isEditMode && initialInspection) {
      return {
        propertyID: (src?.propertyID ?? ""),
        rentalUnitID: (src?.rentalUnitID ?? ""),
        leaseID: (src?.leaseID ?? ""),
        leaseRenewalID: (src?.leaseRenewalID ?? ""),
        inspectionType: (src?.inspectionType ?? ""),
        status: (src?.status ?? ""),
        scheduledFor: src?.scheduledFor ? new Date(src?.scheduledFor as any).toISOString().split('T')[0] : "",
        startedAt: src?.startedAt ? new Date(src?.startedAt as any).toISOString().split('T')[0] : "",
        completedAt: src?.completedAt ? new Date(src?.completedAt as any).toISOString().split('T')[0] : "",
        overallCondition: (src?.overallCondition ?? ""),
        notes: (src?.notes ?? ""),
        capturedDate: src?.capturedDate ? new Date(src?.capturedDate as any).toISOString().split('T')[0] : "",
        capturedBy: (src?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate: src?.updatedDate ? new Date(src?.updatedDate as any).toISOString().split('T')[0] : "",
        updatedBy: (src?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
    }
    return {
      propertyID: "",
      rentalUnitID: "",
      leaseID: "",
      leaseRenewalID: "",
      inspectionType: "",
      status: "SCHEDULED",
      scheduledFor: "",
      startedAt: "",
      completedAt: "",
      overallCondition: "",
      notes: "",
      capturedDate: new Date().toISOString().split('T')[0],
      capturedBy: ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim(),
      updatedDate: "",
      updatedBy: ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim(),
    };
  }, [isEditMode, initialInspection]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(inspectionSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialInspection && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialInspection, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialInspection && opts_propertyID.length > 0) {
      const currentpropertyID = (initialInspection as any)?.propertyID ;
      if (currentpropertyID !== undefined && currentpropertyID!== null) {
        const propertyIDValue = String(currentpropertyID);
        if (opts_propertyID.some(opt => opt.value === String(propertyIDValue))) {
          setValue('propertyID', propertyIDValue);
        }
      }
    }
  }, [opts_propertyID, isEditMode, initialInspection, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialInspection && opts_rentalUnitID.length > 0) {
      const currentrentalUnitID = (initialInspection as any)?.rentalUnitID ;
      if (currentrentalUnitID !== undefined && currentrentalUnitID!== null) {
        const rentalUnitIDValue = String(currentrentalUnitID);
        if (opts_rentalUnitID.some(opt => opt.value === String(rentalUnitIDValue))) {
          setValue('rentalUnitID', rentalUnitIDValue);
        }
      }
    }
  }, [opts_rentalUnitID, isEditMode, initialInspection, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialInspection && opts_leaseID.length > 0) {
      const currentleaseID = (initialInspection as any)?.leaseID ;
      if (currentleaseID !== undefined && currentleaseID!== null) {
        const leaseIDValue = String(currentleaseID);
        if (opts_leaseID.some(opt => opt.value === String(leaseIDValue))) {
          setValue('leaseID', leaseIDValue);
        }
      }
    }
  }, [opts_leaseID, isEditMode, initialInspection, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialInspection && opts_leaseRenewalID.length > 0) {
      const currentleaseRenewalID = (initialInspection as any)?.leaseRenewalID ;
      if (currentleaseRenewalID !== undefined && currentleaseRenewalID!== null) {
        const leaseRenewalIDValue = String(currentleaseRenewalID);
        if (opts_leaseRenewalID.some(opt => opt.value === String(leaseRenewalIDValue))) {
          setValue('leaseRenewalID', leaseRenewalIDValue);
        }
      }
    }
  }, [opts_leaseRenewalID, isEditMode, initialInspection, setValue]);

  const onSubmitHandler = async (data: InspectionFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} inspection...`, 'info');
      const payload: any = {
        inspectionID: (isEditMode ? ((initialInspection as any)?.inspectionID ?? null) : null),
        propertyID: data.propertyID ?? '',
        rentalUnitID: data.rentalUnitID ?? '',
        leaseID: data.leaseID ?? '',
        leaseRenewalID: data.leaseRenewalID ?? '',
        inspectionType: data.inspectionType ?? '',
        status: data.status ?? '',
        scheduledFor: data.scheduledFor || null,
        startedAt: data.startedAt || null,
        overallCondition: data.overallCondition ?? '',
        notes: data.notes ?? '',
        capturedDate: data.capturedDate || new Date().toISOString().split('T')[0],
        capturedBy: (data.capturedBy || ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate: data.updatedDate || null,
        updatedBy: (data.updatedBy || ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        completedAt: data.status === 'Completed'
          ? ((initialInspection as any)?.completedAt || new Date().toISOString().split('T')[0])
          : (initialInspection as any)?.completedAt || null,
      };
      let result: any;
      result = isEditMode ? await updateInspection(payload as Inspection) : await createInspection(payload as Inspection);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`Inspection "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/inspections');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit Inspection' : 'Create Inspection'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Property " error={errors.propertyID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('propertyID')}>
              <option value="">Select Property</option>
              {opts_propertyID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_propertyID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Rental Unit " error={errors.rentalUnitID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('rentalUnitID')}>
              <option value="">Select Rental Unit</option>
              {opts_rentalUnitID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_rentalUnitID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
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
          <Field label="Inspection Type" error={errors.inspectionType?.message as string}>
            <input className="input" placeholder="Enter inspection type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('inspectionType')}  />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </Field>
          <Field label="Scheduled For" error={errors.scheduledFor?.message as string}>
            <input className="input" placeholder="Select scheduled date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('scheduledFor')} />
          </Field>
          <Field label="Started At" error={errors.startedAt?.message as string}>
            <input className="input" placeholder="Select start date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('startedAt')} />
          </Field>
          <Field label="Completed At" error={errors.completedAt?.message as string}>
            <input className="input" placeholder="Select completion date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('completedAt')} />
          </Field>
          <Field label="Overall Condition" error={errors.overallCondition?.message as string}>
            <input className="input" placeholder="Enter overall condition" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('overallCondition')}  />
          </Field>
          <Field label="Notes" error={errors.notes?.message as string}>
            <textarea className="input" placeholder="Enter notes" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('notes')} rows={3} />
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

