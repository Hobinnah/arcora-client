{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { FeeType } from '../types/FeeType';
import { createFeeType, updateFeeType } from '../apis/useFeeType';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const feeTypeSchema = z.object({
  name: z.string().max(100, "Name must be less than 100 characters").min(1, "Name is required"),
  isPlatformFee: z.boolean().optional(),
});

type FeeTypeFormData = z.infer<typeof feeTypeSchema>;

interface FeeTypeFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialFeeType?: FeeType | null;
  isEditMode?: boolean;
}

export default function FeeTypeForm({ onAlert, initialFeeType = null, isEditMode = false }: FeeTypeFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getDefaultValues = React.useCallback((): FeeTypeFormData => {
    const src = (initialFeeType as any) ?? {};
    if (isEditMode && initialFeeType) {
      return {
        name: (src?.name ?? ""),
        isPlatformFee: Boolean(src?.isPlatformFee),
      };
    }
    return {
      name: "",
      isPlatformFee: false,
    };
  }, [isEditMode, initialFeeType]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(feeTypeSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialFeeType && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialFeeType, reset, getDefaultValues, hasLoadedItem]);

  const onSubmitHandler = async (data: FeeTypeFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} feetype...`, 'info');
      const payload: any = {
        feeTypeID: (isEditMode ? ((initialFeeType as any)?.feeTypeID ?? 0) : 0),
        name: data.name ?? '',
        isPlatformFee: data.isPlatformFee,
        capturedDate : (isEditMode ? ((initialFeeType as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialFeeType as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateFeeType(payload as FeeType) : await createFeeType(payload as FeeType);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`FeeType "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/feetypes');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit FeeType' : 'Create FeeType'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Name" error={errors.name?.message as string}>
            <input className="input" placeholder="Enter fee type name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('name')}  />
          </Field>
          <Field label="Is Platform Fee" error={errors.isPlatformFee?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isPlatformFee')} />
              <span>Yes</span>
            </label>
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

