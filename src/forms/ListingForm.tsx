{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { Listing } from '../types/Listing';
import { createListing, updateListing } from '../apis/useListing';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const listingSchema = z.object({
  rentalUnitID: z.string().min(1, "Rental Unit is required"),
  listingTypeID: z.string().min(1, "Listing Type is required"),
  organizationID: z.string().min(1, "Organization is required"),
  title: z.string().max(200, "Title must be less than 200 characters").min(1, "Title is required"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  checkInDoorCode: z.string().max(10, "Check-In Door Code must be less than 10 characters").optional(),
  bedrooms: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  bathrooms: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  squareFeet: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  baseMonthlyRentAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Base Monthly Rent is required")),
  securityDepositAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Security Deposit is required")),
  yearBuilt: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Year Built is required")),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["DRAFT", "PUBLISHED", "PAUSED", "UNPUBLISHED", "ARCHIVED"].includes(v as any), "Invalid Status"),
  publishedAt: z.string().optional(),
  unpublishedAt: z.string().optional(),
  currency: z.string().max(3, "Currency must be less than 3 characters").min(1, "Currency is required"),
  availableFrom: z.string().optional(),
  availableTo: z.string().optional(),
  minimumLeaseMonths: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Minimum Lease Months is required")),
  maximumLeaseMonths: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Maximum Lease Months is required")),
  applicationDeadline: z.string().optional(),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").min(1, "Notes is required"),
  wIFINetwork: z.string().max(50, "WiFi Network must be less than 50 characters").optional(),
  acceptingApplications: z.boolean(),
});

type ListingFormData = z.infer<typeof listingSchema>;

interface ListingFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialListing?: Listing | null;
  isEditMode?: boolean;
}

export default function ListingForm({ onAlert, initialListing = null, isEditMode = false }: ListingFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_rentalUnitID, setOpts_rentalUnitID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_rentalUnitID_loading, setOpts_rentalUnitID_loading] = React.useState(false);
  const [opts_listingTypeID, setOpts_listingTypeID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_listingTypeID_loading, setOpts_listingTypeID_loading] = React.useState(false);
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

  async function loadOptions_rentalUnitID(){
    try { setOpts_rentalUnitID_loading(true);
      const url = "api/rentalunit/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'rentalUnitID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["title", "name", "rentalUnitName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_listingTypeID(){
    try { setOpts_listingTypeID_loading(true);
      const url = "api/listingtype/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'listingTypeID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "listingTypeName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["listingTypeID", "listingTypeID", "id", "ID", "listingTypeID", "listingTypeId"], String(it))
      }));
      setOpts_listingTypeID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_listingTypeID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_listingTypeID(); }, []);

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

  const getDefaultValues = React.useCallback((): ListingFormData => {
    const src = (initialListing as any) ?? {};
    if (isEditMode && initialListing) {
      return {
        rentalUnitID: (src?.rentalUnitID ?? ""),
        listingTypeID: (src?.listingTypeID ?? ""),
        organizationID: (src?.organizationID ?? ""),
        title: (src?.title ?? ""),
        description: (src?.description ?? ""),
        checkInDoorCode: (src?.checkInDoorCode ?? ""),
        bedrooms: (src?.bedrooms ?? 0),
        bathrooms: (src?.bathrooms ?? 0),
        squareFeet: (src?.squareFeet ?? 0),
        baseMonthlyRentAmount: (src?.baseMonthlyRentAmount ?? 0),
        securityDepositAmount: (src?.securityDepositAmount ?? 0),
        yearBuilt: (src?.yearBuilt ?? 0),
        status: (src?.status ?? ""),
        publishedAt: src?.publishedAt ? new Date(src?.publishedAt as any).toISOString().split('T')[0] : "",
        unpublishedAt: src?.unpublishedAt ? new Date(src?.unpublishedAt as any).toISOString().split('T')[0] : "",
        currency: (src?.currency ?? ""),
        availableFrom: src?.availableFrom ? new Date(src?.availableFrom as any).toISOString().split('T')[0] : "",
        availableTo: src?.availableTo ? new Date(src?.availableTo as any).toISOString().split('T')[0] : "",
        minimumLeaseMonths: (src?.minimumLeaseMonths ?? 0),
        maximumLeaseMonths: (src?.maximumLeaseMonths ?? 0),
        applicationDeadline: src?.applicationDeadline ? new Date(src?.applicationDeadline as any).toISOString().split('T')[0] : "",
        notes: (src?.notes ?? ""),
        wIFINetwork: (src?.wIFINetwork ?? ""),
        acceptingApplications: Boolean(src?.acceptingApplications),
      };
    }
    return {
      rentalUnitID: "",
      listingTypeID: "",
      organizationID: "",
      title: "",
      description: "",
      checkInDoorCode: "",
      bedrooms: 0,
      bathrooms: 0,
      squareFeet: 0,
      baseMonthlyRentAmount: 0,
      securityDepositAmount: 0,
      yearBuilt: 0,
      status: "DRAFT",
      publishedAt: "",
      unpublishedAt: "",
      currency: "",
      availableFrom: "",
      availableTo: "",
      minimumLeaseMonths: 0,
      maximumLeaseMonths: 0,
      applicationDeadline: "",
      notes: "",
      wIFINetwork: "",
      acceptingApplications: false,
    };
  }, [isEditMode, initialListing]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(listingSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialListing && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialListing, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialListing && opts_rentalUnitID.length > 0) {
      const currentrentalUnitID = (initialListing as any)?.rentalUnitID ;
      if (currentrentalUnitID !== undefined && currentrentalUnitID!== null) {
        const rentalUnitIDValue = Number(currentrentalUnitID);
        if (opts_rentalUnitID.some(opt => opt.value === String(rentalUnitIDValue))) {
          setValue('rentalUnitID', rentalUnitIDValue);
        }
      }
    }
  }, [opts_rentalUnitID, isEditMode, initialListing, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialListing && opts_listingTypeID.length > 0) {
      const currentlistingTypeID = (initialListing as any)?.listingTypeID ;
      if (currentlistingTypeID !== undefined && currentlistingTypeID!== null) {
        const listingTypeIDValue = Number(currentlistingTypeID);
        if (opts_listingTypeID.some(opt => opt.value === String(listingTypeIDValue))) {
          setValue('listingTypeID', listingTypeIDValue);
        }
      }
    }
  }, [opts_listingTypeID, isEditMode, initialListing, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialListing && opts_organizationID.length > 0) {
      const currentorganizationID = (initialListing as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = Number(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialListing, setValue]);

  const onSubmitHandler = async (data: ListingFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} listing...`, 'info');
      const payload: any = {
        listingID: (isEditMode ? ((initialListing as any)?.listingID ?? null) : null),
        rentalUnitID: data.rentalUnitID ?? '',
        listingTypeID: data.listingTypeID ?? '',
        organizationID: data.organizationID ?? '',
        title: data.title ?? '',
        description: data.description ?? '',
        checkInDoorCode: data.checkInDoorCode ?? '',
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        squareFeet: data.squareFeet,
        baseMonthlyRentAmount: data.baseMonthlyRentAmount,
        securityDepositAmount: data.securityDepositAmount,
        yearBuilt: data.yearBuilt,
        status: data.status ?? '',
        publishedAt: data.publishedAt || null,
        unpublishedAt: data.unpublishedAt || null,
        currency: data.currency ?? '',
        availableFrom: data.availableFrom || null,
        availableTo: data.availableTo || null,
        minimumLeaseMonths: data.minimumLeaseMonths,
        maximumLeaseMonths: data.maximumLeaseMonths,
        applicationDeadline: data.applicationDeadline || null,
        notes: data.notes ?? '',
        wIFINetwork: data.wIFINetwork ?? '',
        wIFIPassword: data.wIFIPassword ?? '',
        acceptingApplications: data.acceptingApplications,
        capturedBy: (isEditMode ? ((initialListing as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        capturedDate : (isEditMode ? ((initialListing as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        updatedDate : (isEditMode ? ((initialListing as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialListing as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateListing(payload as Listing) : await createListing(payload as Listing);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`Listing "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/listings');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit Listing' : 'Create Listing'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Rental Unit *" error={errors.rentalUnitID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('rentalUnitID')}>
              <option value="">Select Rental Unit</option>
              {opts_rentalUnitID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_rentalUnitID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Listing Type *" error={errors.listingTypeID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('listingTypeID')}>
              <option value="">Select Listing Type</option>
              {opts_listingTypeID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_listingTypeID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Organization *" error={errors.organizationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationID')}>
              <option value="">Select Organization</option>
              {opts_organizationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Title" error={errors.title?.message as string}>
            <input className="input" placeholder="Enter title" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('title')}  />
          </Field>
          <Field label="Description" error={errors.description?.message as string}>
            <textarea className="input" placeholder="Enter description" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('description')} rows={3} />
          </Field>
          <Field label="Check-In Door Code" error={errors.checkInDoorCode?.message as string}>
            <input className="input" placeholder="Enter door code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('checkInDoorCode')}  />
          </Field>
          <Field label="Bedrooms" error={errors.bedrooms?.message as string}>
            <input className="input" placeholder="Enter number of bedrooms" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('bedrooms', { valueAsNumber: true })} />
          </Field>
          <Field label="Bathrooms" error={errors.bathrooms?.message as string}>
            <input className="input" placeholder="Enter number of bathrooms" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('bathrooms', { valueAsNumber: true })} />
          </Field>
          <Field label="Square Feet" error={errors.squareFeet?.message as string}>
            <input className="input" placeholder="Enter size in square feet" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('squareFeet', { valueAsNumber: true })} />
          </Field>
          <Field label="Base Monthly Rent" error={errors.baseMonthlyRentAmount?.message as string}>
            <input className="input" placeholder="Enter base monthly rent" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('baseMonthlyRentAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Security Deposit" error={errors.securityDepositAmount?.message as string}>
            <input className="input" placeholder="Enter security deposit amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('securityDepositAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Year Built" error={errors.yearBuilt?.message as string}>
            <input className="input" placeholder="Enter year built" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('yearBuilt', { valueAsNumber: true })} />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="PAUSED">PAUSED</option>
              <option value="UNPUBLISHED">UNPUBLISHED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </Field>
          <Field label="Published At" error={errors.publishedAt?.message as string}>
            <input className="input" placeholder="Select publish date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('publishedAt')} />
          </Field>
          <Field label="Unpublished At" error={errors.unpublishedAt?.message as string}>
            <input className="input" placeholder="Select unpublish date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('unpublishedAt')} />
          </Field>
          <Field label="Currency" error={errors.currency?.message as string}>
            <input className="input" placeholder="Enter currency code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}  />
          </Field>
          <Field label="Available From" error={errors.availableFrom?.message as string}>
            <input className="input" placeholder="Select available from date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('availableFrom')} />
          </Field>
          <Field label="Available To" error={errors.availableTo?.message as string}>
            <input className="input" placeholder="Select available to date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('availableTo')} />
          </Field>
          <Field label="Minimum Lease Months" error={errors.minimumLeaseMonths?.message as string}>
            <input className="input" placeholder="Enter minimum lease months" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('minimumLeaseMonths', { valueAsNumber: true })} />
          </Field>
          <Field label="Maximum Lease Months" error={errors.maximumLeaseMonths?.message as string}>
            <input className="input" placeholder="Enter maximum lease months" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('maximumLeaseMonths', { valueAsNumber: true })} />
          </Field>
          <Field label="Application Deadline" error={errors.applicationDeadline?.message as string}>
            <input className="input" placeholder="Select application deadline" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('applicationDeadline')} />
          </Field>
          <Field label="Notes" error={errors.notes?.message as string}>
            <textarea className="input" placeholder="Enter notes" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('notes')} rows={3} />
          </Field>
          <Field label="WiFi Network" error={errors.wIFINetwork?.message as string}>
            <input className="input" placeholder="Enter WiFi network name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('wIFINetwork')}  />
          </Field>
          <Field label="Accepting Applications" error={errors.acceptingApplications?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('acceptingApplications')} />
              <span>Yes</span>
            </label>
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

