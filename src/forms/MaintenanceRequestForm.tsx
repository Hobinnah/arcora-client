{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { MaintenanceRequest } from '../types/MaintenanceRequest';
import { createMaintenanceRequest, updateMaintenanceRequest } from '../apis/useMaintenanceRequest';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const maintenanceRequestSchema = z.object({
  propertyID: z.string().optional(),
  rentalUnitID: z.string().optional(),
  listingID: z.string().optional(),
  leaseID: z.string().optional(),
  leaseRenewalID: z.string().optional(),
  submittedByTenantID: z.string().optional(),
  categoryID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Category is required")),
  priority: z.string().max(50, "Priority must be less than 50 characters").min(1, "Priority is required").refine(v => (v ?? '') === '' || ["LOW", "NORMAL", "HIGH", "URGENT"].includes(v as any), "Invalid Priority"),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["OPEN", "ACKNOWLEDGED", "SCHEDULED", "COMPLETED", "CANCELLED"].includes(v as any), "Invalid Status"),
  title: z.string().max(200, "Title must be less than 200 characters").min(1, "Title is required"),
  description: z.string().max(1000, "Description must be less than 1000 characters").min(1, "Description is required"),
  permissionToEnter: z.boolean().optional(),
  submittedAt: z.string(),
  acknowledgedAt: z.string().optional(),
  scheduledAt: z.string().optional(),
  completedAt: z.string().optional(),
  cancelledAt: z.string().optional(),
  capturedDate: z.string().optional(),
  capturedBy: z.string().max(100, "Captured By must be less than 100 characters").optional(),
  updatedDate: z.string().optional(),
  updatedBy: z.string().max(100, "Updated By must be less than 100 characters").optional(),
});

type MaintenanceRequestFormData = z.infer<typeof maintenanceRequestSchema>;

interface MaintenanceRequestFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialMaintenanceRequest?: MaintenanceRequest | null;
  isEditMode?: boolean;
}

