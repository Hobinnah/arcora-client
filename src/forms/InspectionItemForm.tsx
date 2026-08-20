{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { InspectionItem } from '../types/InspectionItem';
import { createInspectionItem, updateInspectionItem } from '../apis/useInspectionItem';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const inspectionItemSchema = z.object({
  inspectionID: z.string().min(1, "Inspection is required"),
  area: z.string().max(100, "Area must be less than 100 characters").min(1, "Area is required"),
  itemName: z.string().max(100, "Item Name must be less than 100 characters").min(1, "Item Name is required"),
  condition: z.string().max(50, "Condition must be less than 50 characters").optional(),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
  requiresRepair: z.boolean(),
  estimatedRepairCost: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  capturedDate: z.string().optional(),
  capturedBy: z.string().max(100, "Captured By must be less than 100 characters").optional(),
});

type InspectionItemFormData = z.infer<typeof inspectionItemSchema>;

interface InspectionItemFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialInspectionItem?: InspectionItem | null;
  isEditMode?: boolean;
}

export default function InspectionItemForm({ onAlert, initialInspectionItem = null, isEditMode = false }: InspectionItemFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_inspectionID, setOpts_inspectionID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_inspectionID_loading, setOpts_inspectionID_loading] = React.useState(false);

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

  async function loadOptions_inspectionID(){
    try { setOpts_inspectionID_loading(true);
      const url = "api/inspection/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'inspectionID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["inspectionType", "name", "inspectionName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["inspectionID", "inspectionID", "id", "ID", "inspectionID", "inspectionId"], String(it))
      }));
      setOpts_inspectionID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_inspectionID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_inspectionID(); }, []);

  const getDefaultValues = React.useCallback((): InspectionItemFormData => {
    const src = (initialInspectionItem as any) ?? {};
    if (isEditMode && initialInspectionItem) {
      return {
        inspectionID: (src?.inspectionID ?? ""),
        area: (src?.area ?? ""),
        itemName: (src?.itemName ?? ""),
        condition: (src?.condition ?? ""),
        notes: (src?.notes ?? ""),
        requiresRepair: Boolean(src?.requiresRepair),
        estimatedRepairCost: (src?.estimatedRepairCost ?? 0),
        capturedDate: src?.capturedDate ? new Date(src?.capturedDate as any).toISOString().split('T')[0] : "",
        capturedBy: (src?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
    }
    return {
      inspectionID: "",
      area: "",
      itemName: "",
      condition: "",
      notes: "",
      requiresRepair: false,
      estimatedRepairCost: 0,
      capturedDate: new Date().toISOString().split('T')[0],
      capturedBy: ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim(),
    };
  }, [isEditMode, initialInspectionItem]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(inspectionItemSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialInspectionItem && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialInspectionItem, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialInspectionItem && opts_inspectionID.length > 0) {
      const currentinspectionID = (initialInspectionItem as any)?.inspectionID ;
      if (currentinspectionID !== undefined && currentinspectionID!== null) {
        const inspectionIDValue = Number(currentinspectionID);
        if (opts_inspectionID.some(opt => opt.value === String(inspectionIDValue))) {
          setValue('inspectionID', inspectionIDValue);
        }
      }
    }
  }, [opts_inspectionID, isEditMode, initialInspectionItem, setValue]);

  const onSubmitHandler = async (data: InspectionItemFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} inspectionitem...`, 'info');
      const payload: any = {
        inspectionItemID: (isEditMode ? ((initialInspectionItem as any)?.inspectionItemID ?? null) : null),
        inspectionID: data.inspectionID ?? '',
        area: data.area ?? '',
        itemName: data.itemName ?? '',
        condition: data.condition ?? '',
        notes: data.notes ?? '',
        requiresRepair: data.requiresRepair,
        estimatedRepairCost: data.estimatedRepairCost,
        capturedDate: data.capturedDate || new Date().toISOString().split('T')[0],
        capturedBy: (data.capturedBy || ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateInspectionItem(payload as InspectionItem) : await createInspectionItem(payload as InspectionItem);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`InspectionItem "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/inspectionitems');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit InspectionItem' : 'Create InspectionItem'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Inspection *" error={errors.inspectionID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('inspectionID')}>
              <option value="">Select Inspection</option>
              {opts_inspectionID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_inspectionID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Area" error={errors.area?.message as string}>
            <input className="input" placeholder="Enter area" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('area')}  />
          </Field>
          <Field label="Item Name" error={errors.itemName?.message as string}>
            <input className="input" placeholder="Enter item name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('itemName')}  />
          </Field>
          <Field label="Condition" error={errors.condition?.message as string}>
            <input className="input" placeholder="Enter condition" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('condition')}  />
          </Field>
          <Field label="Notes" error={errors.notes?.message as string}>
            <textarea className="input" placeholder="Enter notes" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('notes')} rows={3} />
          </Field>
          <Field label="Requires Repair" error={errors.requiresRepair?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('requiresRepair')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Estimated Repair Cost" error={errors.estimatedRepairCost?.message as string}>
            <input className="input" placeholder="Enter estimated repair cost" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('estimatedRepairCost', { valueAsNumber: true })} />
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

