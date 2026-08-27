{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { OrgPayoutAccount } from '../types/OrgPayoutAccount';
import { createOrgPayoutAccount, updateOrgPayoutAccount } from '../apis/useOrgPayoutAccount';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const orgPayoutAccountSchema = z.object({
  organizationID: z.string().min(1, "Organization is required"),
  providerName: z.string().max(100, "Provider Name must be less than 100 characters").min(1, "Provider Name is required"),
  providerAccountID: z.string().max(100, "Provider Account ID must be less than 100 characters").min(1, "Provider Account ID is required"),
  accountType: z.string().max(100, "Account Type must be less than 100 characters").optional(),
  bankName: z.string().max(100, "Bank Name must be less than 100 characters").optional(),
  accountLast4: z.string().max(4, "Account Last 4 must be less than 4 characters").optional(),
  currency: z.string().max(10, "Currency must be less than 10 characters").min(1, "Currency is required"),
  verificationStatus: z.string().max(50, "Verification Status must be less than 50 characters").min(1, "Verification Status is required").refine(v => (v ?? '') === '' || ["PENDING", "VERIFIED", "FAILED"].includes(v as any), "Invalid Verification Status"),
  verifiedAt: z.string().optional(),
  isDefault: z.boolean(),
  isActive: z.boolean(),
});

type OrgPayoutAccountFormData = z.infer<typeof orgPayoutAccountSchema>;

interface OrgPayoutAccountFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialOrgPayoutAccount?: OrgPayoutAccount | null;
  isEditMode?: boolean;
}

export default function OrgPayoutAccountForm({ onAlert, initialOrgPayoutAccount = null, isEditMode = false }: OrgPayoutAccountFormProps) {
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

  const getDefaultValues = React.useCallback((): OrgPayoutAccountFormData => {
    const src = (initialOrgPayoutAccount as any) ?? {};
    if (isEditMode && initialOrgPayoutAccount) {
      return {
        organizationID: (src?.organizationID ?? ""),
        providerName: (src?.providerName ?? ""),
        providerAccountID: (src?.providerAccountID ?? ""),
        accountType: (src?.accountType ?? ""),
        bankName: (src?.bankName ?? ""),
        accountLast4: (src?.accountLast4 ?? ""),
        currency: (src?.currency ?? ""),
        verificationStatus: (src?.verificationStatus ?? ""),
        verifiedAt: src?.verifiedAt ? new Date(src?.verifiedAt as any).toISOString().split('T')[0] : "",
        isDefault: Boolean(src?.isDefault),
        isActive: Boolean(src?.isActive),
      };
    }
    return {
      organizationID: "",
      providerName: "",
      providerAccountID: "",
      accountType: "",
      bankName: "",
      accountLast4: "",
      currency: "",
      verificationStatus: "",
      verifiedAt: "",
      isDefault: false,
      isActive: false,
    };
  }, [isEditMode, initialOrgPayoutAccount]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(orgPayoutAccountSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialOrgPayoutAccount && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialOrgPayoutAccount, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialOrgPayoutAccount && opts_organizationID.length > 0) {
      const currentorganizationID = (initialOrgPayoutAccount as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = String(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialOrgPayoutAccount, setValue]);

  const onSubmitHandler = async (data: OrgPayoutAccountFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} orgpayoutaccount...`, 'info');
      const payload: any = {
        orgPayoutAccountID: (isEditMode ? ((initialOrgPayoutAccount as any)?.orgPayoutAccountID ?? 0) : 0),
        organizationID: data.organizationID ?? '',
        providerName: data.providerName ?? '',
        providerAccountID: data.providerAccountID ?? '',
        accountType: data.accountType ?? '',
        bankName: data.bankName ?? '',
        accountLast4: data.accountLast4 ?? '',
        currency: data.currency ?? '',
        verificationStatus: data.verificationStatus ?? '',
        verifiedAt: data.verifiedAt || null,
        isDefault: data.isDefault,
        isActive: data.isActive,
        capturedDate : (isEditMode ? ((initialOrgPayoutAccount as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialOrgPayoutAccount as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialOrgPayoutAccount as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialOrgPayoutAccount as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateOrgPayoutAccount(payload as OrgPayoutAccount) : await createOrgPayoutAccount(payload as OrgPayoutAccount);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`OrgPayoutAccount "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/orgpayoutaccounts');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit OrgPayoutAccount' : 'Create OrgPayoutAccount'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Organization *" error={errors.organizationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationID')}>
              <option value="">Select Organization</option>
              {opts_organizationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Provider Name" error={errors.providerName?.message as string}>
            <input className="input" placeholder="Enter provider name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('providerName')}  />
          </Field>
          <Field label="Provider Account ID" error={errors.providerAccountID?.message as string}>
            <input className="input" placeholder="Enter provider account ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('providerAccountID')}  />
          </Field>
          <Field label="Account Type" error={errors.accountType?.message as string}>
            <input className="input" placeholder="Enter account type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('accountType')}  />
          </Field>
          <Field label="Bank Name" error={errors.bankName?.message as string}>
            <input className="input" placeholder="Enter bank name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('bankName')}  />
          </Field>
          <Field label="Account Last 4" error={errors.accountLast4?.message as string}>
            <input className="input" placeholder="Enter last 4 digits" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('accountLast4')}  />
          </Field>
          <Field label="Currency" error={errors.currency?.message as string}>
            <input className="input" placeholder="Enter currency" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}  />
          </Field>
          <Field label="Verification Status *" error={errors.verificationStatus?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('verificationStatus')}>
              <option value="">Select Verification Status</option>
              <option value="PENDING">PENDING</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </Field>
          <Field label="Verified At" error={errors.verifiedAt?.message as string}>
            <input className="input" placeholder="Select verification date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('verifiedAt')} />
          </Field>
          <Field label="Is Default" error={errors.isDefault?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isDefault')} />
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

