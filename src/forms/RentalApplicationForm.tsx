{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { RentalApplication } from '../types/RentalApplication';
import { createRentalApplication, updateRentalApplication } from '../apis/useRentalApplication';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const rentalApplicationSchema = z.object({
  applicationCode: z.string().max(50, "Application Code must be less than 50 characters").min(1, "Application Code is required"),
  listingID: z.string().min(1, "Listing is required"),
  tenantID: z.string().min(1, "Tenant is required"),
  desiredMoveInDate: z.string(),
  desiredMoveOutDate: z.string().optional(),
  requestedLeaseTermMonths: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Requested Lease Term (Months) is required")),
  adultOccupantCount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Adult Occupant Count is required")),
  childOccupantCount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Child Occupant Count is required")),
  petCount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().min(1, "Pet Count is required")),
  proposedMonthlyRentAmount: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  currency: z.string().max(3, "Currency must be less than 3 characters").min(1, "Currency is required"),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "DECLINED", "WITHDRAWN", "EXPIRED"].includes(v as any), "Invalid Status"),
  screeningStatus: z.string().max(50, "Screening Status must be less than 50 characters").min(1, "Screening Status is required").refine(v => (v ?? '') === '' || ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "FAILED"].includes(v as any), "Invalid Screening Status"),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
});

type RentalApplicationFormData = z.infer<typeof rentalApplicationSchema>;

interface RentalApplicationFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialRentalApplication?: RentalApplication | null;
  isEditMode?: boolean;
}

