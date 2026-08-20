{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { Organization } from '../types/Organization';
import { createOrganization, updateOrganization } from '../apis/useOrganization';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const organizationSchema = z.object({
  legalName: z.string().max(100, "Legal Name must be less than 100 characters").min(1, "Legal Name is required"),
  displayName: z.string().max(100, "Display Name must be less than 100 characters").min(1, "Display Name is required"),
  businessNumber: z.string().max(100, "Business Number must be less than 100 characters").optional(),
  countryCode: z.string().max(2, "Country Code must be less than 2 characters").min(1, "Country Code is required"),
  provinceCode: z.string().max(10, "Province Code must be less than 10 characters").optional(),
  isPersonal: z.boolean(),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["ACTIVE", "SUSPENDED", "CLOSED"].includes(v as any), "Invalid Status"),
  defaultCurrency: z.string().max(3, "Default Currency must be less than 3 characters").min(1, "Default Currency is required"),
  timeZone: z.string().max(100, "Time Zone must be less than 100 characters").min(1, "Time Zone is required"),
  invoicePrefix: z.string().max(50, "Invoice Prefix must be less than 50 characters").optional(),
  receiptPrefix: z.string().max(50, "Receipt Prefix must be less than 50 characters").optional(),
  lateFeeEnabled: z.boolean(),
  autoInvoiceGeneration: z.boolean(),
  autoPaymentRetry: z.boolean(),
  paymentProvider: z.string().max(100, "Payment Provider must be less than 100 characters").optional(),
  brandLogoUrl: z.string().max(500, "Brand Logo URL must be less than 500 characters").optional(),
  requireBackgroundCheck: z.boolean(),
  rankingScore: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

interface OrganizationFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialOrganization?: Organization | null;
  isEditMode?: boolean;
}

export default function OrganizationForm({ onAlert, initialOrganization = null, isEditMode = false }: OrganizationFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getDefaultValues = React.useCallback((): OrganizationFormData => {
    const src = (initialOrganization as any) ?? {};
    if (isEditMode && initialOrganization) {
      return {
        legalName: (src?.legalName ?? ""),
        displayName: (src?.displayName ?? ""),
        businessNumber: (src?.businessNumber ?? ""),
        countryCode: (src?.countryCode ?? ""),
        provinceCode: (src?.provinceCode ?? ""),
        isPersonal: Boolean(src?.isPersonal),
        status: (src?.status ?? ""),
        defaultCurrency: (src?.defaultCurrency ?? ""),
        timeZone: (src?.timeZone ?? ""),
        invoicePrefix: (src?.invoicePrefix ?? ""),
        receiptPrefix: (src?.receiptPrefix ?? ""),
        lateFeeEnabled: Boolean(src?.lateFeeEnabled),
        autoInvoiceGeneration: Boolean(src?.autoInvoiceGeneration),
        autoPaymentRetry: Boolean(src?.autoPaymentRetry),
        paymentProvider: (src?.paymentProvider ?? ""),
        brandLogoUrl: (src?.brandLogoUrl ?? ""),
        requireBackgroundCheck: Boolean(src?.requireBackgroundCheck),
        rankingScore: (src?.rankingScore ?? 0),
      };
    }
    return {
      legalName: "",
      displayName: "",
      businessNumber: "",
      countryCode: "",
      provinceCode: "",
      isPersonal: false,
      status: "ACTIVE",
      defaultCurrency: "",
      timeZone: "",
      invoicePrefix: "",
      receiptPrefix: "",
      lateFeeEnabled: false,
      autoInvoiceGeneration: false,
      autoPaymentRetry: false,
      paymentProvider: "",
      brandLogoUrl: "",
      requireBackgroundCheck: false,
      rankingScore: 0,
    };
  }, [isEditMode, initialOrganization]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(organizationSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialOrganization && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialOrganization, reset, getDefaultValues, hasLoadedItem]);

  const onSubmitHandler = async (data: OrganizationFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} organization...`, 'info');
      const payload: any = {
        organizationID: (isEditMode ? ((initialOrganization as any)?.organizationID ?? null) : null),
        legalName: data.legalName ?? '',
        displayName: data.displayName ?? '',
        businessNumber: data.businessNumber ?? '',
        countryCode: data.countryCode ?? '',
        provinceCode: data.provinceCode ?? '',
        isPersonal: data.isPersonal,
        status: data.status ?? '',
        defaultCurrency: data.defaultCurrency ?? '',
        timeZone: data.timeZone ?? '',
        invoicePrefix: data.invoicePrefix ?? '',
        receiptPrefix: data.receiptPrefix ?? '',
        lateFeeEnabled: data.lateFeeEnabled,
        autoInvoiceGeneration: data.autoInvoiceGeneration,
        autoPaymentRetry: data.autoPaymentRetry,
        paymentProvider: data.paymentProvider ?? '',
        brandLogoUrl: data.brandLogoUrl ?? '',
        requireBackgroundCheck: data.requireBackgroundCheck,
        rankingScore: data.rankingScore,
        capturedDate : (isEditMode ? ((initialOrganization as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialOrganization as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialOrganization as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialOrganization as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateOrganization(payload as Organization) : await createOrganization(payload as Organization);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`Organization "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/organizations');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit Organization' : 'Create Organization'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Legal Name" error={errors.legalName?.message as string}>
            <input className="input" placeholder="Enter legal name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('legalName')}  />
          </Field>
          <Field label="Display Name" error={errors.displayName?.message as string}>
            <input className="input" placeholder="Enter display name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('displayName')}  />
          </Field>
          <Field label="Business Number" error={errors.businessNumber?.message as string}>
            <input className="input" placeholder="Enter business number" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('businessNumber')}  />
          </Field>
          <Field label="Country Code" error={errors.countryCode?.message as string}>
            <input className="input" placeholder="Enter country code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('countryCode')}  />
          </Field>
          <Field label="Province Code" error={errors.provinceCode?.message as string}>
            <input className="input" placeholder="Enter province code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('provinceCode')}  />
          </Field>
          <Field label="Is Personal" error={errors.isPersonal?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isPersonal')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </Field>
          <Field label="Default Currency" error={errors.defaultCurrency?.message as string}>
            <input className="input" placeholder="Enter currency code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('defaultCurrency')}  />
          </Field>
          <Field label="Time Zone" error={errors.timeZone?.message as string}>
            <input className="input" placeholder="Enter time zone" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('timeZone')}  />
          </Field>
          <Field label="Invoice Prefix" error={errors.invoicePrefix?.message as string}>
            <input className="input" placeholder="Enter invoice prefix" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('invoicePrefix')}  />
          </Field>
          <Field label="Receipt Prefix" error={errors.receiptPrefix?.message as string}>
            <input className="input" placeholder="Enter receipt prefix" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('receiptPrefix')}  />
          </Field>
          <Field label="Late Fee Enabled" error={errors.lateFeeEnabled?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('lateFeeEnabled')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Auto Invoice Generation" error={errors.autoInvoiceGeneration?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('autoInvoiceGeneration')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Auto Payment Retry" error={errors.autoPaymentRetry?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('autoPaymentRetry')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Payment Provider" error={errors.paymentProvider?.message as string}>
            <input className="input" placeholder="Enter payment provider" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('paymentProvider')}  />
          </Field>
          <Field label="Brand Logo URL" error={errors.brandLogoUrl?.message as string}>
            <textarea className="input" placeholder="Enter logo URL" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('brandLogoUrl')} rows={3} />
          </Field>
          <Field label="Require Background Check" error={errors.requireBackgroundCheck?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('requireBackgroundCheck')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Ranking Score" error={errors.rankingScore?.message as string}>
            <input className="input" placeholder="Enter ranking score" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('rankingScore', { valueAsNumber: true })} />
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

