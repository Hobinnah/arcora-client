{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { ListingAccessInstruction } from '../types/ListingAccessInstruction';
import { createListingAccessInstruction, updateListingAccessInstruction } from '../apis/useListingAccessInstruction';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const listingAccessInstructionSchema = z.object({
  listingID: z.string().min(1, "Listing is required"),
  leaseID: z.string().optional(),
  instructionType: z.string().max(50, "Instruction Type must be less than 50 characters").min(1, "Instruction Type is required"),
  instructions: z.string().max(256, "Instructions must be less than 256 characters").optional(),
  availableFrom: z.string().optional(),
  availableUntil: z.string().optional(),
  isActive: z.boolean(),
  secretReference: z.string().optional(),
});

type ListingAccessInstructionFormData = z.infer<typeof listingAccessInstructionSchema>;

interface ListingAccessInstructionFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialListingAccessInstruction?: ListingAccessInstruction | null;
  isEditMode?: boolean;
}

export default function ListingAccessInstructionForm({ onAlert, initialListingAccessInstruction = null, isEditMode = false }: ListingAccessInstructionFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_listingID, setOpts_listingID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_listingID_loading, setOpts_listingID_loading] = React.useState(false);
  const [opts_leaseID, setOpts_leaseID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_leaseID_loading, setOpts_leaseID_loading] = React.useState(false);

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
        label: firstNonEmpty(it, ["title", "name", "listingName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_leaseID(){
    try { setOpts_leaseID_loading(true);
      const url = "api/lease/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'leaseID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["leaseNumber", "name", "leaseName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["leaseID", "leaseID", "id", "ID", "leaseID", "leaseId"], String(it))
      }));
      setOpts_leaseID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_leaseID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_leaseID(); }, []);

  const getDefaultValues = React.useCallback((): ListingAccessInstructionFormData => {
    const src = (initialListingAccessInstruction as any) ?? {};
    if (isEditMode && initialListingAccessInstruction) {
      return {
        listingID: (src?.listingID ?? ""),
        leaseID: (src?.leaseID ?? ""),
        instructionType: (src?.instructionType ?? ""),
        instructions: (src?.instructions ?? ""),
        availableFrom: src?.availableFrom ? new Date(src?.availableFrom as any).toISOString().split('T')[0] : "",
        availableUntil: src?.availableUntil ? new Date(src?.availableUntil as any).toISOString().split('T')[0] : "",
        isActive: Boolean(src?.isActive),
      };
    }
    return {
      listingID: "",
      leaseID: "",
      instructionType: "",
      instructions: "",
      availableFrom: "",
      availableUntil: "",
      isActive: false,
    };
  }, [isEditMode, initialListingAccessInstruction]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(listingAccessInstructionSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialListingAccessInstruction && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialListingAccessInstruction, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialListingAccessInstruction && opts_listingID.length > 0) {
      const currentlistingID = (initialListingAccessInstruction as any)?.listingID ;
      if (currentlistingID !== undefined && currentlistingID!== null) {
        const listingIDValue = String(currentlistingID);
        if (opts_listingID.some(opt => opt.value === String(listingIDValue))) {
          setValue('listingID', listingIDValue);
        }
      }
    }
  }, [opts_listingID, isEditMode, initialListingAccessInstruction, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialListingAccessInstruction && opts_leaseID.length > 0) {
      const currentleaseID = (initialListingAccessInstruction as any)?.leaseID ;
      if (currentleaseID !== undefined && currentleaseID!== null) {
        const leaseIDValue = String(currentleaseID);
        if (opts_leaseID.some(opt => opt.value === String(leaseIDValue))) {
          setValue('leaseID', leaseIDValue);
        }
      }
    }
  }, [opts_leaseID, isEditMode, initialListingAccessInstruction, setValue]);

  const onSubmitHandler = async (data: ListingAccessInstructionFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} listingaccessinstruction...`, 'info');
      const payload: any = {
        listingAccessInstructionID: (isEditMode ? ((initialListingAccessInstruction as any)?.listingAccessInstructionID ?? null) : null),
        listingID: data.listingID ?? '',
        leaseID: data.leaseID ?? '',
        instructionType: data.instructionType ?? '',
        instructions: data.instructions ?? '',
        secretReference: data.secretReference ?? '',
        availableFrom: data.availableFrom || null,
        availableUntil: data.availableUntil || null,
        isActive: data.isActive,
        capturedDate : (isEditMode ? ((initialListingAccessInstruction as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialListingAccessInstruction as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialListingAccessInstruction as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialListingAccessInstruction as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateListingAccessInstruction(payload as ListingAccessInstruction) : await createListingAccessInstruction(payload as ListingAccessInstruction);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`ListingAccessInstruction "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/listingaccessinstructions');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit ListingAccessInstruction' : 'Create ListingAccessInstruction'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Listing *" error={errors.listingID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('listingID')}>
              <option value="">Select Listing</option>
              {opts_listingID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_listingID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Lease " error={errors.leaseID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('leaseID')}>
              <option value="">Select Lease</option>
              {opts_leaseID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_leaseID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Instruction Type" error={errors.instructionType?.message as string}>
            <input className="input" placeholder="Enter instruction type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('instructionType')}  />
          </Field>
          <Field label="Instructions" error={errors.instructions?.message as string}>
            <textarea className="input" placeholder="Enter instructions" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('instructions')} rows={3} />
          </Field>
          <Field label="Available From" error={errors.availableFrom?.message as string}>
            <input className="input" placeholder="Select available from date/time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('availableFrom')} />
          </Field>
          <Field label="Available Until" error={errors.availableUntil?.message as string}>
            <input className="input" placeholder="Select available until date/time" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('availableUntil')} />
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

