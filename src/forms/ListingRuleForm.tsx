{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { ListingRule } from '../types/ListingRule';
import { createListingRule, updateListingRule } from '../apis/useListingRule';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const listingRuleSchema = z.object({
  listingID: z.string().min(1, "Listing is required"),
  ruleType: z.string().max(100, "Rule Type must be less than 100 characters").min(1, "Rule Type is required"),
  ruleTitle: z.string().max(200, "Rule Title must be less than 200 characters").min(1, "Rule Title is required"),
  ruleDescription: z.string().max(1000, "Rule Description must be less than 1000 characters").optional(),
  isAllowed: z.boolean().optional(),
  effectiveFrom: z.string().optional(),
  effectiveTo: z.string().optional(),
});

type ListingRuleFormData = z.infer<typeof listingRuleSchema>;

interface ListingRuleFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialListingRule?: ListingRule | null;
  isEditMode?: boolean;
}

export default function ListingRuleForm({ onAlert, initialListingRule = null, isEditMode = false }: ListingRuleFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_listingID, setOpts_listingID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_listingID_loading, setOpts_listingID_loading] = React.useState(false);

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

  async function loadOptions_listingID(){
    try { setOpts_listingID_loading(true);
      const url = "api/listing/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'listingID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "listingName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["listingID", "listingID", "id", "ID", "listingID", "listingId"], String(it))
      }));
      setOpts_listingID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_listingID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_listingID(); }, []);

  const getDefaultValues = React.useCallback((): ListingRuleFormData => {
    const src = (initialListingRule as any) ?? {};
    if (isEditMode && initialListingRule) {
      return {
        listingID: (src?.listingID ?? ""),
        ruleType: (src?.ruleType ?? ""),
        ruleTitle: (src?.ruleTitle ?? ""),
        ruleDescription: (src?.ruleDescription ?? ""),
        isAllowed: Boolean(src?.isAllowed),
        effectiveFrom: src?.effectiveFrom ? new Date(src?.effectiveFrom as any).toISOString().split('T')[0] : "",
        effectiveTo: src?.effectiveTo ? new Date(src?.effectiveTo as any).toISOString().split('T')[0] : "",
      };
    }
    return {
      listingID: "",
      ruleType: "",
      ruleTitle: "",
      ruleDescription: "",
      isAllowed: false,
      effectiveFrom: "",
      effectiveTo: "",
    };
  }, [isEditMode, initialListingRule]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(listingRuleSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialListingRule && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialListingRule, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialListingRule && opts_listingID.length > 0) {
      const currentlistingID = (initialListingRule as any)?.listingID ;
      if (currentlistingID !== undefined && currentlistingID!== null) {
        const listingIDValue = String(currentlistingID);
        if (opts_listingID.some(opt => opt.value === String(listingIDValue))) {
          setValue('listingID', listingIDValue);
        }
      }
    }
  }, [opts_listingID, isEditMode, initialListingRule, setValue]);

  const onSubmitHandler = async (data: ListingRuleFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} listingrule...`, 'info');
      const payload: any = {
        listingRuleID: (isEditMode ? ((initialListingRule as any)?.listingRuleID ?? null) : null),
        listingID: data.listingID ?? '',
        ruleType: data.ruleType ?? '',
        ruleTitle: data.ruleTitle ?? '',
        ruleDescription: data.ruleDescription ?? '',
        isAllowed: data.isAllowed,
        effectiveFrom: data.effectiveFrom || null,
        effectiveTo: data.effectiveTo || null,
        capturedDate : (isEditMode ? ((initialListingRule as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialListingRule as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialListingRule as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialListingRule as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateListingRule(payload as ListingRule) : await createListingRule(payload as ListingRule);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`ListingRule "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/listingrules');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit ListingRule' : 'Create ListingRule'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Listing *" error={errors.listingID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('listingID')}>
              <option value="">Select Listing</option>
              {opts_listingID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_listingID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Rule Type" error={errors.ruleType?.message as string}>
            <input className="input" placeholder="Enter rule type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('ruleType')}  />
          </Field>
          <Field label="Rule Title" error={errors.ruleTitle?.message as string}>
            <input className="input" placeholder="Enter rule title" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('ruleTitle')}  />
          </Field>
          <Field label="Rule Description" error={errors.ruleDescription?.message as string}>
            <textarea className="input" placeholder="Enter rule description" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('ruleDescription')} rows={3} />
          </Field>
          <Field label="Is Allowed" error={errors.isAllowed?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isAllowed')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Effective From" error={errors.effectiveFrom?.message as string}>
            <input className="input" placeholder="Select effective start date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('effectiveFrom')} />
          </Field>
          <Field label="Effective To" error={errors.effectiveTo?.message as string}>
            <input className="input" placeholder="Select effective end date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('effectiveTo')} />
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

