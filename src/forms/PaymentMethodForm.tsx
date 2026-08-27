{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { PaymentMethod } from '../types/PaymentMethod';
import { createPaymentMethod, updatePaymentMethod } from '../apis/usePaymentMethod';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const paymentMethodSchema = z.object({
  tenantID: z.string().min(1, "Tenant is required"),
  paymentMethodType: z.string().max(50, "Payment Method Type must be less than 50 characters").min(1, "Payment Method Type is required"),
  displayName: z.string().max(100, "Display Name must be less than 100 characters").optional(),
  accountLast4: z.string().max(20, "Account Last 4 must be less than 20 characters").optional(),
  cardBrand: z.string().max(50, "Card Brand must be less than 50 characters").optional(),
  bankName: z.string().max(100, "Bank Name must be less than 100 characters").optional(),
  expiryMonth: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  expiryYear: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  providerName: z.string().max(100, "Provider Name must be less than 100 characters").min(1, "Provider Name is required"),
  providerCustomerID: z.string().max(255, "Provider Customer ID must be less than 255 characters").min(1, "Provider Customer ID is required"),
  providerPaymentMethodID: z.string().max(255, "Provider Payment Method ID must be less than 255 characters").min(1, "Provider Payment Method ID is required"),
  verificationStatus: z.string().max(50, "Verification Status must be less than 50 characters").min(1, "Verification Status is required").refine(v => (v ?? '') === '' || ["PENDING", "VERIFIED", "FAILED"].includes(v as any), "Invalid Verification Status"),
  verifiedAt: z.string().optional(),
  isDefault: z.boolean(),
  isActive: z.boolean(),
});

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialPaymentMethod?: PaymentMethod | null;
  isEditMode?: boolean;
}

export default function PaymentMethodForm({ onAlert, initialPaymentMethod = null, isEditMode = false }: PaymentMethodFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_tenantID, setOpts_tenantID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_tenantID_loading, setOpts_tenantID_loading] = React.useState(false);

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

  const getDefaultValues = React.useCallback((): PaymentMethodFormData => {
    const src = (initialPaymentMethod as any) ?? {};
    if (isEditMode && initialPaymentMethod) {
      return {
        tenantID: (src?.tenantID ?? ""),
        paymentMethodType: (src?.paymentMethodType ?? ""),
        displayName: (src?.displayName ?? ""),
        accountLast4: (src?.accountLast4 ?? ""),
        cardBrand: (src?.cardBrand ?? ""),
        bankName: (src?.bankName ?? ""),
        expiryMonth: (src?.expiryMonth ?? 0),
        expiryYear: (src?.expiryYear ?? 0),
        providerName: (src?.providerName ?? ""),
        providerCustomerID: (src?.providerCustomerID ?? ""),
        providerPaymentMethodID: (src?.providerPaymentMethodID ?? ""),
        verificationStatus: (src?.verificationStatus ?? ""),
        verifiedAt: src?.verifiedAt ? new Date(src?.verifiedAt as any).toISOString().split('T')[0] : "",
        isDefault: Boolean(src?.isDefault),
        isActive: Boolean(src?.isActive),
      };
    }
    return {
      tenantID: "",
      paymentMethodType: "",
      displayName: "",
      accountLast4: "",
      cardBrand: "",
      bankName: "",
      expiryMonth: 0,
      expiryYear: 0,
      providerName: "",
      providerCustomerID: "",
      providerPaymentMethodID: "",
      verificationStatus: "",
      verifiedAt: "",
      isDefault: false,
      isActive: false,
    };
  }, [isEditMode, initialPaymentMethod]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(paymentMethodSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialPaymentMethod && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialPaymentMethod, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialPaymentMethod && opts_tenantID.length > 0) {
      const currenttenantID = (initialPaymentMethod as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = String(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialPaymentMethod, setValue]);

  const onSubmitHandler = async (data: PaymentMethodFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} paymentmethod...`, 'info');
      const payload: any = {
        paymentMethodID: (isEditMode ? ((initialPaymentMethod as any)?.paymentMethodID ?? null) : null),
        tenantID: data.tenantID ?? '',
        paymentMethodType: data.paymentMethodType ?? '',
        displayName: data.displayName ?? '',
        accountLast4: data.accountLast4 ?? '',
        cardBrand: data.cardBrand ?? '',
        bankName: data.bankName ?? '',
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        providerName: data.providerName ?? '',
        providerCustomerID: data.providerCustomerID ?? '',
        providerPaymentMethodID: data.providerPaymentMethodID ?? '',
        verificationStatus: data.verificationStatus ?? '',
        verifiedAt: data.verifiedAt || null,
        isDefault: data.isDefault,
        isActive: data.isActive,
        capturedBy: (isEditMode ? ((initialPaymentMethod as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        capturedDate : (isEditMode ? ((initialPaymentMethod as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        updatedDate : (isEditMode ? ((initialPaymentMethod as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialPaymentMethod as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updatePaymentMethod(payload as PaymentMethod) : await createPaymentMethod(payload as PaymentMethod);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`PaymentMethod "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/paymentmethods');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit PaymentMethod' : 'Create PaymentMethod'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Tenant *" error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Payment Method Type" error={errors.paymentMethodType?.message as string}>
            <input className="input" placeholder="Enter payment method type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paymentMethodType')}  />
          </Field>
          <Field label="Display Name" error={errors.displayName?.message as string}>
            <input className="input" placeholder="Enter display name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('displayName')}  />
          </Field>
          <Field label="Account Last 4" error={errors.accountLast4?.message as string}>
            <input className="input" placeholder="Enter last 4 digits" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('accountLast4')}  />
          </Field>
          <Field label="Card Brand" error={errors.cardBrand?.message as string}>
            <input className="input" placeholder="Enter card brand" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('cardBrand')}  />
          </Field>
          <Field label="Bank Name" error={errors.bankName?.message as string}>
            <input className="input" placeholder="Enter bank name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('bankName')}  />
          </Field>
          <Field label="Expiry Month" error={errors.expiryMonth?.message as string}>
            <input className="input" placeholder="Enter expiry month" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('expiryMonth', { valueAsNumber: true })} />
          </Field>
          <Field label="Expiry Year" error={errors.expiryYear?.message as string}>
            <input className="input" placeholder="Enter expiry year" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('expiryYear', { valueAsNumber: true })} />
          </Field>
          <Field label="Provider Name" error={errors.providerName?.message as string}>
            <input className="input" placeholder="Enter provider name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('providerName')}  />
          </Field>
          <Field label="Provider Customer ID" error={errors.providerCustomerID?.message as string}>
            <textarea className="input" placeholder="Enter provider customer ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerCustomerID')} rows={3} />
          </Field>
          <Field label="Provider Payment Method ID" error={errors.providerPaymentMethodID?.message as string}>
            <textarea className="input" placeholder="Enter provider payment method ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerPaymentMethodID')} rows={3} />
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
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('verifiedAt')} />
          </Field>
          <Field label="Is Default *" error={errors.isDefault?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('isDefault')}>
              <option value="">Select Is Default</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
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

