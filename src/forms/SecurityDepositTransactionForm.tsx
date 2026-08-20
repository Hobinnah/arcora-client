{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { SecurityDepositTransaction } from '../types/SecurityDepositTransaction';
import { createSecurityDepositTransaction, updateSecurityDepositTransaction } from '../apis/useSecurityDepositTransaction';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const securityDepositTransactionSchema = z.object({
  securityDepositID: z.string().min(1, "Security Deposit is required"),
  paymentID: z.string().optional(),
  refundID: z.string().optional(),
  invoiceMasterID: z.string().optional(),
  invoiceDetailID: z.string().optional(),
  transactionType: z.string().max(50, "Transaction Type must be less than 50 characters").min(1, "Transaction Type is required").refine(v => (v ?? '') === '' || ["COLLECTION", "DEDUCTION", "RETURN", "ADJUSTMENT", "INTEREST"].includes(v as any), "Invalid Transaction Type"),
  amount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Amount is required")),
  currency: z.string().max(3, "Currency must be less than 3 characters").min(1, "Currency is required"),
  description: z.string().max(255, "Description must be less than 255 characters").optional(),
  occurredAt: z.string(),
});

type SecurityDepositTransactionFormData = z.infer<typeof securityDepositTransactionSchema>;

interface SecurityDepositTransactionFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialSecurityDepositTransaction?: SecurityDepositTransaction | null;
  isEditMode?: boolean;
}

