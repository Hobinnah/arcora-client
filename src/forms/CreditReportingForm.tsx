{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { CreditReporting } from '../types/CreditReporting';
import { createCreditReporting, updateCreditReporting } from '../apis/useCreditReporting';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const creditReportingSchema = z.object({
  creditReportingEnrollmentID: z.string().min(1, "Credit Reporting Enrollment is required"),
  invoiceMasterID: z.string().optional(),
  paymentID: z.string().optional(),
  reportedAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Reported Amount is required")),
  wasPaidOnTime: z.boolean().optional(),
  reportingPeriodStart: z.string().optional(),
  reportingPeriodEnd: z.string().optional(),
  providerStatus: z.string().max(100, "Provider Status must be less than 100 characters").optional(),
  providerReferenceID: z.string().max(255, "Provider Reference ID must be less than 255 characters").optional(),
  providerResponse: z.string().max(256, "Provider Response must be less than 256 characters").optional(),
});

type CreditReportingFormData = z.infer<typeof creditReportingSchema>;

interface CreditReportingFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialCreditReporting?: CreditReporting | null;
  isEditMode?: boolean;
}

export default function CreditReportingForm({ onAlert, initialCreditReporting = null, isEditMode = false }: CreditReportingFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_creditReportingEnrollmentID, setOpts_creditReportingEnrollmentID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_creditReportingEnrollmentID_loading, setOpts_creditReportingEnrollmentID_loading] = React.useState(false);
  const [opts_invoiceMasterID, setOpts_invoiceMasterID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_invoiceMasterID_loading, setOpts_invoiceMasterID_loading] = React.useState(false);
  const [opts_paymentID, setOpts_paymentID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_paymentID_loading, setOpts_paymentID_loading] = React.useState(false);

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

  async function loadOptions_creditReportingEnrollmentID(){
    try { setOpts_creditReportingEnrollmentID_loading(true);
      const url = "api/creditreportingenrollment/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'creditReportingEnrollmentID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["providerName", "name", "creditReportingEnrollmentName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["creditReportingEnrollmentID", "creditReportingEnrollmentID", "id", "ID", "creditReportingEnrollmentID", "creditReportingEnrollmentId"], String(it))
      }));
      setOpts_creditReportingEnrollmentID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_creditReportingEnrollmentID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_creditReportingEnrollmentID(); }, []);

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

  const getDefaultValues = React.useCallback((): CreditReportingFormData => {
    const src = (initialCreditReporting as any) ?? {};
    if (isEditMode && initialCreditReporting) {
      return {
        creditReportingEnrollmentID: (src?.creditReportingEnrollmentID ?? ""),
        invoiceMasterID: (src?.invoiceMasterID ?? ""),
        paymentID: (src?.paymentID ?? ""),
        reportedAmount: (src?.reportedAmount ?? 0),
        wasPaidOnTime: Boolean(src?.wasPaidOnTime),
        reportingPeriodStart: src?.reportingPeriodStart ? new Date(src?.reportingPeriodStart as any).toISOString().split('T')[0] : "",
        reportingPeriodEnd: src?.reportingPeriodEnd ? new Date(src?.reportingPeriodEnd as any).toISOString().split('T')[0] : "",
        providerStatus: (src?.providerStatus ?? ""),
        providerReferenceID: (src?.providerReferenceID ?? ""),
        providerResponse: (src?.providerResponse ?? ""),
      };
    }
    return {
      creditReportingEnrollmentID: "",
      invoiceMasterID: "",
      paymentID: "",
      reportedAmount: 0,
      wasPaidOnTime: false,
      reportingPeriodStart: "",
      reportingPeriodEnd: "",
      providerStatus: "",
      providerReferenceID: "",
      providerResponse: "",
    };
  }, [isEditMode, initialCreditReporting]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(creditReportingSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialCreditReporting && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialCreditReporting, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialCreditReporting && opts_creditReportingEnrollmentID.length > 0) {
      const currentcreditReportingEnrollmentID = (initialCreditReporting as any)?.creditReportingEnrollmentID ;
      if (currentcreditReportingEnrollmentID !== undefined && currentcreditReportingEnrollmentID!== null) {
        const creditReportingEnrollmentIDValue = String(currentcreditReportingEnrollmentID);
        if (opts_creditReportingEnrollmentID.some(opt => opt.value === String(creditReportingEnrollmentIDValue))) {
          setValue('creditReportingEnrollmentID', creditReportingEnrollmentIDValue);
        }
      }
    }
  }, [opts_creditReportingEnrollmentID, isEditMode, initialCreditReporting, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialCreditReporting && opts_invoiceMasterID.length > 0) {
      const currentinvoiceMasterID = (initialCreditReporting as any)?.invoiceMasterID ;
      if (currentinvoiceMasterID !== undefined && currentinvoiceMasterID!== null) {
        const invoiceMasterIDValue = String(currentinvoiceMasterID);
        if (opts_invoiceMasterID.some(opt => opt.value === String(invoiceMasterIDValue))) {
          setValue('invoiceMasterID', invoiceMasterIDValue);
        }
      }
    }
  }, [opts_invoiceMasterID, isEditMode, initialCreditReporting, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialCreditReporting && opts_paymentID.length > 0) {
      const currentpaymentID = (initialCreditReporting as any)?.paymentID ;
      if (currentpaymentID !== undefined && currentpaymentID!== null) {
        const paymentIDValue = String(currentpaymentID);
        if (opts_paymentID.some(opt => opt.value === String(paymentIDValue))) {
          setValue('paymentID', paymentIDValue);
        }
      }
    }
  }, [opts_paymentID, isEditMode, initialCreditReporting, setValue]);

  const onSubmitHandler = async (data: CreditReportingFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} creditreporting...`, 'info');
      const payload: any = {
        creditReportingID: (isEditMode ? ((initialCreditReporting as any)?.creditReportingID ?? null) : null),
        creditReportingEnrollmentID: data.creditReportingEnrollmentID ?? '',
        invoiceMasterID: data.invoiceMasterID ?? '',
        paymentID: data.paymentID ?? '',
        reportedAmount: data.reportedAmount,
        wasPaidOnTime: data.wasPaidOnTime,
        reportingPeriodStart: data.reportingPeriodStart || null,
        reportingPeriodEnd: data.reportingPeriodEnd || null,
        providerStatus: data.providerStatus ?? '',
        providerReferenceID: data.providerReferenceID ?? '',
        providerResponse: data.providerResponse ?? '',
        reportedAt : (isEditMode ? ((initialCreditReporting as any)?.reportedAt ?? null) : null),
        capturedDate : (isEditMode ? ((initialCreditReporting as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialCreditReporting as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateCreditReporting(payload as CreditReporting) : await createCreditReporting(payload as CreditReporting);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`CreditReporting "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/creditreportings');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit CreditReporting' : 'Create CreditReporting'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Credit Reporting Enrollment *" error={errors.creditReportingEnrollmentID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('creditReportingEnrollmentID')}>
              <option value="">Select Credit Reporting Enrollment</option>
              {opts_creditReportingEnrollmentID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_creditReportingEnrollmentID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
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
          <Field label="Reported Amount" error={errors.reportedAmount?.message as string}>
            <input className="input" placeholder="Enter reported amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('reportedAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Was Paid On Time" error={errors.wasPaidOnTime?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('wasPaidOnTime')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Reporting Period Start" error={errors.reportingPeriodStart?.message as string}>
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('reportingPeriodStart')} />
          </Field>
          <Field label="Reporting Period End" error={errors.reportingPeriodEnd?.message as string}>
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('reportingPeriodEnd')} />
          </Field>
          <Field label="Provider Status" error={errors.providerStatus?.message as string}>
            <input className="input" placeholder="Enter provider status" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('providerStatus')}  />
          </Field>
          <Field label="Provider Reference ID" error={errors.providerReferenceID?.message as string}>
            <textarea className="input" placeholder="Enter provider reference ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerReferenceID')} rows={3} />
          </Field>
          <Field label="Provider Response" error={errors.providerResponse?.message as string}>
            <textarea className="input" placeholder="Enter provider response" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerResponse')} rows={3} />
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

