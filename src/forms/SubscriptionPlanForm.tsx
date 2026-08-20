{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { SubscriptionPlan } from '../types/SubscriptionPlan';
import { createSubscriptionPlan, updateSubscriptionPlan } from '../apis/useSubscriptionPlan';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const subscriptionPlanSchema = z.object({
  code: z.string().max(100, "Code must be less than 100 characters").min(1, "Code is required"),
  name: z.string().max(100, "Name must be less than 100 characters").min(1, "Name is required"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  monthlyPrice: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Monthly Price is required")),
  annualPrice: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  currency: z.string().max(3, "Currency must be less than 3 characters").min(1, "Currency is required"),
  maxProperties: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  maxRentalUnits: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  maxActiveListings: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  maxOrganizationMembers: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  features: z.string().max(256, "Features must be less than 256 characters").optional(),
  providerProductID: z.string().max(255, "Provider Product ID must be less than 255 characters").optional(),
  providerMonthlyPriceID: z.string().max(255, "Provider Monthly Price ID must be less than 255 characters").optional(),
  providerAnnualPriceID: z.string().max(255, "Provider Annual Price ID must be less than 255 characters").optional(),
  isActive: z.boolean(),
});

type SubscriptionPlanFormData = z.infer<typeof subscriptionPlanSchema>;

interface SubscriptionPlanFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialSubscriptionPlan?: SubscriptionPlan | null;
  isEditMode?: boolean;
}

export default function SubscriptionPlanForm({ onAlert, initialSubscriptionPlan = null, isEditMode = false }: SubscriptionPlanFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getDefaultValues = React.useCallback((): SubscriptionPlanFormData => {
    const src = (initialSubscriptionPlan as any) ?? {};
    if (isEditMode && initialSubscriptionPlan) {
      return {
        code: (src?.code ?? ""),
        name: (src?.name ?? ""),
        description: (src?.description ?? ""),
        monthlyPrice: (src?.monthlyPrice ?? 0),
        annualPrice: (src?.annualPrice ?? 0),
        currency: (src?.currency ?? ""),
        maxProperties: (src?.maxProperties ?? 0),
        maxRentalUnits: (src?.maxRentalUnits ?? 0),
        maxActiveListings: (src?.maxActiveListings ?? 0),
        maxOrganizationMembers: (src?.maxOrganizationMembers ?? 0),
        features: (src?.features ?? ""),
        providerProductID: (src?.providerProductID ?? ""),
        providerMonthlyPriceID: (src?.providerMonthlyPriceID ?? ""),
        providerAnnualPriceID: (src?.providerAnnualPriceID ?? ""),
        isActive: Boolean(src?.isActive),
      };
    }
    return {
      code: "",
      name: "",
      description: "",
      monthlyPrice: 0,
      annualPrice: 0,
      currency: "",
      maxProperties: 0,
      maxRentalUnits: 0,
      maxActiveListings: 0,
      maxOrganizationMembers: 0,
      features: "",
      providerProductID: "",
      providerMonthlyPriceID: "",
      providerAnnualPriceID: "",
      isActive: false,
    };
  }, [isEditMode, initialSubscriptionPlan]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(subscriptionPlanSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialSubscriptionPlan && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialSubscriptionPlan, reset, getDefaultValues, hasLoadedItem]);

  const onSubmitHandler = async (data: SubscriptionPlanFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} subscriptionplan...`, 'info');
      const payload: any = {
        subscriptionPlanID: (isEditMode ? ((initialSubscriptionPlan as any)?.subscriptionPlanID ?? null) : null),
        code: data.code ?? '',
        name: data.name ?? '',
        description: data.description ?? '',
        monthlyPrice: data.monthlyPrice,
        annualPrice: data.annualPrice,
        currency: data.currency ?? '',
        maxProperties: data.maxProperties,
        maxRentalUnits: data.maxRentalUnits,
        maxActiveListings: data.maxActiveListings,
        maxOrganizationMembers: data.maxOrganizationMembers,
        features: data.features ?? '',
        providerProductID: data.providerProductID ?? '',
        providerMonthlyPriceID: data.providerMonthlyPriceID ?? '',
        providerAnnualPriceID: data.providerAnnualPriceID ?? '',
        isActive: data.isActive,
        capturedDate : (isEditMode ? ((initialSubscriptionPlan as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialSubscriptionPlan as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialSubscriptionPlan as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialSubscriptionPlan as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateSubscriptionPlan(payload as SubscriptionPlan) : await createSubscriptionPlan(payload as SubscriptionPlan);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`SubscriptionPlan "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/subscriptionplans');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit SubscriptionPlan' : 'Create SubscriptionPlan'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Code" error={errors.code?.message as string}>
            <input className="input" placeholder="Enter plan code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('code')}  />
          </Field>
          <Field label="Name" error={errors.name?.message as string}>
            <input className="input" placeholder="Enter plan name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('name')}  />
          </Field>
          <Field label="Description" error={errors.description?.message as string}>
            <textarea className="input" placeholder="Enter description" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('description')} rows={3} />
          </Field>
          <Field label="Monthly Price" error={errors.monthlyPrice?.message as string}>
            <input className="input" placeholder="Enter monthly price" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('monthlyPrice', { valueAsNumber: true })} />
          </Field>
          <Field label="Annual Price" error={errors.annualPrice?.message as string}>
            <input className="input" placeholder="Enter annual price" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('annualPrice', { valueAsNumber: true })} />
          </Field>
          <Field label="Currency" error={errors.currency?.message as string}>
            <input className="input" placeholder="Enter currency code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}  />
          </Field>
          <Field label="Max Properties" error={errors.maxProperties?.message as string}>
            <input className="input" placeholder="Enter max properties" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('maxProperties', { valueAsNumber: true })} />
          </Field>
          <Field label="Max Rental Units" error={errors.maxRentalUnits?.message as string}>
            <input className="input" placeholder="Enter max rental units" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('maxRentalUnits', { valueAsNumber: true })} />
          </Field>
          <Field label="Max Active Listings" error={errors.maxActiveListings?.message as string}>
            <input className="input" placeholder="Enter max active listings" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('maxActiveListings', { valueAsNumber: true })} />
          </Field>
          <Field label="Max Organization Members" error={errors.maxOrganizationMembers?.message as string}>
            <input className="input" placeholder="Enter max organization members" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('maxOrganizationMembers', { valueAsNumber: true })} />
          </Field>
          <Field label="Features" error={errors.features?.message as string}>
            <textarea className="input" placeholder="Enter features" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('features')} rows={3} />
          </Field>
          <Field label="Provider Product ID" error={errors.providerProductID?.message as string}>
            <textarea className="input" placeholder="Enter provider product ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerProductID')} rows={3} />
          </Field>
          <Field label="Provider Monthly Price ID" error={errors.providerMonthlyPriceID?.message as string}>
            <textarea className="input" placeholder="Enter provider monthly price ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerMonthlyPriceID')} rows={3} />
          </Field>
          <Field label="Provider Annual Price ID" error={errors.providerAnnualPriceID?.message as string}>
            <textarea className="input" placeholder="Enter provider annual price ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerAnnualPriceID')} rows={3} />
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

