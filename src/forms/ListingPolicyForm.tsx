{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { ListingPolicy } from '../types/ListingPolicy';
import { createListingPolicy, updateListingPolicy } from '../apis/useListingPolicy';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const listingPolicySchema = z.object({
  listingID: z.string().min(1, "Listing is required"),
  allowsPets: z.boolean().optional(),
  allowsSmoking: z.boolean().optional(),
  allowsChildren: z.boolean().optional(),
  maximumOccupants: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Maximum Occupants is required")),
  furnished: z.boolean().optional(),
  parkingIncluded: z.boolean().optional(),
  utilitiesIncluded: z.boolean().optional(),
  minimumCreditScore: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  requiresBackgroundCheck: z.boolean().optional(),
  applicationInstructions: z.string().max(256, "Application Instructions must be less than 256 characters").optional(),
});

type ListingPolicyFormData = z.infer<typeof listingPolicySchema>;

interface ListingPolicyFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialListingPolicy?: ListingPolicy | null;
  isEditMode?: boolean;
}

export default function ListingPolicyForm({ onAlert, initialListingPolicy = null, isEditMode = false }: ListingPolicyFormProps) {
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

  const getDefaultValues = React.useCallback((): ListingPolicyFormData => {
    const src = (initialListingPolicy as any) ?? {};
    if (isEditMode && initialListingPolicy) {
      return {
        listingID: (src?.listingID ?? ""),
        allowsPets: Boolean(src?.allowsPets),
        allowsSmoking: Boolean(src?.allowsSmoking),
        allowsChildren: Boolean(src?.allowsChildren),
        maximumOccupants: (src?.maximumOccupants ?? 0),
        furnished: Boolean(src?.furnished),
        parkingIncluded: Boolean(src?.parkingIncluded),
        utilitiesIncluded: Boolean(src?.utilitiesIncluded),
        minimumCreditScore: (src?.minimumCreditScore ?? 0),
        requiresBackgroundCheck: Boolean(src?.requiresBackgroundCheck),
        applicationInstructions: (src?.applicationInstructions ?? ""),
      };
    }
    return {
      listingID: "",
      allowsPets: false,
      allowsSmoking: false,
      allowsChildren: false,
      maximumOccupants: 0,
      furnished: false,
      parkingIncluded: false,
      utilitiesIncluded: false,
      minimumCreditScore: 0,
      requiresBackgroundCheck: false,
      applicationInstructions: "",
    };
  }, [isEditMode, initialListingPolicy]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(listingPolicySchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialListingPolicy && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialListingPolicy, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialListingPolicy && opts_listingID.length > 0) {
      const currentlistingID = (initialListingPolicy as any)?.listingID ;
      if (currentlistingID !== undefined && currentlistingID!== null) {
        const listingIDValue = String(currentlistingID);
        if (opts_listingID.some(opt => opt.value === String(listingIDValue))) {
          setValue('listingID', listingIDValue);
        }
      }
    }
  }, [opts_listingID, isEditMode, initialListingPolicy, setValue]);

  const onSubmitHandler = async (data: ListingPolicyFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} listingpolicy...`, 'info');
      const payload: any = {
        listingPolicyID: (isEditMode ? ((initialListingPolicy as any)?.listingPolicyID ?? null) : null),
        listingID: data.listingID ?? '',
        allowsPets: data.allowsPets,
        allowsSmoking: data.allowsSmoking,
        allowsChildren: data.allowsChildren,
        maximumOccupants: data.maximumOccupants,
        furnished: data.furnished,
        parkingIncluded: data.parkingIncluded,
        utilitiesIncluded: data.utilitiesIncluded,
        minimumCreditScore: data.minimumCreditScore,
        requiresBackgroundCheck: data.requiresBackgroundCheck,
        applicationInstructions: data.applicationInstructions ?? '',
        capturedDate : (isEditMode ? ((initialListingPolicy as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialListingPolicy as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateListingPolicy(payload as ListingPolicy) : await createListingPolicy(payload as ListingPolicy);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`ListingPolicy "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/listingpolicies');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit ListingPolicy' : 'Create ListingPolicy'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Listing *" error={errors.listingID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('listingID')}>
              <option value="">Select Listing</option>
              {opts_listingID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_listingID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Allows Pets" error={errors.allowsPets?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('allowsPets')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Allows Smoking" error={errors.allowsSmoking?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('allowsSmoking')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Allows Children" error={errors.allowsChildren?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('allowsChildren')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Maximum Occupants" error={errors.maximumOccupants?.message as string}>
            <input className="input" placeholder="Enter maximum occupants" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('maximumOccupants', { valueAsNumber: true })} />
          </Field>
          <Field label="Furnished" error={errors.furnished?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('furnished')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Parking Included" error={errors.parkingIncluded?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('parkingIncluded')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Utilities Included" error={errors.utilitiesIncluded?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('utilitiesIncluded')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Minimum Credit Score" error={errors.minimumCreditScore?.message as string}>
            <input className="input" placeholder="Enter minimum credit score" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('minimumCreditScore', { valueAsNumber: true })} />
          </Field>
          <Field label="Requires Background Check" error={errors.requiresBackgroundCheck?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('requiresBackgroundCheck')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Application Instructions" error={errors.applicationInstructions?.message as string}>
            <textarea className="input" placeholder="Enter application instructions" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('applicationInstructions')} rows={3} />
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

