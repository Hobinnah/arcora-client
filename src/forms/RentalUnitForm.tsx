{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { RentalUnit } from '../types/RentalUnit';
import { createRentalUnit, updateRentalUnit } from '../apis/useRentalUnit';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const rentalUnitSchema = z.object({
  propertyID: z.string().min(1, "Property is required"),
  unitTypeID: z.string().optional(),
  unitNumber: z.string().max(50, "Unit Number must be less than 50 characters").optional(),
  floorNumber: z.string().max(20, "Floor Number must be less than 20 characters").optional(),
  bedrooms: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  bathrooms: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  squareFeet: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  maximumOccupants: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["ACTIVE", "INACTIVE", "MAINTENANCE", "ARCHIVED"].includes(v as any), "Invalid Status"),
  capturedDate: z.string().optional(),
  capturedBy: z.string().max(100, "Captured By must be less than 100 characters").optional(),
  updatedDate: z.string().optional(),
  updatedBy: z.string().max(100, "Updated By must be less than 100 characters").optional(),
});

type RentalUnitFormData = z.infer<typeof rentalUnitSchema>;

interface RentalUnitFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialRentalUnit?: RentalUnit | null;
  isEditMode?: boolean;
}

export default function RentalUnitForm({ onAlert, initialRentalUnit = null, isEditMode = false }: RentalUnitFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_propertyID, setOpts_propertyID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_propertyID_loading, setOpts_propertyID_loading] = React.useState(false);
  const [opts_unitTypeID, setOpts_unitTypeID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_unitTypeID_loading, setOpts_unitTypeID_loading] = React.useState(false);

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

  async function loadOptions_propertyID(){
    try { setOpts_propertyID_loading(true);
      const url = "api/property/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'propertyID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "propertyName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["propertyID", "propertyID", "id", "ID", "propertyID", "propertyId"], String(it))
      }));
      setOpts_propertyID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_propertyID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_propertyID(); }, []);

  async function loadOptions_unitTypeID(){
    try { setOpts_unitTypeID_loading(true);
      const url = "api/unittype/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'unitTypeID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["name", "name", "unitTypeName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["unitTypeID", "unitTypeID", "id", "ID", "unitTypeID", "unitTypeId"], String(it))
      }));
      setOpts_unitTypeID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_unitTypeID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_unitTypeID(); }, []);

  const getDefaultValues = React.useCallback((): RentalUnitFormData => {
    const src = (initialRentalUnit as any) ?? {};
    if (isEditMode && initialRentalUnit) {
      return {
        propertyID: (src?.propertyID ?? ""),
        unitTypeID: (src?.unitTypeID ?? ""),
        unitNumber: (src?.unitNumber ?? ""),
        floorNumber: (src?.floorNumber ?? ""),
        bedrooms: (src?.bedrooms ?? 0),
        bathrooms: (src?.bathrooms ?? 0),
        squareFeet: (src?.squareFeet ?? 0),
        maximumOccupants: (src?.maximumOccupants ?? 0),
        notes: (src?.notes ?? ""),
        status: (src?.status ?? ""),
        capturedDate: src?.capturedDate ? new Date(src?.capturedDate as any).toISOString().split('T')[0] : "",
        capturedBy: (src?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate: src?.updatedDate ? new Date(src?.updatedDate as any).toISOString().split('T')[0] : "",
        updatedBy: (src?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
    }
    return {
      propertyID: "",
      unitTypeID: "",
      unitNumber: "",
      floorNumber: "",
      bedrooms: 0,
      bathrooms: 0,
      squareFeet: 0,
      maximumOccupants: 0,
      notes: "",
      status: "ACTIVE",
      capturedDate: new Date().toISOString().split('T')[0],
      capturedBy: ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim(),
      updatedDate: "",
      updatedBy: ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim(),
    };
  }, [isEditMode, initialRentalUnit]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(rentalUnitSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialRentalUnit && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialRentalUnit, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialRentalUnit && opts_propertyID.length > 0) {
      const currentpropertyID = (initialRentalUnit as any)?.propertyID ;
      if (currentpropertyID !== undefined && currentpropertyID!== null) {
        const propertyIDValue = String(currentpropertyID);
        if (opts_propertyID.some(opt => opt.value === String(propertyIDValue))) {
          setValue('propertyID', propertyIDValue);
        }
      }
    }
  }, [opts_propertyID, isEditMode, initialRentalUnit, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialRentalUnit && opts_unitTypeID.length > 0) {
      const currentunitTypeID = (initialRentalUnit as any)?.unitTypeID ;
      if (currentunitTypeID !== undefined && currentunitTypeID!== null) {
        const unitTypeIDValue = String(currentunitTypeID);
        if (opts_unitTypeID.some(opt => opt.value === String(unitTypeIDValue))) {
          setValue('unitTypeID', unitTypeIDValue);
        }
      }
    }
  }, [opts_unitTypeID, isEditMode, initialRentalUnit, setValue]);

  const onSubmitHandler = async (data: RentalUnitFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} rentalunit...`, 'info');
      const payload: any = {
        rentalUnitID: (isEditMode ? ((initialRentalUnit as any)?.rentalUnitID ?? null) : null),
        propertyID: data.propertyID ?? '',
        unitTypeID: data.unitTypeID ?? '',
        unitNumber: data.unitNumber ?? '',
        floorNumber: data.floorNumber ?? '',
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        squareFeet: data.squareFeet,
        maximumOccupants: data.maximumOccupants,
        notes: data.notes ?? '',
        status: data.status ?? '',
        capturedDate: data.capturedDate || new Date().toISOString().split('T')[0],
        capturedBy: (data.capturedBy || ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate: data.updatedDate || null,
        updatedBy: (data.updatedBy || ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateRentalUnit(payload as RentalUnit) : await createRentalUnit(payload as RentalUnit);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`RentalUnit "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/rentalunits');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit RentalUnit' : 'Create RentalUnit'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Property *" error={errors.propertyID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('propertyID')}>
              <option value="">Select Property</option>
              {opts_propertyID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_propertyID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Unit Type " error={errors.unitTypeID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('unitTypeID')}>
              <option value="">Select Unit Type</option>
              {opts_unitTypeID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_unitTypeID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Unit Number" error={errors.unitNumber?.message as string}>
            <input className="input" placeholder="Enter unit number" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('unitNumber')}  />
          </Field>
          <Field label="Floor Number" error={errors.floorNumber?.message as string}>
            <input className="input" placeholder="Enter floor number" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('floorNumber')}  />
          </Field>
          <Field label="Bedrooms" error={errors.bedrooms?.message as string}>
            <input className="input" placeholder="Enter number of bedrooms" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('bedrooms', { valueAsNumber: true })} />
          </Field>
          <Field label="Bathrooms" error={errors.bathrooms?.message as string}>
            <input className="input" placeholder="Enter number of bathrooms" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('bathrooms', { valueAsNumber: true })} />
          </Field>
          <Field label="Square Feet" error={errors.squareFeet?.message as string}>
            <input className="input" placeholder="Enter square feet" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('squareFeet', { valueAsNumber: true })} />
          </Field>
          <Field label="Maximum Occupants" error={errors.maximumOccupants?.message as string}>
            <input className="input" placeholder="Enter maximum occupants" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('maximumOccupants', { valueAsNumber: true })} />
          </Field>
          <Field label="Notes" error={errors.notes?.message as string}>
            <textarea className="input" placeholder="Enter notes" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('notes')} rows={3} />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </Field>
          <Field label="Captured Date" error={errors.capturedDate?.message as string}>
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('capturedDate')} />
          </Field>
          <Field label="Captured By" error={errors.capturedBy?.message as string}>
            <input className="input" placeholder="" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('capturedBy')} readOnly />
          </Field>
          <Field label="Updated Date" error={errors.updatedDate?.message as string}>
            <input className="input" placeholder="" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('updatedDate')} />
          </Field>
          <Field label="Updated By" error={errors.updatedBy?.message as string}>
            <input className="input" placeholder="" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('updatedBy')} readOnly />
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

