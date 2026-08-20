{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { Fee } from '../types/Fee';
import { createFee, updateFee } from '../apis/useFee';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const feeSchema = z.object({
  feeTypeID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Fee Type is required")),
  organizationID: z.string().optional(),
  code: z.string().max(100, "Code must be less than 100 characters").optional(),
  name: z.string().max(100, "Name must be less than 100 characters").min(1, "Name is required"),
  calculationType: z.string().max(50, "Calculation Type must be less than 50 characters").min(1, "Calculation Type is required"),
  fixedAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  percentageRate: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  minimumFeeAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  maximumFeeAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  currency: z.string().max(3, "Currency must be less than 3 characters").min(1, "Currency is required"),
  isTaxable: z.boolean(),
  effectiveFrom: z.string().optional(),
  effectiveTo: z.string().optional(),
  isActive: z.boolean(),
});

type FeeFormData = z.infer<typeof feeSchema>;

interface FeeFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialFee?: Fee | null;
  isEditMode?: boolean;
}

export default function FeeForm({ onAlert, initialFee = null, isEditMode = false }: FeeFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_feeTypeID, setOpts_feeTypeID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_feeTypeID_loading, setOpts_feeTypeID_loading] = React.useState(false);
  const [opts_organizationID, setOpts_organizationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_organizationID_loading, setOpts_organizationID_loading] = React.useState(false);

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

  async function loadOptions_feeTypeID(){
    try { setOpts_feeTypeID_loading(true);
      const url = "api/feetype/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'feeTypeID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "feeTypeName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["feeTypeID", "feeTypeID", "id", "ID", "feeTypeID", "feeTypeId"], String(it))
      }));
      setOpts_feeTypeID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_feeTypeID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_feeTypeID(); }, []);

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

  const getDefaultValues = React.useCallback((): FeeFormData => {
    const src = (initialFee as any) ?? {};
    if (isEditMode && initialFee) {
      return {
        feeTypeID: (() => {
          if (src?.feeTypeID !== undefined && src?.feeTypeID !== null) {
            return Number(src.feeTypeID);
          }
          return 0;
        })(),
        organizationID: (src?.organizationID ?? ""),
        code: (src?.code ?? ""),
        name: (src?.name ?? ""),
        calculationType: (src?.calculationType ?? ""),
        fixedAmount: (src?.fixedAmount ?? 0),
        percentageRate: (src?.percentageRate ?? 0),
        minimumFeeAmount: (src?.minimumFeeAmount ?? 0),
        maximumFeeAmount: (src?.maximumFeeAmount ?? 0),
        currency: (src?.currency ?? ""),
        isTaxable: Boolean(src?.isTaxable),
        effectiveFrom: src?.effectiveFrom ? new Date(src?.effectiveFrom as any).toISOString().split('T')[0] : "",
        effectiveTo: src?.effectiveTo ? new Date(src?.effectiveTo as any).toISOString().split('T')[0] : "",
        isActive: Boolean(src?.isActive),
      };
    }
    return {
      feeTypeID: 0,
      organizationID: "",
      code: "",
      name: "",
      calculationType: "",
      fixedAmount: 0,
      percentageRate: 0,
      minimumFeeAmount: 0,
      maximumFeeAmount: 0,
      currency: "",
      isTaxable: false,
      effectiveFrom: "",
      effectiveTo: "",
      isActive: false,
    };
  }, [isEditMode, initialFee]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(feeSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialFee && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialFee, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialFee && opts_feeTypeID.length > 0) {
      const currentfeeTypeID = (initialFee as any)?.feeTypeID ;
      if (currentfeeTypeID !== undefined && currentfeeTypeID!== null) {
        const feeTypeIDValue = Number(currentfeeTypeID);
        if (opts_feeTypeID.some(opt => opt.value === String(feeTypeIDValue))) {
          setValue('feeTypeID', feeTypeIDValue);
        }
      }
    }
  }, [opts_feeTypeID, isEditMode, initialFee, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialFee && opts_organizationID.length > 0) {
      const currentorganizationID = (initialFee as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = Number(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialFee, setValue]);

  const onSubmitHandler = async (data: FeeFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} fee...`, 'info');
      const payload: any = {
        feeID: (isEditMode ? ((initialFee as any)?.feeID ?? null) : null),
        feeTypeID: (data.feeTypeID === 0 || data.feeTypeID === undefined || data.feeTypeID === null) ? 0 : Number(data.feeTypeID),
        organizationID: data.organizationID ?? '',
        code: data.code ?? '',
        name: data.name ?? '',
        calculationType: data.calculationType ?? '',
        fixedAmount: data.fixedAmount,
        percentageRate: data.percentageRate,
        minimumFeeAmount: data.minimumFeeAmount,
        maximumFeeAmount: data.maximumFeeAmount,
        currency: data.currency ?? '',
        isTaxable: data.isTaxable,
        effectiveFrom: data.effectiveFrom || null,
        effectiveTo: data.effectiveTo || null,
        isActive: data.isActive,
        capturedDate : (isEditMode ? ((initialFee as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialFee as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialFee as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialFee as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateFee(payload as Fee) : await createFee(payload as Fee);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`Fee "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/fees');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit Fee' : 'Create Fee'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Fee Type *" error={errors.feeTypeID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('feeTypeID')}>
              <option value="">Select Fee Type</option>
              {opts_feeTypeID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_feeTypeID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Organization " error={errors.organizationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationID')}>
              <option value="">Select Organization</option>
              {opts_organizationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Code" error={errors.code?.message as string}>
            <input className="input" placeholder="Enter code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('code')}  />
          </Field>
          <Field label="Name" error={errors.name?.message as string}>
            <input className="input" placeholder="Enter name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('name')}  />
          </Field>
          <Field label="Calculation Type" error={errors.calculationType?.message as string}>
            <input className="input" placeholder="Enter calculation type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('calculationType')}  />
          </Field>
          <Field label="Fixed Amount" error={errors.fixedAmount?.message as string}>
            <input className="input" placeholder="Enter fixed amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('fixedAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Percentage Rate" error={errors.percentageRate?.message as string}>
            <input className="input" placeholder="Enter percentage rate" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('percentageRate', { valueAsNumber: true })} />
          </Field>
          <Field label="Minimum Fee Amount" error={errors.minimumFeeAmount?.message as string}>
            <input className="input" placeholder="Enter minimum fee amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('minimumFeeAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Maximum Fee Amount" error={errors.maximumFeeAmount?.message as string}>
            <input className="input" placeholder="Enter maximum fee amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('maximumFeeAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Currency" error={errors.currency?.message as string}>
            <input className="input" placeholder="Enter currency code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}  />
          </Field>
          <Field label="Is Taxable" error={errors.isTaxable?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isTaxable')} />
              <span>Yes</span>
            </label>
          </Field>
          <Field label="Effective From" error={errors.effectiveFrom?.message as string}>
            <input className="input" placeholder="Select effective from date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('effectiveFrom')} />
          </Field>
          <Field label="Effective To" error={errors.effectiveTo?.message as string}>
            <input className="input" placeholder="Select effective to date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('effectiveTo')} />
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

