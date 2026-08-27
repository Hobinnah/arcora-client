{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { PaymentProviderEvent } from '../types/PaymentProviderEvent';
import { createPaymentProviderEvent, updatePaymentProviderEvent } from '../apis/usePaymentProviderEvent';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const paymentProviderEventSchema = z.object({
  providerName: z.string().max(100, "Provider Name must be less than 100 characters").min(1, "Provider Name is required"),
  providerEventID: z.string().max(255, "Provider Event ID must be less than 255 characters").min(1, "Provider Event ID is required"),
  eventType: z.string().max(100, "Event Type must be less than 100 characters").min(1, "Event Type is required"),
  processingStatus: z.string().max(50, "Processing Status must be less than 50 characters").min(1, "Processing Status is required").refine(v => (v ?? '') === '' || ["RECEIVED", "PROCESSED", "FAILED"].includes(v as any), "Invalid Processing Status"),
  payload: z.string().max(256, "Payload must be less than 256 characters").min(1, "Payload is required"),
  receivedAt: z.string(),
  processedAt: z.string().optional(),
  failureReason: z.string().max(256, "Failure Reason must be less than 256 characters").optional(),
  retryCount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Retry Count is required")),
});

type PaymentProviderEventFormData = z.infer<typeof paymentProviderEventSchema>;

interface PaymentProviderEventFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialPaymentProviderEvent?: PaymentProviderEvent | null;
  isEditMode?: boolean;
}

export default function PaymentProviderEventForm({ onAlert, initialPaymentProviderEvent = null, isEditMode = false }: PaymentProviderEventFormProps) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getDefaultValues = React.useCallback((): PaymentProviderEventFormData => {
    const src = (initialPaymentProviderEvent as any) ?? {};
    if (isEditMode && initialPaymentProviderEvent) {
      return {
        providerName: (src?.providerName ?? ""),
        providerEventID: (src?.providerEventID ?? ""),
        eventType: (src?.eventType ?? ""),
        processingStatus: (src?.processingStatus ?? ""),
        payload: (src?.payload ?? ""),
        receivedAt: src?.receivedAt ? new Date(src?.receivedAt as any).toISOString().split('T')[0] : "",
        processedAt: src?.processedAt ? new Date(src?.processedAt as any).toISOString().split('T')[0] : "",
        failureReason: (src?.failureReason ?? ""),
        retryCount: (src?.retryCount ?? 0),
      };
    }
    return {
      providerName: "",
      providerEventID: "",
      eventType: "",
      processingStatus: "",
      payload: "",
      receivedAt: "",
      processedAt: "",
      failureReason: "",
      retryCount: 0,
    };
  }, [isEditMode, initialPaymentProviderEvent]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(paymentProviderEventSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialPaymentProviderEvent && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialPaymentProviderEvent, reset, getDefaultValues, hasLoadedItem]);

  const onSubmitHandler = async (data: PaymentProviderEventFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} paymentproviderevent...`, 'info');
      const payload: any = {
        paymentProviderEventID: (isEditMode ? ((initialPaymentProviderEvent as any)?.paymentProviderEventID ?? null) : null),
        providerName: data.providerName ?? '',
        providerEventID: data.providerEventID ?? '',
        eventType: data.eventType ?? '',
        processingStatus: data.processingStatus ?? '',
        payload: data.payload ?? '',
        receivedAt: data.receivedAt || null,
        processedAt: data.processedAt || null,
        failureReason: data.failureReason ?? '',
        retryCount: data.retryCount,
        capturedDate : (isEditMode ? ((initialPaymentProviderEvent as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
      };
      let result: any;
      result = isEditMode ? await updatePaymentProviderEvent(payload as PaymentProviderEvent) : await createPaymentProviderEvent(payload as PaymentProviderEvent);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`PaymentProviderEvent "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/paymentproviderevents');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit PaymentProviderEvent' : 'Create PaymentProviderEvent'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Provider Name" error={errors.providerName?.message as string}>
            <input className="input" placeholder="Enter provider name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('providerName')}  />
          </Field>
          <Field label="Provider Event ID" error={errors.providerEventID?.message as string}>
            <textarea className="input" placeholder="Enter provider event ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerEventID')} rows={3} />
          </Field>
          <Field label="Event Type" error={errors.eventType?.message as string}>
            <input className="input" placeholder="Enter event type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('eventType')}  />
          </Field>
          <Field label="Processing Status *" error={errors.processingStatus?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('processingStatus')}>
              <option value="">Select Processing Status</option>
              <option value="RECEIVED">RECEIVED</option>
              <option value="PROCESSED">PROCESSED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </Field>
          <Field label="Payload" error={errors.payload?.message as string}>
            <textarea className="input" placeholder="Enter event payload JSON" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('payload')} rows={3} />
          </Field>
          <Field label="Received At" error={errors.receivedAt?.message as string}>
            <input className="input" placeholder="Select received date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('receivedAt')} />
          </Field>
          <Field label="Processed At" error={errors.processedAt?.message as string}>
            <input className="input" placeholder="Select processed date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('processedAt')} />
          </Field>
          <Field label="Failure Reason" error={errors.failureReason?.message as string}>
            <textarea className="input" placeholder="Enter failure reason" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('failureReason')} rows={3} />
          </Field>
          <Field label="Retry Count" error={errors.retryCount?.message as string}>
            <input className="input" placeholder="Enter retry count" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('retryCount', { valueAsNumber: true })} />
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

