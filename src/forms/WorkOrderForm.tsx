{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { WorkOrder } from '../types/WorkOrder';
import { createWorkOrder, updateWorkOrder } from '../apis/useWorkOrder';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const workOrderSchema = z.object({
  maintenanceRequestID: z.string().min(1, "Maintenance Request is required"),
  contractorID: z.string().optional(),
  assignedOrganizationMemberID: z.string().optional(),
  leaseID: z.string().optional(),
  leaseRenewalID: z.string().optional(),
  title: z.string().max(200, "Title must be less than 200 characters").min(1, "Title is required"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["DRAFT", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(v as any), "Invalid Status"),
  estimatedCost: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  finalCost: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  currency: z.string().max(3, "Currency must be less than 3 characters").min(1, "Currency is required").refine(v => (v ?? '') === '' || ["CAD", "USD", "EUR"].includes(v as any), "Invalid Currency"),
  scheduledAt: z.string().optional(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  cancelledAt: z.string().optional(),
  capturedDate: z.string().optional(),
  capturedBy: z.string().max(100, "Captured By must be less than 100 characters").optional(),
  updatedDate: z.string().optional(),
  updatedBy: z.string().max(100, "Updated By must be less than 100 characters").optional(),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;

interface WorkOrderFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialWorkOrder?: WorkOrder | null;
  isEditMode?: boolean;
}

export default function WorkOrderForm({ onAlert, initialWorkOrder = null, isEditMode = false }: WorkOrderFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_maintenanceRequestID, setOpts_maintenanceRequestID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_maintenanceRequestID_loading, setOpts_maintenanceRequestID_loading] = React.useState(false);
  const [opts_contractorID, setOpts_contractorID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_contractorID_loading, setOpts_contractorID_loading] = React.useState(false);
  const [opts_assignedOrganizationMemberID, setOpts_assignedOrganizationMemberID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_assignedOrganizationMemberID_loading, setOpts_assignedOrganizationMemberID_loading] = React.useState(false);
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

  async function loadOptions_maintenanceRequestID(){
    try { setOpts_maintenanceRequestID_loading(true);
      const url = "api/maintenancerequest/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'maintenanceRequestID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["title", "name", "maintenanceRequestName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_contractorID(){
    try { setOpts_contractorID_loading(true);
      const url = "api/contractor/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'contractorID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["companyName", "name", "contractorName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["contractorID", "contractorID", "id", "ID", "contractorID", "contractorId"], String(it))
      }));
      setOpts_contractorID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_contractorID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_contractorID(); }, []);

  async function loadOptions_assignedOrganizationMemberID(){
    try { setOpts_assignedOrganizationMemberID_loading(true);
      const url = "api/organizationmember/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'assignedOrganizationMemberID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["memberName", "name", "assignedOrganizationMemberName", "title", "fullName", "email", "description"], String(it)),
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

  const getDefaultValues = React.useCallback((): WorkOrderFormData => {
    const src = (initialWorkOrder as any) ?? {};
    if (isEditMode && initialWorkOrder) {
      return {
        maintenanceRequestID: (src?.maintenanceRequestID ?? ""),
        contractorID: (src?.contractorID ?? ""),
        assignedOrganizationMemberID: (src?.assignedOrganizationMemberID ?? ""),
        leaseID: (src?.leaseID ?? ""),
        leaseRenewalID: (src?.leaseRenewalID ?? ""),
        title: (src?.title ?? ""),
        description: (src?.description ?? ""),
        status: (src?.status ?? ""),
        estimatedCost: (src?.estimatedCost ?? 0),
        finalCost: (src?.finalCost ?? 0),
        currency: (src?.currency ?? ""),
        scheduledAt: src?.scheduledAt ? new Date(src?.scheduledAt as any).toISOString().split('T')[0] : "",
        startedAt: src?.startedAt ? new Date(src?.startedAt as any).toISOString().split('T')[0] : "",
        completedAt: src?.completedAt ? new Date(src?.completedAt as any).toISOString().split('T')[0] : "",
        cancelledAt: src?.cancelledAt ? new Date(src?.cancelledAt as any).toISOString().split('T')[0] : "",
        capturedDate: src?.capturedDate ? new Date(src?.capturedDate as any).toISOString().split('T')[0] : "",
        capturedBy: (src?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate: src?.updatedDate ? new Date(src?.updatedDate as any).toISOString().split('T')[0] : "",
        updatedBy: (src?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
    }
    return {
      maintenanceRequestID: "",
      contractorID: "",
      assignedOrganizationMemberID: "",
      leaseID: "",
      leaseRenewalID: "",
      title: "",
      description: "",
      status: "DRAFT",
      estimatedCost: 0,
      finalCost: 0,
      currency: "",
      scheduledAt: "",
      startedAt: "",
      completedAt: "",
      cancelledAt: "",
      capturedDate: new Date().toISOString().split('T')[0],
      capturedBy: ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim(),
      updatedDate: "",
      updatedBy: ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim(),
    };
  }, [isEditMode, initialWorkOrder]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(workOrderSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialWorkOrder && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialWorkOrder, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialWorkOrder && opts_maintenanceRequestID.length > 0) {
      const currentmaintenanceRequestID = (initialWorkOrder as any)?.maintenanceRequestID ;
      if (currentmaintenanceRequestID !== undefined && currentmaintenanceRequestID!== null) {
        const maintenanceRequestIDValue = String(currentmaintenanceRequestID);
        if (opts_maintenanceRequestID.some(opt => opt.value === String(maintenanceRequestIDValue))) {
          setValue('maintenanceRequestID', maintenanceRequestIDValue);
        }
      }
    }
  }, [opts_maintenanceRequestID, isEditMode, initialWorkOrder, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialWorkOrder && opts_contractorID.length > 0) {
      const currentcontractorID = (initialWorkOrder as any)?.contractorID ;
      if (currentcontractorID !== undefined && currentcontractorID!== null) {
        const contractorIDValue = String(currentcontractorID);
        if (opts_contractorID.some(opt => opt.value === String(contractorIDValue))) {
          setValue('contractorID', contractorIDValue);
        }
      }
    }
  }, [opts_contractorID, isEditMode, initialWorkOrder, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialWorkOrder && opts_assignedOrganizationMemberID.length > 0) {
      const currentassignedOrganizationMemberID = (initialWorkOrder as any)?.assignedOrganizationMemberID ;
      if (currentassignedOrganizationMemberID !== undefined && currentassignedOrganizationMemberID!== null) {
        const assignedOrganizationMemberIDValue = String(currentassignedOrganizationMemberID);
        if (opts_assignedOrganizationMemberID.some(opt => opt.value === String(assignedOrganizationMemberIDValue))) {
          setValue('assignedOrganizationMemberID', assignedOrganizationMemberIDValue);
        }
      }
    }
  }, [opts_assignedOrganizationMemberID, isEditMode, initialWorkOrder, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialWorkOrder && opts_leaseID.length > 0) {
      const currentleaseID = (initialWorkOrder as any)?.leaseID ;
      if (currentleaseID !== undefined && currentleaseID!== null) {
        const leaseIDValue = String(currentleaseID);
        if (opts_leaseID.some(opt => opt.value === String(leaseIDValue))) {
          setValue('leaseID', leaseIDValue);
        }
      }
    }
  }, [opts_leaseID, isEditMode, initialWorkOrder, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialWorkOrder && opts_leaseRenewalID.length > 0) {
      const currentleaseRenewalID = (initialWorkOrder as any)?.leaseRenewalID ;
      if (currentleaseRenewalID !== undefined && currentleaseRenewalID!== null) {
        const leaseRenewalIDValue = String(currentleaseRenewalID);
        if (opts_leaseRenewalID.some(opt => opt.value === String(leaseRenewalIDValue))) {
          setValue('leaseRenewalID', leaseRenewalIDValue);
        }
      }
    }
  }, [opts_leaseRenewalID, isEditMode, initialWorkOrder, setValue]);

  const onSubmitHandler = async (data: WorkOrderFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} workorder...`, 'info');
      const payload: any = {
        workOrderID: (isEditMode ? ((initialWorkOrder as any)?.workOrderID ?? null) : null),
        maintenanceRequestID: data.maintenanceRequestID ?? '',
        contractorID: data.contractorID ?? '',
        assignedOrganizationMemberID: data.assignedOrganizationMemberID ?? '',
        leaseID: data.leaseID ?? '',
        leaseRenewalID: data.leaseRenewalID ?? '',
        title: data.title ?? '',
        description: data.description ?? '',
        status: data.status ?? '',
        estimatedCost: data.estimatedCost,
        finalCost: data.finalCost,
        currency: data.currency ?? '',
        scheduledAt: data.scheduledAt || null,
        startedAt: data.startedAt || null,
        cancelledAt: data.cancelledAt || null,
        capturedDate: data.capturedDate || new Date().toISOString().split('T')[0],
        capturedBy: (data.capturedBy || ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate: data.updatedDate || null,
        updatedBy: (data.updatedBy || ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        completedAt: data.status === 'Completed'
          ? ((initialWorkOrder as any)?.completedAt || new Date().toISOString().split('T')[0])
          : (initialWorkOrder as any)?.completedAt || null,
      };
      let result: any;
      result = isEditMode ? await updateWorkOrder(payload as WorkOrder) : await createWorkOrder(payload as WorkOrder);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`WorkOrder "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/workorders');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit WorkOrder' : 'Create WorkOrder'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Maintenance Request *" error={errors.maintenanceRequestID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('maintenanceRequestID')}>
              <option value="">Select Maintenance Request</option>
              {opts_maintenanceRequestID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_maintenanceRequestID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Contractor " error={errors.contractorID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('contractorID')}>
              <option value="">Select Contractor</option>
              {opts_contractorID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_contractorID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Assigned Organization Member " error={errors.assignedOrganizationMemberID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('assignedOrganizationMemberID')}>
              <option value="">Select Assigned Organization Member</option>
              {opts_assignedOrganizationMemberID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_assignedOrganizationMemberID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
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
          <Field label="Title" error={errors.title?.message as string}>
            <input className="input" placeholder="Enter title" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('title')}  />
          </Field>
          <Field label="Description" error={errors.description?.message as string}>
            <textarea className="input" placeholder="Enter description" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('description')} rows={3} />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </Field>
          <Field label="Estimated Cost" error={errors.estimatedCost?.message as string}>
            <input className="input" placeholder="Enter estimated cost" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('estimatedCost', { valueAsNumber: true })} />
          </Field>
          <Field label="Final Cost" error={errors.finalCost?.message as string}>
            <input className="input" placeholder="Enter final cost" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('finalCost', { valueAsNumber: true })} />
          </Field>
          <Field label="Currency *" error={errors.currency?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}>
              <option value="">Select Currency</option>
              <option value="CAD">CAD</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </Field>
          <Field label="Scheduled At" error={errors.scheduledAt?.message as string}>
            <input className="input" placeholder="Select scheduled date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('scheduledAt')} />
          </Field>
          <Field label="Started At" error={errors.startedAt?.message as string}>
            <input className="input" placeholder="Select start date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('startedAt')} />
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

