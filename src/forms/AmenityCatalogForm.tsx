{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { AmenityCatalog } from '../types/AmenityCatalog';
import { createAmenityCatalog, updateAmenityCatalog } from '../apis/useAmenityCatalog';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const amenityCatalogSchema = z.object({
  name: z.string().max(100, "Name must be less than 100 characters").min(1, "Name is required"),
  category: z.string().max(100, "Category must be less than 100 characters").optional(),
  isActive: z.boolean(),
});

type AmenityCatalogFormData = z.infer<typeof amenityCatalogSchema>;

interface AmenityCatalogFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialAmenityCatalog?: AmenityCatalog | null;
  isEditMode?: boolean;
}

export default function AmenityCatalogForm({ onAlert, initialAmenityCatalog = null, isEditMode = false }: AmenityCatalogFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getDefaultValues = React.useCallback((): AmenityCatalogFormData => {
    const src = (initialAmenityCatalog as any) ?? {};
    if (isEditMode && initialAmenityCatalog) {
      return {
        name: (src?.name ?? ""),
        category: (src?.category ?? ""),
        isActive: Boolean(src?.isActive),
      };
    }
    return {
      name: "",
      category: "",
      isActive: false,
    };
  }, [isEditMode, initialAmenityCatalog]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(amenityCatalogSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialAmenityCatalog && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialAmenityCatalog, reset, getDefaultValues, hasLoadedItem]);

  const onSubmitHandler = async (data: AmenityCatalogFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} amenitycatalog...`, 'info');
      const payload: any = {
        amenityID: (isEditMode ? ((initialAmenityCatalog as any)?.amenityID ?? null) : null),
        name: data.name ?? '',
        category: data.category ?? '',
        isActive: data.isActive,
        capturedDate : (isEditMode ? ((initialAmenityCatalog as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialAmenityCatalog as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateAmenityCatalog(payload as AmenityCatalog) : await createAmenityCatalog(payload as AmenityCatalog);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`AmenityCatalog "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/amenitycatalogs');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit AmenityCatalog' : 'Create AmenityCatalog'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Name" error={errors.name?.message as string}>
            <input className="input" placeholder="Enter amenity name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('name')}  />
          </Field>
          <Field label="Category" error={errors.category?.message as string}>
            <input className="input" placeholder="Enter category" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('category')}  />
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

