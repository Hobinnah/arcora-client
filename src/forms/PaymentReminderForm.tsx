{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { PaymentReminder } from '../types/PaymentReminder';
import { createPaymentReminder, updatePaymentReminder } from '../apis/usePaymentReminder';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const paymentReminderSchema = z.object({
  invoiceMasterID: z.string().min(1, "Invoice Master is required"),
  channel: z.string().max(50, "Channel must be less than 50 characters").min(1, "Channel is required"),
  scheduledAt: z.string(),
  sentAt: z.string().optional(),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["QUEUED", "SENT", "FAILED"].includes(v as any), "Invalid Status"),
  messageSubject: z.string().max(255, "Message Subject must be less than 255 characters").optional(),
  messageBody: z.string().max(256, "Message Body must be less than 256 characters").min(1, "Message Body is required"),
  capturedDate: z.string().optional(),
  capturedBy: z.string().max(50, "Captured By must be less than 50 characters").min(1, "Captured By is required"),
});

type PaymentReminderFormData = z.infer<typeof paymentReminderSchema>;

interface PaymentReminderFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialPaymentReminder?: PaymentReminder | null;
  isEditMode?: boolean;
}

export default function PaymentReminderForm({ onAlert, initialPaymentReminder = null, isEditMode = false }: PaymentReminderFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_invoiceMasterID, setOpts_invoiceMasterID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_invoiceMasterID_loading, setOpts_invoiceMasterID_loading] = React.useState(false);

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

  async function loadOptions_invoiceMasterID(){
    try { setOpts_invoiceMasterID_loading(true);
      const url = "api/invoicemaster/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'invoiceMasterID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["invoiceNumber", "name", "invoiceMasterName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["invoiceMasterID", "invoiceMasterID", "id", "ID", "invoiceMasterID", "invoiceMasterId"], String(it))
      }));
      setOpts_invoiceMasterID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_invoiceMasterID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_invoiceMasterID(); }, []);

  const getDefaultValues = React.useCallback((): PaymentReminderFormData => {
    const src = (initialPaymentReminder as any) ?? {};
    if (isEditMode && initialPaymentReminder) {
      return {
        invoiceMasterID: (src?.invoiceMasterID ?? ""),
        channel: (src?.channel ?? ""),
        scheduledAt: src?.scheduledAt ? new Date(src?.scheduledAt as any).toISOString().split('T')[0] : "",
        sentAt: src?.sentAt ? new Date(src?.sentAt as any).toISOString().split('T')[0] : "",
        status: (src?.status ?? ""),
        messageSubject: (src?.messageSubject ?? ""),
        messageBody: (src?.messageBody ?? ""),
        capturedDate: src?.capturedDate ? new Date(src?.capturedDate as any).toISOString().split('T')[0] : "",
        capturedBy: (src?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
    }
    return {
      invoiceMasterID: "",
      channel: "",
      scheduledAt: "",
      sentAt: "",
      status: "QUEUED",
      messageSubject: "",
      messageBody: "",
      capturedDate: new Date().toISOString().split('T')[0],
      capturedBy: ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim(),
    };
  }, [isEditMode, initialPaymentReminder]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(paymentReminderSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialPaymentReminder && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialPaymentReminder, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialPaymentReminder && opts_invoiceMasterID.length > 0) {
      const currentinvoiceMasterID = (initialPaymentReminder as any)?.invoiceMasterID ;
      if (currentinvoiceMasterID !== undefined && currentinvoiceMasterID!== null) {
        const invoiceMasterIDValue = String(currentinvoiceMasterID);
        if (opts_invoiceMasterID.some(opt => opt.value === String(invoiceMasterIDValue))) {
          setValue('invoiceMasterID', invoiceMasterIDValue);
        }
      }
    }
  }, [opts_invoiceMasterID, isEditMode, initialPaymentReminder, setValue]);

  const onSubmitHandler = async (data: PaymentReminderFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} paymentreminder...`, 'info');
      const payload: any = {
        paymentReminderID: (isEditMode ? ((initialPaymentReminder as any)?.paymentReminderID ?? null) : null),
        invoiceMasterID: data.invoiceMasterID ?? '',
        channel: data.channel ?? '',
        scheduledAt: data.scheduledAt || null,
        sentAt: data.sentAt || null,
        status: data.status ?? '',
        messageSubject: data.messageSubject ?? '',
        messageBody: data.messageBody ?? '',
        capturedDate: data.capturedDate || new Date().toISOString().split('T')[0],
        capturedBy: (data.capturedBy || ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updatePaymentReminder(payload as PaymentReminder) : await createPaymentReminder(payload as PaymentReminder);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`PaymentReminder "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/paymentreminders');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit PaymentReminder' : 'Create PaymentReminder'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Invoice Master *" error={errors.invoiceMasterID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('invoiceMasterID')}>
              <option value="">Select Invoice Master</option>
              {opts_invoiceMasterID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_invoiceMasterID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Channel" error={errors.channel?.message as string}>
            <input className="input" placeholder="Enter notification channel" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('channel')}  />
          </Field>
          <Field label="Scheduled At" error={errors.scheduledAt?.message as string}>
            <input className="input" placeholder="Select scheduled date and time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('scheduledAt')} />
          </Field>
          <Field label="Sent At" error={errors.sentAt?.message as string}>
            <input className="input" placeholder="Date and time sent" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('sentAt')} />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="QUEUED">QUEUED</option>
              <option value="SENT">SENT</option>
              <option value="FAILED">FAILED</option>
            </select>
          </Field>
          <Field label="Message Subject" error={errors.messageSubject?.message as string}>
            <textarea className="input" placeholder="Enter message subject" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('messageSubject')} rows={3} />
          </Field>
          <Field label="Message Body" error={errors.messageBody?.message as string}>
            <textarea className="input" placeholder="Enter message body" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('messageBody')} rows={3} />
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

