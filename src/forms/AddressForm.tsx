{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { Address } from '../types/Address';
import { createAddress, updateAddress } from '../apis/useAddress';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const addressSchema = z.object({
  organizationID: z.string().optional(),
  addressType: z.string().max(50, "Address Type must be less than 50 characters").optional(),
  line1: z.string().max(255, "Line 1 must be less than 255 characters").min(1, "Line 1 is required"),
  line2: z.string().max(255, "Line 2 must be less than 255 characters").optional(),
  city: z.string().max(120, "City must be less than 120 characters").min(1, "City is required"),
  provinceCode: z.string().max(10, "Province Code must be less than 10 characters").optional(),
  postalCode: z.string().max(20, "Postal Code must be less than 20 characters").optional(),
  countryCode: z.string().max(2, "Country Code must be less than 2 characters").min(1, "Country Code is required"),
  latitude: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  longitude: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  placeProvider: z.string().max(50, "Place Provider must be less than 50 characters").optional(),
  placeProviderReferenceID: z.string().max(255, "Place Provider Reference ID must be less than 255 characters").optional(),
  capturedDate: z.string().optional(),
  capturedBy: z.string().max(100, "Captured By must be less than 100 characters").optional(),
  updatedDate: z.string().optional(),
  updatedBy: z.string().max(100, "Updated By must be less than 100 characters").optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialAddress?: Address | null;
  isEditMode?: boolean;
}

export default function AddressForm({ onAlert, initialAddress = null, isEditMode = false }: AddressFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

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

  async function loadOptions_organizationID(){
    try { setOpts_organizationID_loading(true);
      const url = "api/organization/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'organizationID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["displayName", "name", "organizationName", "title", "fullName", "email", "description"], String(it)),
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

  const getDefaultValues = React.useCallback((): AddressFormData => {
    const src = (initialAddress as any) ?? {};
    if (isEditMode && initialAddress) {
      return {
        organizationID: (src?.organizationID ?? ""),
        addressType: (src?.addressType ?? ""),
        line1: (src?.line1 ?? ""),
        line2: (src?.line2 ?? ""),
        city: (src?.city ?? ""),
        provinceCode: (src?.provinceCode ?? ""),
        postalCode: (src?.postalCode ?? ""),
        countryCode: (src?.countryCode ?? ""),
        latitude: (src?.latitude ?? 0),
        longitude: (src?.longitude ?? 0),
        placeProvider: (src?.placeProvider ?? ""),
        placeProviderReferenceID: (src?.placeProviderReferenceID ?? ""),
        capturedDate: src?.capturedDate ? new Date(src?.capturedDate as any).toISOString().split('T')[0] : "",
        capturedBy: (src?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate: src?.updatedDate ? new Date(src?.updatedDate as any).toISOString().split('T')[0] : "",
        updatedBy: (src?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
    }
    return {
      organizationID: "",
      addressType: "",
      line1: "",
      line2: "",
      city: "",
      provinceCode: "",
      postalCode: "",
      countryCode: "",
      latitude: 0,
      longitude: 0,
      placeProvider: "",
      placeProviderReferenceID: "",
      capturedDate: new Date().toISOString().split('T')[0],
      capturedBy: ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim(),
      updatedDate: "",
      updatedBy: ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim(),
    };
  }, [isEditMode, initialAddress]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(addressSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialAddress && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialAddress, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialAddress && opts_organizationID.length > 0) {
      const currentorganizationID = (initialAddress as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = Number(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialAddress, setValue]);

  const onSubmitHandler = async (data: AddressFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} address...`, 'info');
      const payload: any = {
        addressID: (isEditMode ? ((initialAddress as any)?.addressID ?? null) : null),
        organizationID: data.organizationID ?? '',
        addressType: data.addressType ?? '',
        line1: data.line1 ?? '',
        line2: data.line2 ?? '',
        city: data.city ?? '',
        provinceCode: data.provinceCode ?? '',
        postalCode: data.postalCode ?? '',
        countryCode: data.countryCode ?? '',
        latitude: data.latitude,
        longitude: data.longitude,
        placeProvider: data.placeProvider ?? '',
        placeProviderReferenceID: data.placeProviderReferenceID ?? '',
        capturedDate: data.capturedDate || new Date().toISOString().split('T')[0],
        capturedBy: (data.capturedBy || ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate: data.updatedDate || null,
        updatedBy: (data.updatedBy || ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateAddress(payload as Address) : await createAddress(payload as Address);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`Address "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/addresses');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit Address' : 'Create Address'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Organization " error={errors.organizationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationID')}>
              <option value="">Select Organization</option>
              {opts_organizationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Address Type" error={errors.addressType?.message as string}>
            <input className="input" placeholder="Enter address type" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('addressType')}  />
          </Field>
          <Field label="Line 1" error={errors.line1?.message as string}>
            <textarea className="input" placeholder="Enter address line 1" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('line1')} rows={3} />
          </Field>
          <Field label="Line 2" error={errors.line2?.message as string}>
            <textarea className="input" placeholder="Enter address line 2" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('line2')} rows={3} />
          </Field>
          <Field label="City" error={errors.city?.message as string}>
            <input className="input" placeholder="Enter city" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('city')}  />
          </Field>
          <Field label="Province Code" error={errors.provinceCode?.message as string}>
            <input className="input" placeholder="Enter province code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('provinceCode')}  />
          </Field>
          <Field label="Postal Code" error={errors.postalCode?.message as string}>
            <input className="input" placeholder="Enter postal code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('postalCode')}  />
          </Field>
          <Field label="Country Code" error={errors.countryCode?.message as string}>
            <input className="input" placeholder="Enter country code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('countryCode')}  />
          </Field>
          <Field label="Latitude" error={errors.latitude?.message as string}>
            <input className="input" placeholder="Enter latitude" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('latitude', { valueAsNumber: true })} />
          </Field>
          <Field label="Longitude" error={errors.longitude?.message as string}>
            <input className="input" placeholder="Enter longitude" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('longitude', { valueAsNumber: true })} />
          </Field>
          <Field label="Place Provider" error={errors.placeProvider?.message as string}>
            <input className="input" placeholder="Enter place provider" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('placeProvider')}  />
          </Field>
          <Field label="Place Provider Reference ID" error={errors.placeProviderReferenceID?.message as string}>
            <textarea className="input" placeholder="Enter place provider reference ID" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('placeProviderReferenceID')} rows={3} />
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