export default function SecurityDepositTransactionForm({ onAlert, initialSecurityDepositTransaction = null, isEditMode = false }: SecurityDepositTransactionFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_securityDepositID, setOpts_securityDepositID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_securityDepositID_loading, setOpts_securityDepositID_loading] = React.useState(false);
  const [opts_paymentID, setOpts_paymentID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_paymentID_loading, setOpts_paymentID_loading] = React.useState(false);
  const [opts_refundID, setOpts_refundID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_refundID_loading, setOpts_refundID_loading] = React.useState(false);
  const [opts_invoiceMasterID, setOpts_invoiceMasterID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_invoiceMasterID_loading, setOpts_invoiceMasterID_loading] = React.useState(false);
  const [opts_invoiceDetailID, setOpts_invoiceDetailID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_invoiceDetailID_loading, setOpts_invoiceDetailID_loading] = React.useState(false);

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

  async function loadOptions_securityDepositID(){
    try { setOpts_securityDepositID_loading(true);
      const url = "api/securitydeposit/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'securityDepositID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["securityDepositID", "name", "securityDepositName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["securityDepositID", "securityDepositID", "id", "ID", "securityDepositID", "securityDepositId"], String(it))
      }));
      setOpts_securityDepositID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_securityDepositID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_securityDepositID(); }, []);

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

  async function loadOptions_refundID(){
    try { setOpts_refundID_loading(true);
      const url = "api/refund/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'refundID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["refundID", "name", "refundName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["refundID", "refundID", "id", "ID", "refundID", "refundId"], String(it))
      }));
      setOpts_refundID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_refundID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_refundID(); }, []);

  async function loadOptions_invoiceMasterID(){
    try { setOpts_invoiceMasterID_loading(true);
      const url = "api/invoicemaster/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'invoiceMasterID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["invoiceMasterID", "name", "invoiceMasterName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_invoiceDetailID(){
    try { setOpts_invoiceDetailID_loading(true);
      const url = "api/invoicedetail/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'invoiceDetailID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["invoiceDetailID", "name", "invoiceDetailName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["invoiceDetailID", "invoiceDetailID", "id", "ID", "invoiceDetailID", "invoiceDetailId"], String(it))
      }));
      setOpts_invoiceDetailID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_invoiceDetailID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_invoiceDetailID(); }, []);

  const getDefaultValues = React.useCallback((): SecurityDepositTransactionFormData => {
    const src = (initialSecurityDepositTransaction as any) ?? {};
    if (isEditMode && initialSecurityDepositTransaction) {
      return {
        securityDepositID: (src?.securityDepositID ?? ""),
        paymentID: (src?.paymentID ?? ""),
        refundID: (src?.refundID ?? ""),
        invoiceMasterID: (src?.invoiceMasterID ?? ""),
        invoiceDetailID: (src?.invoiceDetailID ?? ""),
        transactionType: (src?.transactionType ?? ""),
        amount: (src?.amount ?? 0),
        currency: (src?.currency ?? ""),
        description: (src?.description ?? ""),
        occurredAt: src?.occurredAt ? new Date(src?.occurredAt as any).toISOString().split('T')[0] : "",
      };
    }
    return {
      securityDepositID: "",
      paymentID: "",
      refundID: "",
      invoiceMasterID: "",
      invoiceDetailID: "",
      transactionType: "",
      amount: 0,
      currency: "",
      description: "",
      occurredAt: "",
    };
  }, [isEditMode, initialSecurityDepositTransaction]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(securityDepositTransactionSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialSecurityDepositTransaction && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialSecurityDepositTransaction, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialSecurityDepositTransaction && opts_securityDepositID.length > 0) {
      const currentsecurityDepositID = (initialSecurityDepositTransaction as any)?.securityDepositID ;
      if (currentsecurityDepositID !== undefined && currentsecurityDepositID!== null) {
        const securityDepositIDValue = Number(currentsecurityDepositID);
        if (opts_securityDepositID.some(opt => opt.value === String(securityDepositIDValue))) {
          setValue('securityDepositID', securityDepositIDValue);
        }
      }
    }
  }, [opts_securityDepositID, isEditMode, initialSecurityDepositTransaction, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialSecurityDepositTransaction && opts_paymentID.length > 0) {
      const currentpaymentID = (initialSecurityDepositTransaction as any)?.paymentID ;
      if (currentpaymentID !== undefined && currentpaymentID!== null) {
        const paymentIDValue = Number(currentpaymentID);
        if (opts_paymentID.some(opt => opt.value === String(paymentIDValue))) {
          setValue('paymentID', paymentIDValue);
        }
      }
    }
  }, [opts_paymentID, isEditMode, initialSecurityDepositTransaction, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialSecurityDepositTransaction && opts_refundID.length > 0) {
      const currentrefundID = (initialSecurityDepositTransaction as any)?.refundID ;
      if (currentrefundID !== undefined && currentrefundID!== null) {
        const refundIDValue = Number(currentrefundID);
        if (opts_refundID.some(opt => opt.value === String(refundIDValue))) {
          setValue('refundID', refundIDValue);
        }
      }
    }
  }, [opts_refundID, isEditMode, initialSecurityDepositTransaction, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialSecurityDepositTransaction && opts_invoiceMasterID.length > 0) {
      const currentinvoiceMasterID = (initialSecurityDepositTransaction as any)?.invoiceMasterID ;
      if (currentinvoiceMasterID !== undefined && currentinvoiceMasterID!== null) {
        const invoiceMasterIDValue = Number(currentinvoiceMasterID);
        if (opts_invoiceMasterID.some(opt => opt.value === String(invoiceMasterIDValue))) {
          setValue('invoiceMasterID', invoiceMasterIDValue);
        }
      }
    }
  }, [opts_invoiceMasterID, isEditMode, initialSecurityDepositTransaction, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialSecurityDepositTransaction && opts_invoiceDetailID.length > 0) {
      const currentinvoiceDetailID = (initialSecurityDepositTransaction as any)?.invoiceDetailID ;
      if (currentinvoiceDetailID !== undefined && currentinvoiceDetailID!== null) {
        const invoiceDetailIDValue = Number(currentinvoiceDetailID);
        if (opts_invoiceDetailID.some(opt => opt.value === String(invoiceDetailIDValue))) {
          setValue('invoiceDetailID', invoiceDetailIDValue);
        }
      }
    }
  }, [opts_invoiceDetailID, isEditMode, initialSecurityDepositTransaction, setValue]);

  const onSubmitHandler = async (data: SecurityDepositTransactionFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} securitydeposittransaction...`, 'info');
      const payload: any = {
        securityDepositTransactionID: (isEditMode ? ((initialSecurityDepositTransaction as any)?.securityDepositTransactionID ?? null) : null),
        securityDepositID: data.securityDepositID ?? '',
        paymentID: data.paymentID ?? '',
        refundID: data.refundID ?? '',
        invoiceMasterID: data.invoiceMasterID ?? '',
        invoiceDetailID: data.invoiceDetailID ?? '',
        transactionType: data.transactionType ?? '',
        amount: data.amount,
        currency: data.currency ?? '',
        description: data.description ?? '',
        occurredAt: data.occurredAt || null,
        capturedDate : (isEditMode ? ((initialSecurityDepositTransaction as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialSecurityDepositTransaction as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateSecurityDepositTransaction(payload as SecurityDepositTransaction) : await createSecurityDepositTransaction(payload as SecurityDepositTransaction);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`SecurityDepositTransaction "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/securitydeposittransactions');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit SecurityDepositTransaction' : 'Create SecurityDepositTransaction'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Security Deposit *" error={errors.securityDepositID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('securityDepositID')}>
              <option value="">Select Security Deposit</option>
              {opts_securityDepositID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_securityDepositID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Payment " error={errors.paymentID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paymentID')}>
              <option value="">Select Payment</option>
              {opts_paymentID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_paymentID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Refund " error={errors.refundID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('refundID')}>
              <option value="">Select Refund</option>
              {opts_refundID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_refundID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Invoice Master " error={errors.invoiceMasterID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('invoiceMasterID')}>
              <option value="">Select Invoice Master</option>
              {opts_invoiceMasterID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_invoiceMasterID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Invoice Detail " error={errors.invoiceDetailID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('invoiceDetailID')}>
              <option value="">Select Invoice Detail</option>
              {opts_invoiceDetailID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_invoiceDetailID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Transaction Type *" error={errors.transactionType?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('transactionType')}>
              <option value="">Select Transaction Type</option>
              <option value="COLLECTION">COLLECTION</option>
              <option value="DEDUCTION">DEDUCTION</option>
              <option value="RETURN">RETURN</option>
              <option value="ADJUSTMENT">ADJUSTMENT</option>
              <option value="INTEREST">INTEREST</option>
            </select>
          </Field>
          <Field label="Amount" error={errors.amount?.message as string}>
            <input className="input" placeholder="Enter amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('amount', { valueAsNumber: true })} />
          </Field>
          <Field label="Currency" error={errors.currency?.message as string}>
            <input className="input" placeholder="Enter currency code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}  />
          </Field>
          <Field label="Description" error={errors.description?.message as string}>
            <textarea className="input" placeholder="Enter description" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('description')} rows={3} />
          </Field>
          <Field label="Occurred At" error={errors.occurredAt?.message as string}>
            <input className="input" placeholder="Select date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('occurredAt')} />
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

