{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { Lease } from '../types/Lease';
import { createLease, updateLease } from '../apis/useLease';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const leaseSchema = z.object({
  organizationID: z.string().min(1, "Organization is required"),
  listingID: z.string().min(1, "Listing is required"),
  rentalUnitID: z.string().min(1, "Rental Unit is required"),
  tenancyTypeID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Tenancy Type is required")),
  tenantID: z.string().min(1, "Tenant is required"),
  rentalApplicationID: z.string().optional(),
  leaseCode: z.string().max(50, "Lease Code must be less than 50 characters").min(1, "Lease Code is required"),
  leaseNumber: z.string().max(100, "Lease Number must be less than 100 characters").min(1, "Lease Number is required"),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["DRAFT", "PENDING_SIGNATURE", "ACTIVE", "EXPIRED", "TERMINATED", "RENEWED", "CANCELLED"].includes(v as any), "Invalid Status"),
  startDate: z.string(),
  endDate: z.string().optional(),
  leaseTermMonths: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  baseRentAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Base Rent Amount is required")),
  currency: z.string().max(3, "Currency must be less than 3 characters").min(1, "Currency is required"),
  gracePeriodDays: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Grace Period Days is required")),
  lateFeeFixedAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Late Fee Fixed Amount is required")),
  lateFeePercentage: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Late Fee Percentage is required")),
  autoRenew: z.boolean(),
  renewalNoticeDays: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  signedAt: z.string().optional(),
  activatedAt: z.string().optional(),
  actualMoveInAt: z.string().optional(),
  actualMoveOutAt: z.string().optional(),
  terminatedAt: z.string().optional(),
  terminationReason: z.string().max(256, "Termination Reason must be less than 256 characters").optional(),
});

type LeaseFormData = z.infer<typeof leaseSchema>;

interface LeaseFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialLease?: Lease | null;
  isEditMode?: boolean;
}

