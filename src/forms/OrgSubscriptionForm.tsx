{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { OrgSubscription } from '../types/OrgSubscription';
import { createOrgSubscription, updateOrgSubscription } from '../apis/useOrgSubscription';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const orgSubscriptionSchema = z.object({
  organizationID: z.string().min(1, "Organization is required"),
  subscriptionPlanID: z.string().min(1, "Subscription Plan is required"),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required"),
  billingFrequency: z.string().max(50, "Billing Frequency must be less than 50 characters").min(1, "Billing Frequency is required"),
  startedAt: z.string(),
  trialEndsAt: z.string().optional(),
  currentPeriodStart: z.string().optional(),
  currentPeriodEnd: z.string().optional(),
  cancelAtPeriodEnd: z.boolean(),
  cancelledAt: z.string().optional(),
  endedAt: z.string().optional(),
  providerName: z.string().max(100, "Provider Name must be less than 100 characters").optional(),
  providerCustomerID: z.string().max(255, "Provider Customer ID must be less than 255 characters").optional(),
  providerSubscriptionID: z.string().max(255, "Provider Subscription ID must be less than 255 characters").optional(),
});

type OrgSubscriptionFormData = z.infer<typeof orgSubscriptionSchema>;

interface OrgSubscriptionFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialOrgSubscription?: OrgSubscription | null;
  isEditMode?: boolean;
}