export default function MaintenanceRequestForm({ onAlert, initialMaintenanceRequest = null, isEditMode = false }: MaintenanceRequestFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_propertyID, setOpts_propertyID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_propertyID_loading, setOpts_propertyID_loading] = React.useState(false);
  const [opts_rentalUnitID, setOpts_rentalUnitID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_rentalUnitID_loading, setOpts_rentalUnitID_loading] = React.useState(false);
  const [opts_listingID, setOpts_listingID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_listingID_loading, setOpts_listingID_loading] = React.useState(false);
  const [opts_leaseID, setOpts_leaseID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseID_loading, setOpts_leaseID_loading] = React.useState(false);
  const [opts_leaseRenewalID, setOpts_leaseRenewalID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseRenewalID_loading, setOpts_leaseRenewalID_loading] = React.useState(false);
  const [opts_submittedByTenantID, setOpts_submittedByTenantID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_submittedByTenantID_loading, setOpts_submittedByTenantID_loading] = React.useState(false);
  const [opts_categoryID, setOpts_categoryID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_categoryID_loading, setOpts_categoryID_loading] = React.useState(false);

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

  async function loadOptions_listingID(){
    try { setOpts_listingID_loading(true);
      const url = "api/listing/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'listingID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["listingName", "name", "listingName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_submittedByTenantID(){
    try { setOpts_submittedByTenantID_loading(true);
      const url = "api/tenant/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'submittedByTenantID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["tenantName", "name", "submittedByTenantName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["tenantID", "tenantID", "id", "ID", "submittedByTenantID", "submittedByTenantId"], String(it))
      }));
      setOpts_submittedByTenantID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_submittedByTenantID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_submittedByTenantID(); }, []);

  async function loadOptions_categoryID(){
    try { setOpts_categoryID_loading(true);
      const url = "api/category/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'categoryID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "categoryName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["categoryID", "categoryID", "id", "ID", "categoryID", "categoryId"], String(it))
      }));
      setOpts_categoryID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_categoryID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_categoryID(); }, []);

  const getDefaultValues = React.useCallback((): MaintenanceRequestFormData => {
    const src = (initialMaintenanceRequest as any) ?? {};
    if (isEditMode && initialMaintenanceRequest) {
      return {
        propertyID: (src?.propertyID ?? ""),
        rentalUnitID: (src?.rentalUnitID ?? ""),
        listingID: (src?.listingID ?? ""),
        leaseID: (src?.leaseID ?? ""),
        leaseRenewalID: (src?.leaseRenewalID ?? ""),
        submittedByTenantID: (src?.submittedByTenantID ?? ""),
        categoryID: (() => {
          if (src?.categoryID !== undefined && src?.categoryID !== null) {
            return Number(src.categoryID);
          }
          return 0;
        })(),
        priority: (src?.priority ?? ""),
        status: (src?.status ?? ""),
        title: (src?.title ?? ""),
        description: (src?.description ?? ""),
        permissionToEnter: Boolean(src?.permissionToEnter),
        submittedAt: src?.submittedAt ? new Date(src?.submittedAt as any).toISOString().split('T')[0] : "",
        acknowledgedAt: src?.acknowledgedAt ? new Date(src?.acknowledgedAt as any).toISOString().split('T')[0] : "",
        scheduledAt: src?.scheduledAt ? new Date(src?.scheduledAt as any).toISOString().split('T')[0] : "",
        completedAt: src?.completedAt ? new Date(src?.completedAt as any).toISOString().split('T')[0] : "",
        cancelledAt: src?.cancelledAt ? new Date(src?.cancelledAt as any).toISOString().split('T')[0] : "",
        capturedDate: src?.capturedDate ? new Date(src?.capturedDate as any).toISOString().split('T')[0] : "",
        capturedBy: (src?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate: src?.updatedDate ? new Date(src?.updatedDate as any).toISOString().split('T')[0] : "",
        updatedBy: (src?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
    }
    return {
      propertyID: "",
      rentalUnitID: "",
      listingID: "",
      leaseID: "",
      leaseRenewalID: "",
      submittedByTenantID: "",
      categoryID: 0,
      priority: "",
      status: "OPEN",
      title: "",
      description: "",
      permissionToEnter: false,
      submittedAt: "",
      acknowledgedAt: "",
      scheduledAt: "",
      completedAt: "",
      cancelledAt: "",
      capturedDate: new Date().toISOString().split('T')[0],
      capturedBy: ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim(),
      updatedDate: "",
      updatedBy: ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim(),
    };
  }, [isEditMode, initialMaintenanceRequest]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(maintenanceRequestSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialMaintenanceRequest && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialMaintenanceRequest, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialMaintenanceRequest && opts_propertyID.length > 0) {
      const currentpropertyID = (initialMaintenanceRequest as any)?.propertyID ;
      if (currentpropertyID !== undefined && currentpropertyID!== null) {
        const propertyIDValue = String(currentpropertyID);
        if (opts_propertyID.some(opt => opt.value === String(propertyIDValue))) {
          setValue('propertyID', propertyIDValue);
        }
      }
    }
  }, [opts_propertyID, isEditMode, initialMaintenanceRequest, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialMaintenanceRequest && opts_rentalUnitID.length > 0) {
      const currentrentalUnitID = (initialMaintenanceRequest as any)?.rentalUnitID ;
      if (currentrentalUnitID !== undefined && currentrentalUnitID!== null) {
        const rentalUnitIDValue = String(currentrentalUnitID);
        if (opts_rentalUnitID.some(opt => opt.value === String(rentalUnitIDValue))) {
          setValue('rentalUnitID', rentalUnitIDValue);
        }
      }
    }
  }, [opts_rentalUnitID, isEditMode, initialMaintenanceRequest, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialMaintenanceRequest && opts_listingID.length > 0) {
      const currentlistingID = (initialMaintenanceRequest as any)?.listingID ;
      if (currentlistingID !== undefined && currentlistingID!== null) {
        const listingIDValue = String(currentlistingID);
        if (opts_listingID.some(opt => opt.value === String(listingIDValue))) {
          setValue('listingID', listingIDValue);
        }
      }
    }
  }, [opts_listingID, isEditMode, initialMaintenanceRequest, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialMaintenanceRequest && opts_leaseID.length > 0) {
      const currentleaseID = (initialMaintenanceRequest as any)?.leaseID ;
      if (currentleaseID !== undefined && currentleaseID!== null) {
        const leaseIDValue = String(currentleaseID);
        if (opts_leaseID.some(opt => opt.value === String(leaseIDValue))) {
          setValue('leaseID', leaseIDValue);
        }
      }
    }
  }, [opts_leaseID, isEditMode, initialMaintenanceRequest, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialMaintenanceRequest && opts_leaseRenewalID.length > 0) {
      const currentleaseRenewalID = (initialMaintenanceRequest as any)?.leaseRenewalID ;
      if (currentleaseRenewalID !== undefined && currentleaseRenewalID!== null) {
        const leaseRenewalIDValue = String(currentleaseRenewalID);
        if (opts_leaseRenewalID.some(opt => opt.value === String(leaseRenewalIDValue))) {
          setValue('leaseRenewalID', leaseRenewalIDValue);
        }
      }
    }
  }, [opts_leaseRenewalID, isEditMode, initialMaintenanceRequest, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialMaintenanceRequest && opts_submittedByTenantID.length > 0) {
      const currentsubmittedByTenantID = (initialMaintenanceRequest as any)?.submittedByTenantID ;
      if (currentsubmittedByTenantID !== undefined && currentsubmittedByTenantID!== null) {
        const submittedByTenantIDValue = String(currentsubmittedByTenantID);
        if (opts_submittedByTenantID.some(opt => opt.value === String(submittedByTenantIDValue))) {
          setValue('submittedByTenantID', submittedByTenantIDValue);
        }
      }
    }
  }, [opts_submittedByTenantID, isEditMode, initialMaintenanceRequest, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialMaintenanceRequest && opts_categoryID.length > 0) {
      const currentcategoryID = (initialMaintenanceRequest as any)?.categoryID ;
      if (currentcategoryID !== undefined && currentcategoryID!== null) {
        const categoryIDValue = String(currentcategoryID);
        if (opts_categoryID.some(opt => opt.value === String(categoryIDValue))) {
          setValue('categoryID', categoryIDValue);
        }
      }
    }
  }, [opts_categoryID, isEditMode, initialMaintenanceRequest, setValue]);

  const onSubmitHandler = async (data: MaintenanceRequestFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} maintenancerequest...`, 'info');
      const payload: any = {
        maintenanceRequestID: (isEditMode ? ((initialMaintenanceRequest as any)?.maintenanceRequestID ?? null) : null),
        propertyID: data.propertyID ?? '',
        rentalUnitID: data.rentalUnitID ?? '',
        listingID: data.listingID ?? '',
        leaseID: data.leaseID ?? '',
        leaseRenewalID: data.leaseRenewalID ?? '',
        submittedByTenantID: data.submittedByTenantID ?? '',
        categoryID: (data.categoryID === 0 || data.categoryID === undefined || data.categoryID === null) ? 0 : Number(data.categoryID),
        priority: data.priority ?? '',
        status: data.status ?? '',
        title: data.title ?? '',
        description: data.description ?? '',
        permissionToEnter: data.permissionToEnter,
        submittedAt: data.submittedAt || null,
        acknowledgedAt: data.acknowledgedAt || null,
        scheduledAt: data.scheduledAt || null,
        cancelledAt: data.cancelledAt || null,
        capturedDate: data.capturedDate || new Date().toISOString().split('T')[0],
        capturedBy: (data.capturedBy || ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate: data.updatedDate || null,
        updatedBy: (data.updatedBy || ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        completedAt: data.status === 'Completed'
          ? ((initialMaintenanceRequest as any)?.completedAt || new Date().toISOString().split('T')[0])
          : (initialMaintenanceRequest as any)?.completedAt || null,
      };
      let result: any;
      result = isEditMode ? await updateMaintenanceRequest(payload as MaintenanceRequest) : await createMaintenanceRequest(payload as MaintenanceRequest);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`MaintenanceRequest "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/maintenancerequests');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit MaintenanceRequest' : 'Create MaintenanceRequest'}</h3></div>
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
          <Field label="Listing " error={errors.listingID?.message as string}>
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
          <Field label="Lease Renewal " error={errors.leaseRenewalID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('leaseRenewalID')}>
              <option value="">Select Lease Renewal</option>
              {opts_leaseRenewalID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_leaseRenewalID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Submitted By Tenant " error={errors.submittedByTenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('submittedByTenantID')}>
              <option value="">Select Submitted By Tenant</option>
              {opts_submittedByTenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_submittedByTenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Category *" error={errors.categoryID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('categoryID')}>
              <option value="">Select Category</option>
              {opts_categoryID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_categoryID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Priority *" error={errors.priority?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('priority')}>
              <option value="">Select Priority</option>
              <option value="LOW">LOW</option>
              <option value="NORMAL">NORMAL</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="OPEN">OPEN</option>
              <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </Field>
          <Field label="Title" error={errors.title?.message as string}>
            <input className="input" placeholder="Enter title" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('title')}  />
          </Field>
          <Field label="Description" error={errors.description?.message as string}>
            <textarea className="input" placeholder="Enter description" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('description')} rows={3} />
          </Field>
          <Field label="Permission To Enter" error={errors.permissionToEnter?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('permissionToEnter')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Submitted At" error={errors.submittedAt?.message as string}>
            <input className="input" placeholder="Select submission date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('submittedAt')} />
          </Field>
          <Field label="Acknowledged At" error={errors.acknowledgedAt?.message as string}>
            <input className="input" placeholder="Select acknowledgment date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('acknowledgedAt')} />
          </Field>
          <Field label="Scheduled At" error={errors.scheduledAt?.message as string}>
            <input className="input" placeholder="Select scheduled date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('scheduledAt')} />
          </Field>
          <Field label="Completed At" error={errors.completedAt?.message as string}>
            <input className="input" placeholder="Select completion date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('completedAt')} />
          </Field>
          <Field label="Cancelled At" error={errors.cancelledAt?.message as string}>
            <input className="input" placeholder="Select cancellation date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('cancelledAt')} />
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

