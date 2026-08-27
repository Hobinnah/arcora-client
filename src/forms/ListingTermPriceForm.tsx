{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { ListingTermPrice } from '../types/ListingTermPrice';
import { createListingTermPrice, updateListingTermPrice } from '../apis/useListingTermPrice';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const listingTermPriceSchema = z.object({
  listingID: z.string().min(1, "Listing is required"),
  leaseTermMonths: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Lease Term (Months) is required")),
  monthlyRentAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Monthly Rent Amount is required")),
  securityDepositAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  effectiveFrom: z.string().optional(),
  effectiveTo: z.string().optional(),
  isActive: z.boolean(),
});

type ListingTermPriceFormData = z.infer<typeof listingTermPriceSchema>;

interface ListingTermPriceFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialListingTermPrice?: ListingTermPrice | null;
  isEditMode?: boolean;
}

export default function ListingTermPriceForm({ onAlert, initialListingTermPrice = null, isEditMode = false }: ListingTermPriceFormProps) {
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

  const getDefaultValues = React.useCallback((): ListingTermPriceFormData => {
    const src = (initialListingTermPrice as any) ?? {};
    if (isEditMode && initialListingTermPrice) {
      return {
        listingID: (src?.listingID ?? ""),
        leaseTermMonths: (src?.leaseTermMonths ?? 0),
        monthlyRentAmount: (src?.monthlyRentAmount ?? 0),
        securityDepositAmount: (src?.securityDepositAmount ?? 0),
        effectiveFrom: src?.effectiveFrom ? new Date(src?.effectiveFrom as any).toISOString().split('T')[0] : "",
        effectiveTo: src?.effectiveTo ? new Date(src?.effectiveTo as any).toISOString().split('T')[0] : "",
        isActive: Boolean(src?.isActive),
      };
    }
    return {
      listingID: "",
      leaseTermMonths: 0,
      monthlyRentAmount: 0,
      securityDepositAmount: 0,
      effectiveFrom: "",
      effectiveTo: "",
      isActive: false,
    };
  }, [isEditMode, initialListingTermPrice]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(listingTermPriceSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialListingTermPrice && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialListingTermPrice, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialListingTermPrice && opts_listingID.length > 0) {
      const currentlistingID = (initialListingTermPrice as any)?.listingID ;
      if (currentlistingID !== undefined && currentlistingID!== null) {
        const listingIDValue = String(currentlistingID);
        if (opts_listingID.some(opt => opt.value === String(listingIDValue))) {
          setValue('listingID', listingIDValue);
        }
      }
    }
  }, [opts_listingID, isEditMode, initialListingTermPrice, setValue]);

  const onSubmitHandler = async (data: ListingTermPriceFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} listingtermprice...`, 'info');
      const payload: any = {
        listingTermPriceID: (isEditMode ? ((initialListingTermPrice as any)?.listingTermPriceID ?? null) : null),
        listingID: data.listingID ?? '',
        leaseTermMonths: data.leaseTermMonths,
        monthlyRentAmount: data.monthlyRentAmount,
        securityDepositAmount: data.securityDepositAmount,
        effectiveFrom: data.effectiveFrom || null,
        effectiveTo: data.effectiveTo || null,
        isActive: data.isActive,
        capturedDate : (isEditMode ? ((initialListingTermPrice as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialListingTermPrice as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialListingTermPrice as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialListingTermPrice as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateListingTermPrice(payload as ListingTermPrice) : await createListingTermPrice(payload as ListingTermPrice);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`ListingTermPrice "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/listingtermprices');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit ListingTermPrice' : 'Create ListingTermPrice'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Listing *" error={errors.listingID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('listingID')}>
              <option value="">Select Listing</option>
              {opts_listingID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_listingID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Lease Term (Months)" error={errors.leaseTermMonths?.message as string}>
            <input className="input" placeholder="Enter lease term in months" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('leaseTermMonths', { valueAsNumber: true })} />
          </Field>
          <Field label="Monthly Rent Amount" error={errors.monthlyRentAmount?.message as string}>
            <input className="input" placeholder="Enter monthly rent amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('monthlyRentAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Security Deposit Amount" error={errors.securityDepositAmount?.message as string}>
            <input className="input" placeholder="Enter security deposit amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('securityDepositAmount', { valueAsNumber: true })} />
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