export default function LeaseForm({ onAlert, initialLease = null, isEditMode = false }: LeaseFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_organizationID, setOpts_organizationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_organizationID_loading, setOpts_organizationID_loading] = React.useState(false);
  const [opts_listingID, setOpts_listingID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_listingID_loading, setOpts_listingID_loading] = React.useState(false);
  const [opts_rentalUnitID, setOpts_rentalUnitID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_rentalUnitID_loading, setOpts_rentalUnitID_loading] = React.useState(false);
  const [opts_tenancyTypeID, setOpts_tenancyTypeID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_tenancyTypeID_loading, setOpts_tenancyTypeID_loading] = React.useState(false);
  const [opts_tenantID, setOpts_tenantID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_tenantID_loading, setOpts_tenantID_loading] = React.useState(false);
  const [opts_rentalApplicationID, setOpts_rentalApplicationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_rentalApplicationID_loading, setOpts_rentalApplicationID_loading] = React.useState(false);

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

  async function loadOptions_listingID(){
    try { setOpts_listingID_loading(true);
      const url = "api/listing/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'listingID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["title", "name", "listingName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_tenancyTypeID(){
    try { setOpts_tenancyTypeID_loading(true);
      const url = "api/tenancytype/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'tenancyTypeID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["", "name", "tenancyTypeName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["", "tenancyTypeID", "id", "ID", "tenancyTypeID", "tenancyTypeId"], String(it))
      }));
      setOpts_tenancyTypeID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_tenancyTypeID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_tenancyTypeID(); }, []);

  async function loadOptions_tenantID(){
    try { setOpts_tenantID_loading(true);
      const url = "api/tenant/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'tenantID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["lastName", "name", "tenantName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_rentalApplicationID(){
    try { setOpts_rentalApplicationID_loading(true);
      const url = "api/rentalapplication/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'rentalApplicationID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["", "name", "rentalApplicationName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["", "rentalApplicationID", "id", "ID", "rentalApplicationID", "rentalApplicationId"], String(it))
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

  const getDefaultValues = React.useCallback((): LeaseFormData => {
    const src = (initialLease as any) ?? {};
    if (isEditMode && initialLease) {
      return {
        organizationID: (src?.organizationID ?? ""),
        listingID: (src?.listingID ?? ""),
        rentalUnitID: (src?.rentalUnitID ?? ""),
        tenancyTypeID: (() => {
          if (src?.tenancyTypeID !== undefined && src?.tenancyTypeID !== null) {
            return Number(src.tenancyTypeID);
          }
          return 0;
        })(),
        tenantID: (src?.tenantID ?? ""),
        rentalApplicationID: (src?.rentalApplicationID ?? ""),
        leaseCode: (src?.leaseCode ?? ""),
        leaseNumber: (src?.leaseNumber ?? ""),
        status: (src?.status ?? ""),
        startDate: src?.startDate ? new Date(src?.startDate as any).toISOString().split('T')[0] : "",
        endDate: src?.endDate ? new Date(src?.endDate as any).toISOString().split('T')[0] : "",
        leaseTermMonths: (src?.leaseTermMonths ?? 0),
        baseRentAmount: (src?.baseRentAmount ?? 0),
        currency: (src?.currency ?? ""),
        gracePeriodDays: (src?.gracePeriodDays ?? 0),
        lateFeeFixedAmount: (src?.lateFeeFixedAmount ?? 0),
        lateFeePercentage: (src?.lateFeePercentage ?? 0),
        autoRenew: Boolean(src?.autoRenew),
        renewalNoticeDays: (src?.renewalNoticeDays ?? 0),
        signedAt: src?.signedAt ? new Date(src?.signedAt as any).toISOString().split('T')[0] : "",
        activatedAt: src?.activatedAt ? new Date(src?.activatedAt as any).toISOString().split('T')[0] : "",
        actualMoveInAt: src?.actualMoveInAt ? new Date(src?.actualMoveInAt as any).toISOString().split('T')[0] : "",
        actualMoveOutAt: src?.actualMoveOutAt ? new Date(src?.actualMoveOutAt as any).toISOString().split('T')[0] : "",
        terminatedAt: src?.terminatedAt ? new Date(src?.terminatedAt as any).toISOString().split('T')[0] : "",
        terminationReason: (src?.terminationReason ?? ""),
      };
    }
    return {
      organizationID: "",
      listingID: "",
      rentalUnitID: "",
      tenancyTypeID: 0,
      tenantID: "",
      rentalApplicationID: "",
      leaseCode: "",
      leaseNumber: "",
      status: "DRAFT",
      startDate: "",
      endDate: "",
      leaseTermMonths: 0,
      baseRentAmount: 0,
      currency: "",
      gracePeriodDays: 0,
      lateFeeFixedAmount: 0,
      lateFeePercentage: 0,
      autoRenew: false,
      renewalNoticeDays: 0,
      signedAt: "",
      activatedAt: "",
      actualMoveInAt: "",
      actualMoveOutAt: "",
      terminatedAt: "",
      terminationReason: "",
    };
  }, [isEditMode, initialLease]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(leaseSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialLease && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialLease, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLease && opts_organizationID.length > 0) {
      const currentorganizationID = (initialLease as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = Number(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialLease, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLease && opts_listingID.length > 0) {
      const currentlistingID = (initialLease as any)?.listingID ;
      if (currentlistingID !== undefined && currentlistingID!== null) {
        const listingIDValue = Number(currentlistingID);
        if (opts_listingID.some(opt => opt.value === String(listingIDValue))) {
          setValue('listingID', listingIDValue);
        }
      }
    }
  }, [opts_listingID, isEditMode, initialLease, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLease && opts_rentalUnitID.length > 0) {
      const currentrentalUnitID = (initialLease as any)?.rentalUnitID ;
      if (currentrentalUnitID !== undefined && currentrentalUnitID!== null) {
        const rentalUnitIDValue = Number(currentrentalUnitID);
        if (opts_rentalUnitID.some(opt => opt.value === String(rentalUnitIDValue))) {
          setValue('rentalUnitID', rentalUnitIDValue);
        }
      }
    }
  }, [opts_rentalUnitID, isEditMode, initialLease, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLease && opts_tenancyTypeID.length > 0) {
      const currenttenancyTypeID = (initialLease as any)?.tenancyTypeID ;
      if (currenttenancyTypeID !== undefined && currenttenancyTypeID!== null) {
        const tenancyTypeIDValue = Number(currenttenancyTypeID);
        if (opts_tenancyTypeID.some(opt => opt.value === String(tenancyTypeIDValue))) {
          setValue('tenancyTypeID', tenancyTypeIDValue);
        }
      }
    }
  }, [opts_tenancyTypeID, isEditMode, initialLease, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLease && opts_tenantID.length > 0) {
      const currenttenantID = (initialLease as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = Number(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialLease, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLease && opts_rentalApplicationID.length > 0) {
      const currentrentalApplicationID = (initialLease as any)?.rentalApplicationID ;
      if (currentrentalApplicationID !== undefined && currentrentalApplicationID!== null) {
        const rentalApplicationIDValue = Number(currentrentalApplicationID);
        if (opts_rentalApplicationID.some(opt => opt.value === String(rentalApplicationIDValue))) {
          setValue('rentalApplicationID', rentalApplicationIDValue);
        }
      }
    }
  }, [opts_rentalApplicationID, isEditMode, initialLease, setValue]);

  const onSubmitHandler = async (data: LeaseFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} lease...`, 'info');
      const payload: any = {
        leaseID: (isEditMode ? ((initialLease as any)?.leaseID ?? null) : null),
        organizationID: data.organizationID ?? '',
        listingID: data.listingID ?? '',
        rentalUnitID: data.rentalUnitID ?? '',
        tenancyTypeID: (data.tenancyTypeID === 0 || data.tenancyTypeID === undefined || data.tenancyTypeID === null) ? 0 : Number(data.tenancyTypeID),
        tenantID: data.tenantID ?? '',
        rentalApplicationID: data.rentalApplicationID ?? '',
        leaseCode: data.leaseCode ?? '',
        leaseNumber: data.leaseNumber ?? '',
        status: data.status ?? '',
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        leaseTermMonths: data.leaseTermMonths,
        baseRentAmount: data.baseRentAmount,
        currency: data.currency ?? '',
        gracePeriodDays: data.gracePeriodDays,
        lateFeeFixedAmount: data.lateFeeFixedAmount,
        lateFeePercentage: data.lateFeePercentage,
        autoRenew: data.autoRenew,
        renewalNoticeDays: data.renewalNoticeDays,
        signedAt: data.signedAt || null,
        activatedAt: data.activatedAt || null,
        actualMoveInAt: data.actualMoveInAt || null,
        actualMoveOutAt: data.actualMoveOutAt || null,
        terminatedAt: data.terminatedAt || null,
        terminationReason: data.terminationReason ?? '',
        capturedDate : (isEditMode ? ((initialLease as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialLease as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialLease as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialLease as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateLease(payload as Lease) : await createLease(payload as Lease);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`Lease "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/leases');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit Lease' : 'Create Lease'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Organization *" error={errors.organizationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationID')}>
              <option value="">Select Organization</option>
              {opts_organizationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Listing *" error={errors.listingID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('listingID')}>
              <option value="">Select Listing</option>
              {opts_listingID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_listingID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Rental Unit *" error={errors.rentalUnitID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('rentalUnitID')}>
              <option value="">Select Rental Unit</option>
              {opts_rentalUnitID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_rentalUnitID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Tenancy Type *" error={errors.tenancyTypeID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenancyTypeID')}>
              <option value="">Select Tenancy Type</option>
              {opts_tenancyTypeID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenancyTypeID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Tenant *" error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Rental Application " error={errors.rentalApplicationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('rentalApplicationID')}>
              <option value="">Select Rental Application</option>
              {opts_rentalApplicationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_rentalApplicationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Lease Code" error={errors.leaseCode?.message as string}>
            <input className="input" placeholder="Enter lease code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('leaseCode')}  />
          </Field>
          <Field label="Lease Number" error={errors.leaseNumber?.message as string}>
            <input className="input" placeholder="Enter lease number" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('leaseNumber')}  />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="PENDING_SIGNATURE">PENDING_SIGNATURE</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="EXPIRED">EXPIRED</option>
              <option value="TERMINATED">TERMINATED</option>
              <option value="RENEWED">RENEWED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </Field>
          <Field label="Start Date" error={errors.startDate?.message as string}>
            <input className="input" placeholder="Select start date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('startDate')} />
          </Field>
          <Field label="End Date" error={errors.endDate?.message as string}>
            <input className="input" placeholder="Select end date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('endDate')} />
          </Field>
          <Field label="Lease Term Months" error={errors.leaseTermMonths?.message as string}>
            <input className="input" placeholder="Enter lease term in months" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('leaseTermMonths', { valueAsNumber: true })} />
          </Field>
          <Field label="Base Rent Amount" error={errors.baseRentAmount?.message as string}>
            <input className="input" placeholder="Enter base rent amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('baseRentAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Currency" error={errors.currency?.message as string}>
            <input className="input" placeholder="Enter currency code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}  />
          </Field>
          <Field label="Grace Period Days" error={errors.gracePeriodDays?.message as string}>
            <input className="input" placeholder="Enter grace period days" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('gracePeriodDays', { valueAsNumber: true })} />
          </Field>
          <Field label="Late Fee Fixed Amount" error={errors.lateFeeFixedAmount?.message as string}>
            <input className="input" placeholder="Enter late fee fixed amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('lateFeeFixedAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Late Fee Percentage" error={errors.lateFeePercentage?.message as string}>
            <input className="input" placeholder="Enter late fee percentage" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('lateFeePercentage', { valueAsNumber: true })} />
          </Field>
          <Field label="Auto Renew *" error={errors.autoRenew?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('autoRenew')}>
              <option value="">Select Auto Renew</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </Field>
          <Field label="Renewal Notice Days" error={errors.renewalNoticeDays?.message as string}>
            <input className="input" placeholder="Enter renewal notice days" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('renewalNoticeDays', { valueAsNumber: true })} />
          </Field>
          <Field label="Signed At" error={errors.signedAt?.message as string}>
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('signedAt')} />
          </Field>
          <Field label="Activated At" error={errors.activatedAt?.message as string}>
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('activatedAt')} />
          </Field>
          <Field label="Actual Move In At" error={errors.actualMoveInAt?.message as string}>
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('actualMoveInAt')} />
          </Field>
          <Field label="Actual Move Out At" error={errors.actualMoveOutAt?.message as string}>
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('actualMoveOutAt')} />
          </Field>
          <Field label="Terminated At" error={errors.terminatedAt?.message as string}>
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('terminatedAt')} />
          </Field>
          <Field label="Termination Reason" error={errors.terminationReason?.message as string}>
            <textarea className="input" placeholder="Enter termination reason" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('terminationReason')} rows={3} />
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

