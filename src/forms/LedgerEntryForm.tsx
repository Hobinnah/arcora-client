{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { LedgerEntry } from '../types/LedgerEntry';
import { createLedgerEntry, updateLedgerEntry } from '../apis/useLedgerEntry';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const ledgerEntrySchema = z.object({
  ledgerTransactionID: z.string().min(1, "Ledger Transaction is required"),
  ledgerAccountID: z.string().min(1, "Ledger Account is required"),
  debitAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Debit Amount is required")),
  creditAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Credit Amount is required")),
  currency: z.string().max(3, "Currency must be less than 3 characters").min(1, "Currency is required"),
  description: z.string().max(255, "Description must be less than 255 characters").optional(),
});

type LedgerEntryFormData = z.infer<typeof ledgerEntrySchema>;

interface LedgerEntryFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialLedgerEntry?: LedgerEntry | null;
  isEditMode?: boolean;
}

export default function LedgerEntryForm({ onAlert, initialLedgerEntry = null, isEditMode = false }: LedgerEntryFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_ledgerTransactionID, setOpts_ledgerTransactionID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_ledgerTransactionID_loading, setOpts_ledgerTransactionID_loading] = React.useState(false);
  const [opts_ledgerAccountID, setOpts_ledgerAccountID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_ledgerAccountID_loading, setOpts_ledgerAccountID_loading] = React.useState(false);

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

  async function loadOptions_ledgerTransactionID(){
    try { setOpts_ledgerTransactionID_loading(true);
      const url = "api/ledgertransaction/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'ledgerTransactionID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["ledgerTransactionID", "name", "ledgerTransactionName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["ledgerTransactionID", "ledgerTransactionID", "id", "ID", "ledgerTransactionID", "ledgerTransactionId"], String(it))
      }));
      setOpts_ledgerTransactionID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_ledgerTransactionID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_ledgerTransactionID(); }, []);

  async function loadOptions_ledgerAccountID(){
    try { setOpts_ledgerAccountID_loading(true);
      const url = "api/ledgeraccount/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'ledgerAccountID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "ledgerAccountName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["ledgerAccountID", "ledgerAccountID", "id", "ID", "ledgerAccountID", "ledgerAccountId"], String(it))
      }));
      setOpts_ledgerAccountID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_ledgerAccountID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_ledgerAccountID(); }, []);

  const getDefaultValues = React.useCallback((): LedgerEntryFormData => {
    const src = (initialLedgerEntry as any) ?? {};
    if (isEditMode && initialLedgerEntry) {
      return {
        ledgerTransactionID: (src?.ledgerTransactionID ?? ""),
        ledgerAccountID: (src?.ledgerAccountID ?? ""),
        debitAmount: (src?.debitAmount ?? 0),
        creditAmount: (src?.creditAmount ?? 0),
        currency: (src?.currency ?? ""),
        description: (src?.description ?? ""),
      };
    }
    return {
      ledgerTransactionID: "",
      ledgerAccountID: "",
      debitAmount: 0,
      creditAmount: 0,
      currency: "",
      description: "",
    };
  }, [isEditMode, initialLedgerEntry]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(ledgerEntrySchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialLedgerEntry && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialLedgerEntry, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLedgerEntry && opts_ledgerTransactionID.length > 0) {
      const currentledgerTransactionID = (initialLedgerEntry as any)?.ledgerTransactionID ;
      if (currentledgerTransactionID !== undefined && currentledgerTransactionID!== null) {
        const ledgerTransactionIDValue = String(currentledgerTransactionID);
        if (opts_ledgerTransactionID.some(opt => opt.value === String(ledgerTransactionIDValue))) {
          setValue('ledgerTransactionID', ledgerTransactionIDValue);
        }
      }
    }
  }, [opts_ledgerTransactionID, isEditMode, initialLedgerEntry, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLedgerEntry && opts_ledgerAccountID.length > 0) {
      const currentledgerAccountID = (initialLedgerEntry as any)?.ledgerAccountID ;
      if (currentledgerAccountID !== undefined && currentledgerAccountID!== null) {
        const ledgerAccountIDValue = String(currentledgerAccountID);
        if (opts_ledgerAccountID.some(opt => opt.value === String(ledgerAccountIDValue))) {
          setValue('ledgerAccountID', ledgerAccountIDValue);
        }
      }
    }
  }, [opts_ledgerAccountID, isEditMode, initialLedgerEntry, setValue]);

  const onSubmitHandler = async (data: LedgerEntryFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} ledgerentry...`, 'info');
      const payload: any = {
        ledgerEntryID: (isEditMode ? ((initialLedgerEntry as any)?.ledgerEntryID ?? null) : null),
        ledgerTransactionID: data.ledgerTransactionID ?? '',
        ledgerAccountID: data.ledgerAccountID ?? '',
        debitAmount: data.debitAmount,
        creditAmount: data.creditAmount,
        currency: data.currency ?? '',
        description: data.description ?? '',
        capturedDate : (isEditMode ? ((initialLedgerEntry as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialLedgerEntry as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateLedgerEntry(payload as LedgerEntry) : await createLedgerEntry(payload as LedgerEntry);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`LedgerEntry "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/ledgerentries');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit LedgerEntry' : 'Create LedgerEntry'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Ledger Transaction *" error={errors.ledgerTransactionID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('ledgerTransactionID')}>
              <option value="">Select Ledger Transaction</option>
              {opts_ledgerTransactionID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_ledgerTransactionID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Ledger Account *" error={errors.ledgerAccountID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('ledgerAccountID')}>
              <option value="">Select Ledger Account</option>
              {opts_ledgerAccountID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_ledgerAccountID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Debit Amount" error={errors.debitAmount?.message as string}>
            <input className="input" placeholder="Enter debit amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('debitAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Credit Amount" error={errors.creditAmount?.message as string}>
            <input className="input" placeholder="Enter credit amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('creditAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Currency" error={errors.currency?.message as string}>
            <input className="input" placeholder="Enter currency" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}  />
          </Field>
          <Field label="Description" error={errors.description?.message as string}>
            <textarea className="input" placeholder="Enter description" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('description')} rows={3} />
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

