{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { Attachment } from '../types/Attachment';
import { createAttachment, updateAttachment } from '../apis/useAttachment';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const attachmentSchema = z.object({
  entityType: z.string().max(100, "Entity Type must be less than 100 characters").min(1, "Entity Type is required"),
  entityID: z.string().max(100, "Entity ID must be less than 100 characters").min(1, "Entity ID is required"),
  fileName: z.string().max(100, "File Name must be less than 100 characters").min(1, "File Name is required"),
  mimeType: z.string().max(100, "MIME Type must be less than 100 characters").optional(),
  fileSizeBytes: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  storageProvider: z.string().max(100, "Storage Provider must be less than 100 characters").optional(),
  storageReference: z.string().max(500, "Storage Reference must be less than 500 characters").min(1, "Storage Reference is required"),
  attachmentType: z.string().max(50, "Attachment Type must be less than 50 characters").optional(),
  description: z.string().max(255, "Description must be less than 255 characters").optional(),
  capturedDate: z.string().optional(),
  capturedBy: z.string().max(100, "Captured By must be less than 100 characters").optional(),
});

type AttachmentFormData = z.infer<typeof attachmentSchema>;

interface AttachmentFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialAttachment?: Attachment | null;
  isEditMode?: boolean;
}

export default function AttachmentForm({ onAlert, initialAttachment = null, isEditMode = false }: AttachmentFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getDefaultValues = React.useCallback((): AttachmentFormData => {
    const src = (initialAttachment as any) ?? {};
    if (isEditMode && initialAttachment) {
      return {
        entityType: (src?.entityType ?? ""),
        entityID: (src?.entityID ?? ""),
        fileName: (src?.fileName ?? ""),
        mimeType: (src?.mimeType ?? ""),
        fileSizeBytes: (src?.fileSizeBytes ?? 0),
        storageProvider: (src?.storageProvider ?? ""),
        storageReference: (src?.storageReference ?? ""),
        attachmentType: (src?.attachmentType ?? ""),
        description: (src?.description ?? ""),
        capturedDate: src?.capturedDate ? new Date(src?.capturedDate as any).toISOString().split('T')[0] : "",
        capturedBy: (src?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
    }
    return {
      entityType: "",
      entityID: "",
      fileName: "",
      mimeType: "",
      fileSizeBytes: 0,
      storageProvider: "",
      storageReference: "",
      attachmentType: "",
      description: "",
      capturedDate: new Date().toISOString().split('T')[0],
      capturedBy: ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim(),
    };
  }, [isEditMode, initialAttachment]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(attachmentSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialAttachment && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialAttachment, reset, getDefaultValues, hasLoadedItem]);

  const onSubmitHandler = async (data: AttachmentFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} attachment...`, 'info');
      const payload: any = {
        attachmentID: (isEditMode ? ((initialAttachment as any)?.attachmentID ?? null) : null),
        entityType: data.entityType ?? '',
        entityID: data.entityID ?? '',
        fileName: data.fileName ?? '',
        mimeType: data.mimeType ?? '',
        fileSizeBytes: data.fileSizeBytes,
        storageProvider: data.storageProvider ?? '',
        storageReference: data.storageReference ?? '',
        attachmentType: data.attachmentType ?? '',
        description: data.description ?? '',
        capturedDate: data.capturedDate || new Date().toISOString().split('T')[0],
        capturedBy: (data.capturedBy || ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateAttachment(payload as Attachment) : await createAttachment(payload as Attachment);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`Attachment "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/attachments');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit Attachment' : 'Create Attachment'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Entity Type" error={errors.entityType?.message as string}>
            <input className="input" placeholder="Enter entity type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('entityType')}  />
          </Field>
          <Field label="Entity ID" error={errors.entityID?.message as string}>
            <input className="input" placeholder="Enter entity ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('entityID')}  />
          </Field>
          <Field label="File Name" error={errors.fileName?.message as string}>
            <input className="input" placeholder="Enter file name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('fileName')}  />
          </Field>
          <Field label="MIME Type" error={errors.mimeType?.message as string}>
            <input className="input" placeholder="Enter MIME type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('mimeType')}  />
          </Field>
          <Field label="File Size (Bytes)" error={errors.fileSizeBytes?.message as string}>
            <input className="input" placeholder="Enter file size in bytes" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('fileSizeBytes', { valueAsNumber: true })} />
          </Field>
          <Field label="Storage Provider" error={errors.storageProvider?.message as string}>
            <input className="input" placeholder="Enter storage provider" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('storageProvider')}  />
          </Field>
          <Field label="Storage Reference" error={errors.storageReference?.message as string}>
            <textarea className="input" placeholder="Enter storage reference" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('storageReference')} rows={3} />
          </Field>
          <Field label="Attachment Type" error={errors.attachmentType?.message as string}>
            <input className="input" placeholder="Enter attachment type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('attachmentType')}  />
          </Field>
          <Field label="Description" error={errors.description?.message as string}>
            <textarea className="input" placeholder="Enter description" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('description')} rows={3} />
          </Field>
          <Field label="Captured Date" error={errors.capturedDate?.message as string}>
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('capturedDate')} />
          </Field>
          <Field label="Captured By" error={errors.capturedBy?.message as string}>
            <input className="input" placeholder="" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('capturedBy')} readOnly />
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

