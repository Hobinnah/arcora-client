{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { TaxRate } from '../types/TaxRate';
import { createTaxRate, updateTaxRate } from '../apis/useTaxRate';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const taxRateSchema = z.object({
  code: z.string().max(50, "Code must be less than 50 characters").min(1, "Code is required"),
  name: z.string().max(100, "Name must be less than 100 characters").min(1, "Name is required"),
  countryCode: z.string().max(2, "Country Code must be less than 2 characters").min(1, "Country Code is required"),
  provinceCode: z.string().max(10, "Province Code must be less than 10 characters").optional(),
  rate: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Rate is required")),
  effectiveFrom: z.string(),
  effectiveTo: z.string().optional(),
  isActive: z.boolean(),
});

type TaxRateFormData = z.infer<typeof taxRateSchema>;

interface TaxRateFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialTaxRate?: TaxRate | null;
  isEditMode?: boolean;
}

export default function TaxRateForm({ onAlert, initialTaxRate = null, isEditMode = false }: TaxRateFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getDefaultValues = React.useCallback((): TaxRateFormData => {
    const src = (initialTaxRate as any) ?? {};
    if (isEditMode && initialTaxRate) {
      return {
        code: (src?.code ?? ""),
        name: (src?.name ?? ""),
        countryCode: (src?.countryCode ?? ""),
        provinceCode: (src?.provinceCode ?? ""),
        rate: (src?.rate ?? 0),
        effectiveFrom: src?.effectiveFrom ? new Date(src?.effectiveFrom as any).toISOString().split('T')[0] : "",
        effectiveTo: src?.effectiveTo ? new Date(src?.effectiveTo as any).toISOString().split('T')[0] : "",
        isActive: Boolean(src?.isActive),
      };
    }
    return {
      code: "",
      name: "",
      countryCode: "",
      provinceCode: "",
      rate: 0,
      effectiveFrom: "",
      effectiveTo: "",
      isActive: false,
    };
  }, [isEditMode, initialTaxRate]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(taxRateSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialTaxRate && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialTaxRate, reset, getDefaultValues, hasLoadedItem]);

  const onSubmitHandler = async (data: TaxRateFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} taxrate...`, 'info');
      const payload: any = {
        taxID: (isEditMode ? ((initialTaxRate as any)?.taxID ?? 0) : 0),
        code: data.code ?? '',
        name: data.name ?? '',
        countryCode: data.countryCode ?? '',
        provinceCode: data.provinceCode ?? '',
        rate: data.rate,
        effectiveFrom: data.effectiveFrom || null,
        effectiveTo: data.effectiveTo || null,
        isActive: data.isActive,
        capturedDate : (isEditMode ? ((initialTaxRate as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialTaxRate as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateTaxRate(payload as TaxRate) : await createTaxRate(payload as TaxRate);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`TaxRate "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/taxrates');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit TaxRate' : 'Create TaxRate'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Code" error={errors.code?.message as string}>
            <input className="input" placeholder="Enter tax code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('code')}  />
          </Field>
          <Field label="Name" error={errors.name?.message as string}>
            <input className="input" placeholder="Enter tax name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('name')}  />
          </Field>
          <Field label="Country Code" error={errors.countryCode?.message as string}>
            <input className="input" placeholder="Enter country code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('countryCode')}  />
          </Field>
          <Field label="Province Code" error={errors.provinceCode?.message as string}>
            <input className="input" placeholder="Enter province code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('provinceCode')}  />
          </Field>
          <Field label="Rate" error={errors.rate?.message as string}>
            <input className="input" placeholder="Enter tax rate" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('rate', { valueAsNumber: true })} />
          </Field>
          <Field label="Effective From" error={errors.effectiveFrom?.message as string}>
            <input className="input" placeholder="Select effective from date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('effectiveFrom')} />
          </Field>
          <Field label="Effective To" error={errors.effectiveTo?.message as string}>
            <input className="input" placeholder="Select effective to date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('effectiveTo')} />
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

