{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { Dispute } from '../types/Dispute';
import { createDispute, updateDispute } from '../apis/useDispute';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const disputeSchema = z.object({
  tenantID: z.string().min(1, "Tenant is required"),
  organizationID: z.string().min(1, "Organization is required"),
  leaseID: z.string().optional(),
  leaseRenewalID: z.string().optional(),
  invoiceMasterID: z.string().optional(),
  paymentID: z.string().optional(),
  chargebackID: z.string().optional(),
  maintenanceRequestID: z.string().optional(),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required"),
  title: z.string().max(255, "Title must be less than 255 characters").min(1, "Title is required"),
  description: z.string().max(1000, "Description must be less than 1000 characters").min(1, "Description is required"),
  resolutionNotes: z.string().max(1000, "Resolution Notes must be less than 1000 characters").optional(),
});

type DisputeFormData = z.infer<typeof disputeSchema>;

interface DisputeFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialDispute?: Dispute | null;
  isEditMode?: boolean;
}

export default function DisputeForm({ onAlert, initialDispute = null, isEditMode = false }: DisputeFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_tenantID, setOpts_tenantID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_tenantID_loading, setOpts_tenantID_loading] = React.useState(false);
  const [opts_organizationID, setOpts_organizationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_organizationID_loading, setOpts_organizationID_loading] = React.useState(false);
  const [opts_leaseID, setOpts_leaseID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseID_loading, setOpts_leaseID_loading] = React.useState(false);
  const [opts_leaseRenewalID, setOpts_leaseRenewalID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseRenewalID_loading, setOpts_leaseRenewalID_loading] = React.useState(false);
  const [opts_invoiceMasterID, setOpts_invoiceMasterID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_invoiceMasterID_loading, setOpts_invoiceMasterID_loading] = React.useState(false);
  const [opts_paymentID, setOpts_paymentID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_paymentID_loading, setOpts_paymentID_loading] = React.useState(false);
  const [opts_chargebackID, setOpts_chargebackID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_chargebackID_loading, setOpts_chargebackID_loading] = React.useState(false);
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

  async function loadOptions_organizationID(){
    try { setOpts_organizationID_loading(true);
      const url = "api/organization/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'organizationID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "organizationName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_leaseID(){
    try { setOpts_leaseID_loading(true);
      const url = "api/lease/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'leaseID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["leaseID", "name", "leaseName", "title", "fullName", "email", "description"], String(it)),
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
        label: firstNonEmpty(it, ["leaseRenewalID", "name", "leaseRenewalName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_invoiceMasterID(){
    try { setOpts_invoiceMasterID_loading(true);
      const url = "api/invoicemaster/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'invoiceMasterID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["invoiceNumber", "name", "invoiceMasterName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["invoiceMasterID", "invoiceMasterID", "id", "ID", "invoiceMasterID", "invoiceMasterId"], String(it))
      }));
      setOpts_invoiceMasterID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_invoiceMasterID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_invoiceMasterID(); }, []);

  async function loadOptions_paymentID(){
    try { setOpts_paymentID_loading(true);
      const url = "api/payment/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'paymentID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["paymentID", "name", "paymentName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["paymentID", "paymentID", "id", "ID", "paymentID", "paymentId"], String(it))
      }));
      setOpts_paymentID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_paymentID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_paymentID(); }, []);

  async function loadOptions_chargebackID(){
    try { setOpts_chargebackID_loading(true);
      const url = "api/chargeback/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'chargebackID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["chargebackID", "name", "chargebackName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["chargebackID", "chargebackID", "id", "ID", "chargebackID", "chargebackId"], String(it))
      }));
      setOpts_chargebackID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_chargebackID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_chargebackID(); }, []);

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

  const getDefaultValues = React.useCallback((): DisputeFormData => {
    const src = (initialDispute as any) ?? {};
    if (isEditMode && initialDispute) {
      return {
        tenantID: (src?.tenantID ?? ""),
        organizationID: (src?.organizationID ?? ""),
        leaseID: (src?.leaseID ?? ""),
        leaseRenewalID: (src?.leaseRenewalID ?? ""),
        invoiceMasterID: (src?.invoiceMasterID ?? ""),
        paymentID: (src?.paymentID ?? ""),
        chargebackID: (src?.chargebackID ?? ""),
        maintenanceRequestID: (src?.maintenanceRequestID ?? ""),
        status: (src?.status ?? ""),
        title: (src?.title ?? ""),
        description: (src?.description ?? ""),
        resolutionNotes: (src?.resolutionNotes ?? ""),
      };
    }
    return {
      tenantID: "",
      organizationID: "",
      leaseID: "",
      leaseRenewalID: "",
      invoiceMasterID: "",
      paymentID: "",
      chargebackID: "",
      maintenanceRequestID: "",
      status: "",
      title: "",
      description: "",
      resolutionNotes: "",
    };
  }, [isEditMode, initialDispute]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(disputeSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialDispute && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialDispute, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialDispute && opts_tenantID.length > 0) {
      const currenttenantID = (initialDispute as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = String(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialDispute, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialDispute && opts_organizationID.length > 0) {
      const currentorganizationID = (initialDispute as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = String(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialDispute, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialDispute && opts_leaseID.length > 0) {
      const currentleaseID = (initialDispute as any)?.leaseID ;
      if (currentleaseID !== undefined && currentleaseID!== null) {
        const leaseIDValue = String(currentleaseID);
        if (opts_leaseID.some(opt => opt.value === String(leaseIDValue))) {
          setValue('leaseID', leaseIDValue);
        }
      }
    }
  }, [opts_leaseID, isEditMode, initialDispute, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialDispute && opts_leaseRenewalID.length > 0) {
      const currentleaseRenewalID = (initialDispute as any)?.leaseRenewalID ;
      if (currentleaseRenewalID !== undefined && currentleaseRenewalID!== null) {
        const leaseRenewalIDValue = String(currentleaseRenewalID);
        if (opts_leaseRenewalID.some(opt => opt.value === String(leaseRenewalIDValue))) {
          setValue('leaseRenewalID', leaseRenewalIDValue);
        }
      }
    }
  }, [opts_leaseRenewalID, isEditMode, initialDispute, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialDispute && opts_invoiceMasterID.length > 0) {
      const currentinvoiceMasterID = (initialDispute as any)?.invoiceMasterID ;
      if (currentinvoiceMasterID !== undefined && currentinvoiceMasterID!== null) {
        const invoiceMasterIDValue = String(currentinvoiceMasterID);
        if (opts_invoiceMasterID.some(opt => opt.value === String(invoiceMasterIDValue))) {
          setValue('invoiceMasterID', invoiceMasterIDValue);
        }
      }
    }
  }, [opts_invoiceMasterID, isEditMode, initialDispute, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialDispute && opts_paymentID.length > 0) {
      const currentpaymentID = (initialDispute as any)?.paymentID ;
      if (currentpaymentID !== undefined && currentpaymentID!== null) {
        const paymentIDValue = String(currentpaymentID);
        if (opts_paymentID.some(opt => opt.value === String(paymentIDValue))) {
          setValue('paymentID', paymentIDValue);
        }
      }
    }
  }, [opts_paymentID, isEditMode, initialDispute, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialDispute && opts_chargebackID.length > 0) {
      const currentchargebackID = (initialDispute as any)?.chargebackID ;
      if (currentchargebackID !== undefined && currentchargebackID!== null) {
        const chargebackIDValue = String(currentchargebackID);
        if (opts_chargebackID.some(opt => opt.value === String(chargebackIDValue))) {
          setValue('chargebackID', chargebackIDValue);
        }
      }
    }
  }, [opts_chargebackID, isEditMode, initialDispute, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialDispute && opts_maintenanceRequestID.length > 0) {
      const currentmaintenanceRequestID = (initialDispute as any)?.maintenanceRequestID ;
      if (currentmaintenanceRequestID !== undefined && currentmaintenanceRequestID!== null) {
        const maintenanceRequestIDValue = String(currentmaintenanceRequestID);
        if (opts_maintenanceRequestID.some(opt => opt.value === String(maintenanceRequestIDValue))) {
          setValue('maintenanceRequestID', maintenanceRequestIDValue);
        }
      }
    }
  }, [opts_maintenanceRequestID, isEditMode, initialDispute, setValue]);

  const onSubmitHandler = async (data: DisputeFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} dispute...`, 'info');
      const payload: any = {
        disputeID: (isEditMode ? ((initialDispute as any)?.disputeID ?? null) : null),
        tenantID: data.tenantID ?? '',
        organizationID: data.organizationID ?? '',
        leaseID: data.leaseID ?? '',
        leaseRenewalID: data.leaseRenewalID ?? '',
        invoiceMasterID: data.invoiceMasterID ?? '',
        paymentID: data.paymentID ?? '',
        chargebackID: data.chargebackID ?? '',
        maintenanceRequestID: data.maintenanceRequestID ?? '',
        status: data.status ?? '',
        title: data.title ?? '',
        description: data.description ?? '',
        resolutionNotes: data.resolutionNotes ?? '',
        openedAt : (isEditMode ? ((initialDispute as any)?.openedAt ?? null) : null),
        resolvedAt : (isEditMode ? ((initialDispute as any)?.resolvedAt ?? null) : null),
        capturedDate : (isEditMode ? ((initialDispute as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialDispute as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialDispute as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialDispute as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateDispute(payload as Dispute) : await createDispute(payload as Dispute);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`Dispute "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/disputes');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit Dispute' : 'Create Dispute'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Tenant *" error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Organization *" error={errors.organizationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationID')}>
              <option value="">Select Organization</option>
              {opts_organizationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
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
          <Field label="Invoice Master " error={errors.invoiceMasterID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('invoiceMasterID')}>
              <option value="">Select Invoice Master</option>
              {opts_invoiceMasterID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_invoiceMasterID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Payment " error={errors.paymentID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paymentID')}>
              <option value="">Select Payment</option>
              {opts_paymentID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_paymentID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Chargeback " error={errors.chargebackID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('chargebackID')}>
              <option value="">Select Chargeback</option>
              {opts_chargebackID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_chargebackID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Maintenance Request " error={errors.maintenanceRequestID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('maintenanceRequestID')}>
              <option value="">Select Maintenance Request</option>
              {opts_maintenanceRequestID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_maintenanceRequestID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Status" error={errors.status?.message as string}>
            <input className="input" placeholder="Select status" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}  />
          </Field>
          <Field label="Title" error={errors.title?.message as string}>
            <textarea className="input" placeholder="Enter title" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('title')} rows={3} />
          </Field>
          <Field label="Description" error={errors.description?.message as string}>
            <textarea className="input" placeholder="Enter description" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('description')} rows={3} />
          </Field>
          <Field label="Resolution Notes" error={errors.resolutionNotes?.message as string}>
            <textarea className="input" placeholder="Enter resolution notes" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('resolutionNotes')} rows={3} />
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

