{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { Property } from '../types/Property';
import { createProperty, updateProperty } from '../apis/useProperty';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const propertySchema = z.object({
  organizationID: z.string().min(1, "Organization ID is required"),
  addressID: z.string().min(1, "Address ID is required"),
  name: z.string().max(100, "Name must be less than 100 characters").optional(),
  propertyType: z.string().max(50, "Property Type must be less than 50 characters").min(1, "Property Type is required").refine(v => (v ?? '') === '' || ["HOUSE", "CONDO", "APARTMENT_BUILDING", "BASEMENT_SUITE", "TOWNHOUSE", "DUPLEX", "COMMERCIAL", "OTHER"].includes(v as any), "Invalid Property Type"),
  yearBuilt: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  timeZone: z.string().max(100, "Time Zone must be less than 100 characters").min(1, "Time Zone is required"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["ACTIVE", "INACTIVE", "MAINTENANCE", "ARCHIVED"].includes(v as any), "Invalid Status"),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialProperty?: Property | null;
  isEditMode?: boolean;
}

export default function PropertyForm({ onAlert, initialProperty = null, isEditMode = false }: PropertyFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_organizationID, setOpts_organizationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_organizationID_loading, setOpts_organizationID_loading] = React.useState(false);
  const [opts_addressID, setOpts_addressID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_addressID_loading, setOpts_addressID_loading] = React.useState(false);

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

  async function loadOptions_addressID(){
    try { setOpts_addressID_loading(true);
      const url = "api/address/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'addressID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["", "name", "addressName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["", "addressID", "id", "ID", "addressID", "addressId"], String(it))
      }));
      setOpts_addressID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_addressID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_addressID(); }, []);

  const getDefaultValues = React.useCallback((): PropertyFormData => {
    const src = (initialProperty as any) ?? {};
    if (isEditMode && initialProperty) {
      return {
        organizationID: (src?.organizationID ?? ""),
        addressID: (src?.addressID ?? ""),
        name: (src?.name ?? ""),
        propertyType: (src?.propertyType ?? ""),
        yearBuilt: (src?.yearBuilt ?? 0),
        timeZone: (src?.timeZone ?? ""),
        description: (src?.description ?? ""),
        status: (src?.status ?? ""),
      };
    }
    return {
      organizationID: "",
      addressID: "",
      name: "",
      propertyType: "",
      yearBuilt: 0,
      timeZone: "",
      description: "",
      status: "ACTIVE",
    };
  }, [isEditMode, initialProperty]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(propertySchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialProperty && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialProperty, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialProperty && opts_organizationID.length > 0) {
      const currentorganizationID = (initialProperty as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = Number(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialProperty, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialProperty && opts_addressID.length > 0) {
      const currentaddressID = (initialProperty as any)?.addressID ;
      if (currentaddressID !== undefined && currentaddressID!== null) {
        const addressIDValue = Number(currentaddressID);
        if (opts_addressID.some(opt => opt.value === String(addressIDValue))) {
          setValue('addressID', addressIDValue);
        }
      }
    }
  }, [opts_addressID, isEditMode, initialProperty, setValue]);

  const onSubmitHandler = async (data: PropertyFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} property...`, 'info');
      const payload: any = {
        propertyID: (isEditMode ? ((initialProperty as any)?.propertyID ?? null) : null),
        organizationID: data.organizationID ?? '',
        addressID: data.addressID ?? '',
        name: data.name ?? '',
        propertyType: data.propertyType ?? '',
        yearBuilt: data.yearBuilt,
        timeZone: data.timeZone ?? '',
        description: data.description ?? '',
        status: data.status ?? '',
        capturedDate : (isEditMode ? ((initialProperty as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialProperty as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialProperty as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialProperty as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateProperty(payload as Property) : await createProperty(payload as Property);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`Property "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/properties');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit Property' : 'Create Property'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Organization ID *" error={errors.organizationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationID')}>
              <option value="">Select Organization ID</option>
              {opts_organizationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Address ID *" error={errors.addressID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('addressID')}>
              <option value="">Select Address ID</option>
              {opts_addressID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_addressID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Name" error={errors.name?.message as string}>
            <input className="input" placeholder="Enter property name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('name')}  />
          </Field>
          <Field label="Property Type *" error={errors.propertyType?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('propertyType')}>
              <option value="">Select Property Type</option>
              <option value="HOUSE">HOUSE</option>
              <option value="CONDO">CONDO</option>
              <option value="APARTMENT_BUILDING">APARTMENT_BUILDING</option>
              <option value="BASEMENT_SUITE">BASEMENT_SUITE</option>
              <option value="TOWNHOUSE">TOWNHOUSE</option>
              <option value="DUPLEX">DUPLEX</option>
              <option value="COMMERCIAL">COMMERCIAL</option>
              <option value="OTHER">OTHER</option>
            </select>
          </Field>
          <Field label="Year Built" error={errors.yearBuilt?.message as string}>
            <input className="input" placeholder="Enter year built" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('yearBuilt', { valueAsNumber: true })} />
          </Field>
          <Field label="Time Zone" error={errors.timeZone?.message as string}>
            <input className="input" placeholder="Enter time zone" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('timeZone')}  />
          </Field>
          <Field label="Description" error={errors.description?.message as string}>
            <textarea className="input" placeholder="Enter description" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('description')} rows={3} />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
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

