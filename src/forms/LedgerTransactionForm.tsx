{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { LedgerTransaction } from '../types/LedgerTransaction';
import { createLedgerTransaction, updateLedgerTransaction } from '../apis/useLedgerTransaction';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const ledgerTransactionSchema = z.object({
  organizationID: z.string().min(1, "Organization is required"),
  transactionType: z.string().max(100, "Transaction Type must be less than 100 characters").min(1, "Transaction Type is required"),
  transactionDate: z.string(),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  paymentID: z.string().optional(),
  invoiceMasterID: z.string().optional(),
  refundID: z.string().optional(),
  payoutID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  referenceNumber: z.string().max(256, "Reference Number must be less than 256 characters").optional(),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["POSTED", "REVERSED"].includes(v as any), "Invalid Status"),
  reversedTransactionID: z.string().optional(),
});

type LedgerTransactionFormData = z.infer<typeof ledgerTransactionSchema>;

interface LedgerTransactionFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialLedgerTransaction?: LedgerTransaction | null;
  isEditMode?: boolean;
}

export default function LedgerTransactionForm({ onAlert, initialLedgerTransaction = null, isEditMode = false }: LedgerTransactionFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_organizationID, setOpts_organizationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_organizationID_loading, setOpts_organizationID_loading] = React.useState(false);
  const [opts_paymentID, setOpts_paymentID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_paymentID_loading, setOpts_paymentID_loading] = React.useState(false);
  const [opts_invoiceMasterID, setOpts_invoiceMasterID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_invoiceMasterID_loading, setOpts_invoiceMasterID_loading] = React.useState(false);
  const [opts_refundID, setOpts_refundID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_refundID_loading, setOpts_refundID_loading] = React.useState(false);
  const [opts_payoutID, setOpts_payoutID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_payoutID_loading, setOpts_payoutID_loading] = React.useState(false);
  const [opts_reversedTransactionID, setOpts_reversedTransactionID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_reversedTransactionID_loading, setOpts_reversedTransactionID_loading] = React.useState(false);

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
        label: firstNonEmpty(it, ["organizationID", "name", "organizationName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_payoutID(){
    try { setOpts_payoutID_loading(true);
      const url = "api/payout/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'payoutID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["payoutID", "name", "payoutName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["payoutID", "payoutID", "id", "ID", "payoutID", "payoutId"], String(it))
      }));
      setOpts_payoutID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_payoutID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_payoutID(); }, []);

  async function loadOptions_reversedTransactionID(){
    try { setOpts_reversedTransactionID_loading(true);
      const url = "api/ledgertransaction/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'reversedTransactionID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["ledgerTransactionID", "name", "reversedTransactionName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["ledgerTransactionID", "ledgerTransactionID", "id", "ID", "reversedTransactionID", "reversedTransactionId"], String(it))
      }));
      setOpts_reversedTransactionID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_reversedTransactionID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_reversedTransactionID(); }, []);

  const getDefaultValues = React.useCallback((): LedgerTransactionFormData => {
    const src = (initialLedgerTransaction as any) ?? {};
    if (isEditMode && initialLedgerTransaction) {
      return {
        organizationID: (src?.organizationID ?? ""),
        transactionType: (src?.transactionType ?? ""),
        transactionDate: src?.transactionDate ? new Date(src?.transactionDate as any).toISOString().split('T')[0] : "",
        description: (src?.description ?? ""),
        paymentID: (src?.paymentID ?? ""),
        invoiceMasterID: (src?.invoiceMasterID ?? ""),
        refundID: (src?.refundID ?? ""),
        payoutID: (() => {
          if (src?.payoutID !== undefined && src?.payoutID !== null) {
            return Number(src.payoutID);
          }
          return 0;
        })(),
        referenceNumber: (src?.referenceNumber ?? ""),
        status: (src?.status ?? ""),
        reversedTransactionID: (src?.reversedTransactionID ?? ""),
      };
    }
    return {
      organizationID: "",
      transactionType: "",
      transactionDate: "",
      description: "",
      paymentID: "",
      invoiceMasterID: "",
      refundID: "",
      payoutID: 0,
      referenceNumber: "",
      status: "POSTED",
      reversedTransactionID: "",
    };
  }, [isEditMode, initialLedgerTransaction]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(ledgerTransactionSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialLedgerTransaction && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialLedgerTransaction, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLedgerTransaction && opts_organizationID.length > 0) {
      const currentorganizationID = (initialLedgerTransaction as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = Number(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialLedgerTransaction, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLedgerTransaction && opts_paymentID.length > 0) {
      const currentpaymentID = (initialLedgerTransaction as any)?.paymentID ;
      if (currentpaymentID !== undefined && currentpaymentID!== null) {
        const paymentIDValue = Number(currentpaymentID);
        if (opts_paymentID.some(opt => opt.value === String(paymentIDValue))) {
          setValue('paymentID', paymentIDValue);
        }
      }
    }
  }, [opts_paymentID, isEditMode, initialLedgerTransaction, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLedgerTransaction && opts_invoiceMasterID.length > 0) {
      const currentinvoiceMasterID = (initialLedgerTransaction as any)?.invoiceMasterID ;
      if (currentinvoiceMasterID !== undefined && currentinvoiceMasterID!== null) {
        const invoiceMasterIDValue = Number(currentinvoiceMasterID);
        if (opts_invoiceMasterID.some(opt => opt.value === String(invoiceMasterIDValue))) {
          setValue('invoiceMasterID', invoiceMasterIDValue);
        }
      }
    }
  }, [opts_invoiceMasterID, isEditMode, initialLedgerTransaction, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLedgerTransaction && opts_refundID.length > 0) {
      const currentrefundID = (initialLedgerTransaction as any)?.refundID ;
      if (currentrefundID !== undefined && currentrefundID!== null) {
        const refundIDValue = Number(currentrefundID);
        if (opts_refundID.some(opt => opt.value === String(refundIDValue))) {
          setValue('refundID', refundIDValue);
        }
      }
    }
  }, [opts_refundID, isEditMode, initialLedgerTransaction, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLedgerTransaction && opts_payoutID.length > 0) {
      const currentpayoutID = (initialLedgerTransaction as any)?.payoutID ;
      if (currentpayoutID !== undefined && currentpayoutID!== null) {
        const payoutIDValue = Number(currentpayoutID);
        if (opts_payoutID.some(opt => opt.value === String(payoutIDValue))) {
          setValue('payoutID', payoutIDValue);
        }
      }
    }
  }, [opts_payoutID, isEditMode, initialLedgerTransaction, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLedgerTransaction && opts_reversedTransactionID.length > 0) {
      const currentreversedTransactionID = (initialLedgerTransaction as any)?.reversedTransactionID ;
      if (currentreversedTransactionID !== undefined && currentreversedTransactionID!== null) {
        const reversedTransactionIDValue = Number(currentreversedTransactionID);
        if (opts_reversedTransactionID.some(opt => opt.value === String(reversedTransactionIDValue))) {
          setValue('reversedTransactionID', reversedTransactionIDValue);
        }
      }
    }
  }, [opts_reversedTransactionID, isEditMode, initialLedgerTransaction, setValue]);

  const onSubmitHandler = async (data: LedgerTransactionFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} ledgertransaction...`, 'info');
      const payload: any = {
        ledgerTransactionID: (isEditMode ? ((initialLedgerTransaction as any)?.ledgerTransactionID ?? null) : null),
        organizationID: data.organizationID ?? '',
        transactionType: data.transactionType ?? '',
        transactionDate: data.transactionDate || null,
        description: data.description ?? '',
        paymentID: data.paymentID ?? '',
        invoiceMasterID: data.invoiceMasterID ?? '',
        refundID: data.refundID ?? '',
        payoutID: (data.payoutID === 0 || data.payoutID === undefined || data.payoutID === null) ? 0 : Number(data.payoutID),
        referenceNumber: data.referenceNumber ?? '',
        status: data.status ?? '',
        reversedTransactionID: data.reversedTransactionID ?? '',
        capturedDate : (isEditMode ? ((initialLedgerTransaction as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialLedgerTransaction as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateLedgerTransaction(payload as LedgerTransaction) : await createLedgerTransaction(payload as LedgerTransaction);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`LedgerTransaction "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/ledgertransactions');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit LedgerTransaction' : 'Create LedgerTransaction'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Organization *" error={errors.organizationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationID')}>
              <option value="">Select Organization</option>
              {opts_organizationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Transaction Type" error={errors.transactionType?.message as string}>
            <input className="input" placeholder="Enter transaction type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('transactionType')}  />
          </Field>
          <Field label="Transaction Date" error={errors.transactionDate?.message as string}>
            <input className="input" placeholder="Select transaction date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('transactionDate')} />
          </Field>
          <Field label="Description" error={errors.description?.message as string}>
            <textarea className="input" placeholder="Enter description" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('description')} rows={3} />
          </Field>
          <Field label="Payment " error={errors.paymentID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paymentID')}>
              <option value="">Select Payment</option>
              {opts_paymentID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_paymentID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Invoice Master " error={errors.invoiceMasterID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('invoiceMasterID')}>
              <option value="">Select Invoice Master</option>
              {opts_invoiceMasterID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_invoiceMasterID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Refund " error={errors.refundID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('refundID')}>
              <option value="">Select Refund</option>
              {opts_refundID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_refundID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Payout " error={errors.payoutID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('payoutID')}>
              <option value="">Select Payout</option>
              {opts_payoutID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_payoutID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Reference Number" error={errors.referenceNumber?.message as string}>
            <textarea className="input" placeholder="Enter reference number" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('referenceNumber')} rows={3} />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="POSTED">POSTED</option>
              <option value="REVERSED">REVERSED</option>
            </select>
          </Field>
          <Field label="Reversed Transaction " error={errors.reversedTransactionID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('reversedTransactionID')}>
              <option value="">Select Reversed Transaction</option>
              {opts_reversedTransactionID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_reversedTransactionID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
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

