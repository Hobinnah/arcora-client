{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { LedgerAccount } from '../types/LedgerAccount';
import { createLedgerAccount, updateLedgerAccount } from '../apis/useLedgerAccount';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const ledgerAccountSchema = z.object({
  organizationID: z.string().min(1, "Organization is required"),
  accountCode: z.string().max(100, "Account Code must be less than 100 characters").min(1, "Account Code is required"),
  accountType: z.string().max(100, "Account Type must be less than 100 characters").min(1, "Account Type is required"),
  accountCategory: z.string().max(100, "Account Category must be less than 100 characters").min(1, "Account Category is required"),
  currency: z.string().max(100, "Currency must be less than 100 characters").min(1, "Currency is required"),
  name: z.string().max(100, "Name must be less than 100 characters").min(1, "Name is required"),
  isSystemAccount: z.boolean(),
  isActive: z.boolean(),
});

type LedgerAccountFormData = z.infer<typeof ledgerAccountSchema>;

interface LedgerAccountFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialLedgerAccount?: LedgerAccount | null;
  isEditMode?: boolean;
}

export default function LedgerAccountForm({ onAlert, initialLedgerAccount = null, isEditMode = false }: LedgerAccountFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

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

  const getDefaultValues = React.useCallback((): LedgerAccountFormData => {
    const src = (initialLedgerAccount as any) ?? {};
    if (isEditMode && initialLedgerAccount) {
      return {
        organizationID: (src?.organizationID ?? ""),
        accountCode: (src?.accountCode ?? ""),
        accountType: (src?.accountType ?? ""),
        accountCategory: (src?.accountCategory ?? ""),
        currency: (src?.currency ?? ""),
        name: (src?.name ?? ""),
        isSystemAccount: Boolean(src?.isSystemAccount),
        isActive: Boolean(src?.isActive),
      };
    }
    return {
      organizationID: "",
      accountCode: "",
      accountType: "",
      accountCategory: "",
      currency: "",
      name: "",
      isSystemAccount: false,
      isActive: false,
    };
  }, [isEditMode, initialLedgerAccount]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(ledgerAccountSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialLedgerAccount && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialLedgerAccount, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialLedgerAccount && opts_organizationID.length > 0) {
      const currentorganizationID = (initialLedgerAccount as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = String(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialLedgerAccount, setValue]);

  const onSubmitHandler = async (data: LedgerAccountFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} ledgeraccount...`, 'info');
      const payload: any = {
        ledgerAccountID: (isEditMode ? ((initialLedgerAccount as any)?.ledgerAccountID ?? null) : null),
        organizationID: data.organizationID ?? '',
        accountCode: data.accountCode ?? '',
        accountType: data.accountType ?? '',
        accountCategory: data.accountCategory ?? '',
        currency: data.currency ?? '',
        name: data.name ?? '',
        isSystemAccount: data.isSystemAccount,
        isActive: data.isActive,
        capturedDate : (isEditMode ? ((initialLedgerAccount as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialLedgerAccount as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateLedgerAccount(payload as LedgerAccount) : await createLedgerAccount(payload as LedgerAccount);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`LedgerAccount "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/ledgeraccounts');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit LedgerAccount' : 'Create LedgerAccount'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Organization *" error={errors.organizationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationID')}>
              <option value="">Select Organization</option>
              {opts_organizationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Account Code" error={errors.accountCode?.message as string}>
            <input className="input" placeholder="Enter account code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('accountCode')}  />
          </Field>
          <Field label="Account Type" error={errors.accountType?.message as string}>
            <input className="input" placeholder="Enter account type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('accountType')}  />
          </Field>
          <Field label="Account Category" error={errors.accountCategory?.message as string}>
            <input className="input" placeholder="Enter account category" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('accountCategory')}  />
          </Field>
          <Field label="Currency" error={errors.currency?.message as string}>
            <input className="input" placeholder="Enter currency code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}  />
          </Field>
          <Field label="Name" error={errors.name?.message as string}>
            <input className="input" placeholder="Enter account name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('name')}  />
          </Field>
          <Field label="Is System Account" error={errors.isSystemAccount?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isSystemAccount')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Is Active *" error={errors.isActive?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('isActive')}>
              <option value="">Select Is Active</option>
              <option value="true">true</option>
              <option value="false">false</option>
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

