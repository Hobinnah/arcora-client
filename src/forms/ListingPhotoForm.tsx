{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { ListingPhoto } from '../types/ListingPhoto';
import { createListingPhoto, updateListingPhoto } from '../apis/useListingPhoto';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const listingPhotoSchema = z.object({
  listingID: z.string().min(1, "Listing is required"),
  url: z.string().max(500, "Photo URL must be less than 500 characters").min(1, "Photo URL is required"),
  location: z.string().max(50, "Location must be less than 50 characters").optional().refine(v => (v ?? '') === '' || ["LivingRoom", "Bedroom", "Bathroom", "Laundry", "Exterior", "Additional"].includes(v as any), "Invalid Location"),
  caption: z.string().max(255, "Caption must be less than 255 characters").optional(),
  altText: z.string().max(255, "Alt Text must be less than 255 characters").optional(),
  displayOrder: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Display Order is required")),
  isCoverPhoto: z.boolean(),
});

type ListingPhotoFormData = z.infer<typeof listingPhotoSchema>;

interface ListingPhotoFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialListingPhoto?: ListingPhoto | null;
  isEditMode?: boolean;
}

export default function ListingPhotoForm({ onAlert, initialListingPhoto = null, isEditMode = false }: ListingPhotoFormProps) {
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

  const getDefaultValues = React.useCallback((): ListingPhotoFormData => {
    const src = (initialListingPhoto as any) ?? {};
    if (isEditMode && initialListingPhoto) {
      return {
        listingID: (src?.listingID ?? ""),
        url: (src?.url ?? ""),
        location: (src?.location ?? ""),
        caption: (src?.caption ?? ""),
        altText: (src?.altText ?? ""),
        displayOrder: (src?.displayOrder ?? 0),
        isCoverPhoto: Boolean(src?.isCoverPhoto),
      };
    }
    return {
      listingID: "",
      url: "",
      location: "",
      caption: "",
      altText: "",
      displayOrder: 0,
      isCoverPhoto: false,
    };
  }, [isEditMode, initialListingPhoto]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(listingPhotoSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialListingPhoto && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialListingPhoto, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialListingPhoto && opts_listingID.length > 0) {
      const currentlistingID = (initialListingPhoto as any)?.listingID ;
      if (currentlistingID !== undefined && currentlistingID!== null) {
        const listingIDValue = Number(currentlistingID);
        if (opts_listingID.some(opt => opt.value === String(listingIDValue))) {
          setValue('listingID', listingIDValue);
        }
      }
    }
  }, [opts_listingID, isEditMode, initialListingPhoto, setValue]);

  const onSubmitHandler = async (data: ListingPhotoFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} listingphoto...`, 'info');
      const payload: any = {
        listingPhotoID: (isEditMode ? ((initialListingPhoto as any)?.listingPhotoID ?? null) : null),
        listingID: data.listingID ?? '',
        url: data.url ?? '',
        location: data.location ?? '',
        caption: data.caption ?? '',
        altText: data.altText ?? '',
        displayOrder: data.displayOrder,
        isCoverPhoto: data.isCoverPhoto,
        capturedDate : (isEditMode ? ((initialListingPhoto as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialListingPhoto as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateListingPhoto(payload as ListingPhoto) : await createListingPhoto(payload as ListingPhoto);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`ListingPhoto "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/listingphotos');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit ListingPhoto' : 'Create ListingPhoto'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Listing *" error={errors.listingID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('listingID')}>
              <option value="">Select Listing</option>
              {opts_listingID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_listingID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Photo URL" error={errors.url?.message as string}>
            <textarea className="input" placeholder="Enter photo URL" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('url')} rows={3} />
          </Field>
          <Field label="Location " error={errors.location?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('location')}>
              <option value="">Select Location</option>
              <option value="LivingRoom">LivingRoom</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Bathroom">Bathroom</option>
              <option value="Laundry">Laundry</option>
              <option value="Exterior">Exterior</option>
              <option value="Additional">Additional</option>
            </select>
          </Field>
          <Field label="Caption" error={errors.caption?.message as string}>
            <textarea className="input" placeholder="Enter caption" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('caption')} rows={3} />
          </Field>
          <Field label="Alt Text" error={errors.altText?.message as string}>
            <textarea className="input" placeholder="Enter alternative text" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('altText')} rows={3} />
          </Field>
          <Field label="Display Order" error={errors.displayOrder?.message as string}>
            <input className="input" placeholder="Enter display order" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('displayOrder', { valueAsNumber: true })} />
          </Field>
          <Field label="Is Cover Photo" error={errors.isCoverPhoto?.message as string}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isCoverPhoto')} />
              <span>Yes</span>
            </label>
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