export default function RentalApplicationForm({ onAlert, initialRentalApplication = null, isEditMode = false }: RentalApplicationFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_listingID, setOpts_listingID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_listingID_loading, setOpts_listingID_loading] = React.useState(false);
  const [opts_tenantID, setOpts_tenantID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_tenantID_loading, setOpts_tenantID_loading] = React.useState(false);

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
        label: firstNonEmpty(it, ["listingID", "name", "listingName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_tenantID(){
    try { setOpts_tenantID_loading(true);
      const url = "api/tenant/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'tenantID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["tenantID", "name", "tenantName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["tenantID", "tenantID", "id", "ID", "tenantID", "tenantId"], String(it))
      }));
      setOpts_tenantID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_tenantID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_tenantID(); }, []);

  const getDefaultValues = React.useCallback((): RentalApplicationFormData => {
    const src = (initialRentalApplication as any) ?? {};
    if (isEditMode && initialRentalApplication) {
      return {
        applicationCode: (src?.applicationCode ?? ""),
        listingID: (src?.listingID ?? ""),
        tenantID: (src?.tenantID ?? ""),
        desiredMoveInDate: src?.desiredMoveInDate ? new Date(src?.desiredMoveInDate as any).toISOString().split('T')[0] : "",
        desiredMoveOutDate: src?.desiredMoveOutDate ? new Date(src?.desiredMoveOutDate as any).toISOString().split('T')[0] : "",
        requestedLeaseTermMonths: (src?.requestedLeaseTermMonths ?? 0),
        adultOccupantCount: (src?.adultOccupantCount ?? 0),
        childOccupantCount: (src?.childOccupantCount ?? 0),
        petCount: (src?.petCount ?? 0),
        proposedMonthlyRentAmount: (src?.proposedMonthlyRentAmount ?? 0),
        currency: (src?.currency ?? ""),
        status: (src?.status ?? ""),
        screeningStatus: (src?.screeningStatus ?? ""),
        notes: (src?.notes ?? ""),
      };
    }
    return {
      applicationCode: "",
      listingID: "",
      tenantID: "",
      desiredMoveInDate: "",
      desiredMoveOutDate: "",
      requestedLeaseTermMonths: 0,
      adultOccupantCount: 0,
      childOccupantCount: 0,
      petCount: 0,
      proposedMonthlyRentAmount: 0,
      currency: "",
      status: "DRAFT",
      screeningStatus: "",
      notes: "",
    };
  }, [isEditMode, initialRentalApplication]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(rentalApplicationSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialRentalApplication && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialRentalApplication, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialRentalApplication && opts_listingID.length > 0) {
      const currentlistingID = (initialRentalApplication as any)?.listingID ;
      if (currentlistingID !== undefined && currentlistingID!== null) {
        const listingIDValue = Number(currentlistingID);
        if (opts_listingID.some(opt => opt.value === String(listingIDValue))) {
          setValue('listingID', listingIDValue);
        }
      }
    }
  }, [opts_listingID, isEditMode, initialRentalApplication, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialRentalApplication && opts_tenantID.length > 0) {
      const currenttenantID = (initialRentalApplication as any)?.tenantID ;
      if (currenttenantID !== undefined && currenttenantID!== null) {
        const tenantIDValue = Number(currenttenantID);
        if (opts_tenantID.some(opt => opt.value === String(tenantIDValue))) {
          setValue('tenantID', tenantIDValue);
        }
      }
    }
  }, [opts_tenantID, isEditMode, initialRentalApplication, setValue]);

  const onSubmitHandler = async (data: RentalApplicationFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} rentalapplication...`, 'info');
      const payload: any = {
        rentalApplicationID: (isEditMode ? ((initialRentalApplication as any)?.rentalApplicationID ?? null) : null),
        applicationCode: data.applicationCode ?? '',
        listingID: data.listingID ?? '',
        tenantID: data.tenantID ?? '',
        desiredMoveInDate: data.desiredMoveInDate || null,
        desiredMoveOutDate: data.desiredMoveOutDate || null,
        requestedLeaseTermMonths: data.requestedLeaseTermMonths,
        adultOccupantCount: data.adultOccupantCount,
        childOccupantCount: data.childOccupantCount,
        petCount: data.petCount,
        proposedMonthlyRentAmount: data.proposedMonthlyRentAmount,
        currency: data.currency ?? '',
        status: data.status ?? '',
        screeningStatus: data.screeningStatus ?? '',
        notes: data.notes ?? '',
        submittedAt : (isEditMode ? ((initialRentalApplication as any)?.submittedAt ?? null) : null),
        reviewedAt : (isEditMode ? ((initialRentalApplication as any)?.reviewedAt ?? null) : null),
        reviewedByOrganizationMemberID : (isEditMode ? ((initialRentalApplication as any)?.reviewedByOrganizationMemberID ?? '') : ''),
        approvedAt : (isEditMode ? ((initialRentalApplication as any)?.approvedAt ?? null) : null),
        declinedAt : (isEditMode ? ((initialRentalApplication as any)?.declinedAt ?? null) : null),
        declineReason : (isEditMode ? ((initialRentalApplication as any)?.declineReason ?? '') : ''),
        expiresAt : (isEditMode ? ((initialRentalApplication as any)?.expiresAt ?? null) : null),
        capturedDate : (isEditMode ? ((initialRentalApplication as any)?.capturedDate ?? new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
        capturedBy: (isEditMode ? ((initialRentalApplication as any)?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate : (isEditMode ? ((initialRentalApplication as any)?.updatedDate ?? null) : null),
        updatedBy: (isEditMode ? ((initialRentalApplication as any)?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()) : ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateRentalApplication(payload as RentalApplication) : await createRentalApplication(payload as RentalApplication);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`RentalApplication "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/rentalapplications');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit RentalApplication' : 'Create RentalApplication'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Application Code" error={errors.applicationCode?.message as string}>
            <input className="input" placeholder="Enter application code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('applicationCode')}  />
          </Field>
          <Field label="Listing *" error={errors.listingID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('listingID')}>
              <option value="">Select Listing</option>
              {opts_listingID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_listingID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Tenant *" error={errors.tenantID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('tenantID')}>
              <option value="">Select Tenant</option>
              {opts_tenantID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_tenantID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Desired Move-In Date" error={errors.desiredMoveInDate?.message as string}>
            <input className="input" placeholder="Select desired move-in date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('desiredMoveInDate')} />
          </Field>
          <Field label="Desired Move-Out Date" error={errors.desiredMoveOutDate?.message as string}>
            <input className="input" placeholder="Select desired move-out date" type="date" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('desiredMoveOutDate')} />
          </Field>
          <Field label="Requested Lease Term (Months)" error={errors.requestedLeaseTermMonths?.message as string}>
            <input className="input" placeholder="Enter lease term in months" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('requestedLeaseTermMonths', { valueAsNumber: true })} />
          </Field>
          <Field label="Adult Occupant Count" error={errors.adultOccupantCount?.message as string}>
            <input className="input" placeholder="Enter number of adults" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('adultOccupantCount', { valueAsNumber: true })} />
          </Field>
          <Field label="Child Occupant Count" error={errors.childOccupantCount?.message as string}>
            <input className="input" placeholder="Enter number of children" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('childOccupantCount', { valueAsNumber: true })} />
          </Field>
          <Field label="Pet Count" error={errors.petCount?.message as string}>
            <input className="input" placeholder="Enter number of pets" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('petCount', { valueAsNumber: true })} />
          </Field>
          <Field label="Proposed Monthly Rent Amount" error={errors.proposedMonthlyRentAmount?.message as string}>
            <input className="input" placeholder="Enter proposed rent amount" type="number" min="0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('proposedMonthlyRentAmount', { valueAsNumber: true })} />
          </Field>
          <Field label="Currency" error={errors.currency?.message as string}>
            <input className="input" placeholder="Enter currency code" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('currency')}  />
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              <option value="APPROVED">APPROVED</option>
              <option value="DECLINED">DECLINED</option>
              <option value="WITHDRAWN">WITHDRAWN</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>
          </Field>
          <Field label="Screening Status *" error={errors.screeningStatus?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('screeningStatus')}>
              <option value="">Select Screening Status</option>
              <option value="NOT_STARTED">NOT_STARTED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </Field>
          <Field label="Notes" error={errors.notes?.message as string}>
            <textarea className="input" placeholder="Enter notes" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('notes')} rows={3} />
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