export default function OrgSubscriptionForm({ onAlert, initialOrgSubscription = null, isEditMode = false }: OrgSubscriptionFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_organizationID, setOpts_organizationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_organizationID_loading, setOpts_organizationID_loading] = React.useState(false);
  const [opts_subscriptionPlanID, setOpts_subscriptionPlanID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_subscriptionPlanID_loading, setOpts_subscriptionPlanID_loading] = React.useState(false);

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

  async function loadOptions_organizationID(){
    try { setOpts_organizationID_loading(true);
      const url = "api/organization/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'organizationID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "organizationName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["organizationID", "organizationID", "id", "ID", "organizationID", "organizationId"], String(it))
      }));
      setOpts_organizationID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_organizationID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_organizationID(); }, []);

  async function loadOptions_subscriptionPlanID(){
    try { setOpts_subscriptionPlanID_loading(true);
      const url = "api/subscriptionplan/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'subscriptionPlanID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "subscriptionPlanName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["subscriptionPlanID", "subscriptionPlanID", "id", "ID", "subscriptionPlanID", "subscriptionPlanId"], String(it))
      }));
      setOpts_subscriptionPlanID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_subscriptionPlanID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_subscriptionPlanID(); }, []);

  const getDefaultValues = React.useCallback((): OrgSubscriptionFormData => {
    const src = (initialOrgSubscription as any) ?? {};
    if (isEditMode && initialOrgSubscription) {
      return {
        organizationID: (src?.organizationID ?? ""),
        subscriptionPlanID: (src?.subscriptionPlanID ?? ""),
        status: (src?.status ?? ""),
        billingFrequency: (src?.billingFrequency ?? ""),
        startedAt: src?.startedAt ? new Date(src?.startedAt as any).toISOString().split('T')[0] : "",
        trialEndsAt: src?.trialEndsAt ? new Date(src?.trialEndsAt as any).toISOString().split('T')[0] : "",
        currentPeriodStart: src?.currentPeriodStart ? new Date(src?.currentPeriodStart as any).toISOString().split('T')[0] : "",
        currentPeriodEnd: src?.currentPeriodEnd ? new Date(src?.currentPeriodEnd as any).toISOString().split('T')[0] : "",
        cancelAtPeriodEnd: Boolean(src?.cancelAtPeriodEnd),
        cancelledAt: src?.cancelledAt ? new Date(src?.cancelledAt as any).toISOString().split('T')[0] : "",
        endedAt: src?.endedAt ? new Date(src?.endedAt as any).toISOString().split('T')[0] : "",
        providerName: (src?.providerName ?? ""),
        providerCustomerID: (src?.providerCustomerID ?? ""),
        providerSubscriptionID: (src?.providerSubscriptionID ?? ""),
      };
    }
    return {
      organizationID: "",
      subscriptionPlanID: "",
      status: "",
      billingFrequency: "",
      startedAt: "",
      trialEndsAt: "",
      currentPeriodStart: "",
      currentPeriodEnd: "",
      cancelAtPeriodEnd: false,
      cancelledAt: "",
      endedAt: "",
      providerName: "",
      providerCustomerID: "",
      providerSubscriptionID: "",
    };
  }, [isEditMode, initialOrgSubscription]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(orgSubscriptionSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialOrgSubscription && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialOrgSubscription, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialOrgSubscription && opts_organizationID.length > 0) {
      const currentorganizationID = (initialOrgSubscription as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = String(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialOrgSubscription, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialOrgSubscription && opts_subscriptionPlanID.length > 0) {
      const currentsubscriptionPlanID = (initialOrgSubscription as any)?.subscriptionPlanID ;
      if (currentsubscriptionPlanID !== undefined && currentsubscriptionPlanID!== null) {
        const subscriptionPlanIDValue = String(currentsubscriptionPlanID);
        if (opts_subscriptionPlanID.some(opt => opt.value === String(subscriptionPlanIDValue))) {
          setValue('subscriptionPlanID', subscriptionPlanIDValue);
        }
      }
    }
  }, [opts_subscriptionPlanID, isEditMode, initialOrgSubscription, setValue]);

  const onSubmitHandler = async (data: OrgSubscriptionFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} orgsubscription...`, 'info');
      const payload: any = {
        orgSubscriptionID: (isEditMode ? ((initialOrgSubscription as any)?.orgSubscriptionID ?? null) : null),
        organizationID: data.organizationID ?? '',
        subscriptionPlanID: data.subscriptionPlanID ?? '',
        status: data.status ?? '',
        billingFrequency: data.billingFrequency ?? '',
        startedAt: data.startedAt || null,
        trialEndsAt: data.trialEndsAt || null,
        currentPeriodStart: data.currentPeriodStart || null,
        currentPeriodEnd: data.currentPeriodEnd || null,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
        cancelledAt: data.cancelledAt || null,
        endedAt: data.endedAt || null,
        providerName: data.providerName ?? '',
        providerCustomerID: data.providerCustomerID ?? '',
        providerSubscriptionID: data.providerSubscriptionID ?? '',
        capturedDate : (isEditMode ? ((initialOrgSubscription as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialOrgSubscription as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialOrgSubscription as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialOrgSubscription as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateOrgSubscription(payload as OrgSubscription) : await createOrgSubscription(payload as OrgSubscription);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`OrgSubscription "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/orgsubscriptions');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit OrgSubscription' : 'Create OrgSubscription'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Organization *" error={errors.organizationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationID')}>
              <option value="">Select Organization</option>
              {opts_organizationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Subscription Plan *" error={errors.subscriptionPlanID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('subscriptionPlanID')}>
              <option value="">Select Subscription Plan</option>
              {opts_subscriptionPlanID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_subscriptionPlanID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Status" error={errors.status?.message as string}>
            <input className="input" placeholder="Select status" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}  />
          </Field>
          <Field label="Billing Frequency" error={errors.billingFrequency?.message as string}>
            <input className="input" placeholder="Select billing frequency" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('billingFrequency')}  />
          </Field>
          <Field label="Started At" error={errors.startedAt?.message as string}>
            <input className="input" placeholder="Select start date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('startedAt')} />
          </Field>
          <Field label="Trial Ends At" error={errors.trialEndsAt?.message as string}>
            <input className="input" placeholder="Select trial end date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('trialEndsAt')} />
          </Field>
          <Field label="Current Period Start" error={errors.currentPeriodStart?.message as string}>
            <input className="input" placeholder="Select current period start" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currentPeriodStart')} />
          </Field>
          <Field label="Current Period End" error={errors.currentPeriodEnd?.message as string}>
            <input className="input" placeholder="Select current period end" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currentPeriodEnd')} />
          </Field>
          <Field label="Cancel At Period End" error={errors.cancelAtPeriodEnd?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('cancelAtPeriodEnd')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Cancelled At" error={errors.cancelledAt?.message as string}>
            <input className="input" placeholder="Select cancellation date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('cancelledAt')} />
          </Field>
          <Field label="Ended At" error={errors.endedAt?.message as string}>
            <input className="input" placeholder="Select end date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('endedAt')} />
          </Field>
          <Field label="Provider Name" error={errors.providerName?.message as string}>
            <input className="input" placeholder="Enter provider name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('providerName')}  />
          </Field>
          <Field label="Provider Customer ID" error={errors.providerCustomerID?.message as string}>
            <textarea className="input" placeholder="Enter provider customer ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerCustomerID')} rows={3} />
          </Field>
          <Field label="Provider Subscription ID" error={errors.providerSubscriptionID?.message as string}>
            <textarea className="input" placeholder="Enter provider subscription ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('providerSubscriptionID')} rows={3} />
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

