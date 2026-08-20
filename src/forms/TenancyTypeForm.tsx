{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { TenancyType } from '../types/TenancyType';
import { createTenancyType, updateTenancyType } from '../apis/useTenancyType';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const tenancyTypeSchema = z.object({
  code: z.string().max(50, "Code must be less than 50 characters").min(1, "Code is required"),
  name: z.string().max(100, "Name must be less than 100 characters").min(1, "Name is required"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  minimumMonths: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  maximumMonths: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  isPeriodic: z.boolean(),
  isActive: z.boolean(),
});

type TenancyTypeFormData = z.infer<typeof tenancyTypeSchema>;

interface TenancyTypeFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialTenancyType?: TenancyType | null;
  isEditMode?: boolean;
}

export default function TenancyTypeForm({ onAlert, initialTenancyType = null, isEditMode = false }: TenancyTypeFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getDefaultValues = React.useCallback((): TenancyTypeFormData => {
    const src = (initialTenancyType as any) ?? {};
    if (isEditMode && initialTenancyType) {
      return {
        code: (src?.code ?? ""),
        name: (src?.name ?? ""),
        description: (src?.description ?? ""),
        minimumMonths: (src?.minimumMonths ?? 0),
        maximumMonths: (src?.maximumMonths ?? 0),
        isPeriodic: Boolean(src?.isPeriodic),
        isActive: Boolean(src?.isActive),
      };
    }
    return {
      code: "",
      name: "",
      description: "",
      minimumMonths: 0,
      maximumMonths: 0,
      isPeriodic: false,
      isActive: false,
    };
  }, [isEditMode, initialTenancyType]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(tenancyTypeSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialTenancyType && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialTenancyType, reset, getDefaultValues, hasLoadedItem]);

  const onSubmitHandler = async (data: TenancyTypeFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} tenancytype...`, 'info');
      const payload: any = {
        tenancyTypeID: (isEditMode ? ((initialTenancyType as any)?.tenancyTypeID ?? 0) : 0),
        code: data.code ?? '',
        name: data.name ?? '',
        description: data.description ?? '',
        minimumMonths: data.minimumMonths,
        maximumMonths: data.maximumMonths,
        isPeriodic: data.isPeriodic,
        isActive: data.isActive,
        capturedDate : (isEditMode ? ((initialTenancyType as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialTenancyType as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateTenancyType(payload as TenancyType) : await createTenancyType(payload as TenancyType);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`TenancyType "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/tenancytypes');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit TenancyType' : 'Create TenancyType'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Code" error={errors.code?.message as string}>
            <input className="input" placeholder="Enter code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('code')}  />
          </Field>
          <Field label="Name" error={errors.name?.message as string}>
            <input className="input" placeholder="Enter name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('name')}  />
          </Field>
          <Field label="Description" error={errors.description?.message as string}>
            <textarea className="input" placeholder="Enter description" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('description')} rows={3} />
          </Field>
          <Field label="Minimum Months" error={errors.minimumMonths?.message as string}>
            <input className="input" placeholder="Enter minimum months" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('minimumMonths', { valueAsNumber: true })} />
          </Field>
          <Field label="Maximum Months" error={errors.maximumMonths?.message as string}>
            <input className="input" placeholder="Enter maximum months" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('maximumMonths', { valueAsNumber: true })} />
          </Field>
          <Field label="Is Periodic" error={errors.isPeriodic?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isPeriodic')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Active Status *" error={errors.isActive?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('isActive')}>
              <option value="">Select Active Status</option>
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

