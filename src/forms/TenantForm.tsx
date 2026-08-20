{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { Tenant } from '../types/Tenant';
import { createTenant, updateTenant } from '../apis/useTenant';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const tenantSchema = z.object({
  code: z.string().max(100, "Code must be less than 100 characters").min(1, "Code is required"),
  userID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "UserID is required")),
  description: z.string().max(256, "Description must be less than 256 characters").min(1, "Description is required"),
  phoneNumber: z.string().max(100, "Phone must be less than 100 characters").optional(),
  photoUrl: z.string().max(256, "Photo URL must be less than 256 characters").optional(),
  dateOfBirth: z.string().optional(),
  profileStatus: z.string().max(100, "Profile Status must be less than 100 characters").optional().refine(v => (v ?? '') === '' || ["INCOMPLETE", "COMPLETE", "VERIFIED"].includes(v as any), "Invalid Profile Status"),
  isActive: z.boolean().optional(),
});

type TenantFormData = z.infer<typeof tenantSchema>;

interface TenantFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialTenant?: Tenant | null;
  isEditMode?: boolean;
}

export default function TenantForm({ onAlert, initialTenant = null, isEditMode = false }: TenantFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getDefaultValues = React.useCallback((): TenantFormData => {
    const src = (initialTenant as any) ?? {};
    if (isEditMode && initialTenant) {
      return {
        code: (src?.code ?? ""),
        userID: (src?.userID ?? 0),
        description: (src?.description ?? ""),
        phoneNumber: (src?.phoneNumber ?? ""),
        photoUrl: (src?.photoUrl ?? ""),
        dateOfBirth: src?.dateOfBirth ? new Date(src?.dateOfBirth as any).toISOString().split('T')[0] : "",
        profileStatus: (src?.profileStatus ?? ""),
        isActive: Boolean(src?.isActive),
      };
    }
    return {
      code: "",
      userID: currentUser?.user?.userId ?? 0,
      description: "",
      phoneNumber: "",
      photoUrl: "",
      dateOfBirth: "",
      profileStatus: "",
      isActive: false,
    };
  }, [isEditMode, initialTenant]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(tenantSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialTenant && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialTenant, reset, getDefaultValues, hasLoadedItem]);

  const onSubmitHandler = async (data: TenantFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} tenant...`, 'info');
      const payload: any = {
        tenantID: (isEditMode ? ((initialTenant as any)?.tenantID ?? null) : null),
        code: data.code ?? '',
        userID: data.userID,
        description: data.description ?? '',
        phoneNumber: data.phoneNumber ?? '',
        photoUrl: data.photoUrl ?? '',
        dateOfBirth: data.dateOfBirth || null,
        profileStatus: data.profileStatus ?? '',
        isActive: data.isActive,
        capturedBy: (isEditMode ? ((initialTenant as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        capturedDate : (isEditMode ? ((initialTenant as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        updatedBy: (isEditMode ? ((initialTenant as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialTenant as any)?.updatedDate ?? null) : null),
      };
      let result: any;
      result = isEditMode ? await updateTenant(payload as Tenant) : await createTenant(payload as Tenant);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`Tenant "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/tenants');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit Tenant' : 'Create Tenant'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Code" error={errors.code?.message as string}>
            <input className="input" placeholder="Enter code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('code')}  />
          </Field>
          <Field label="UserID" error={errors.userID?.message as string}>
            <input className="input" placeholder="Enter UserID" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('userID', { valueAsNumber: true })} />
          </Field>
          <Field label="Description" error={errors.description?.message as string}>
            <textarea className="input" placeholder="Enter description" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('description')} rows={3} />
          </Field>
          <Field label="Phone" error={errors.phoneNumber?.message as string}>
            <input className="input" placeholder="Enter phone number" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('phoneNumber')}  />
          </Field>
          <Field label="Photo URL" error={errors.photoUrl?.message as string}>
            <textarea className="input" placeholder="Enter photo URL" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('photoUrl')} rows={3} />
          </Field>
          <Field label="Date of Birth" error={errors.dateOfBirth?.message as string}>
            <input className="input" placeholder="Enter date of birth" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('dateOfBirth')} />
          </Field>
          <Field label="Profile Status " error={errors.profileStatus?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('profileStatus')}>
              <option value="">Select Profile Status</option>
              <option value="INCOMPLETE">INCOMPLETE</option>
              <option value="COMPLETE">COMPLETE</option>
              <option value="VERIFIED">VERIFIED</option>
            </select>
          </Field>
          <Field label="Is Active" error={errors.isActive?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isActive')} />
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

