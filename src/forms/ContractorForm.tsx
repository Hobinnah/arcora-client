{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, XIcon, CheckIcon } from '../components/Icons';
import type { AlertType } from '../env';
import type { Contractor } from '../types/Contractor';
import { createContractor, updateContractor } from '../apis/useContractor';
import { fetchData } from '../apis/useApi';
import { useAuth } from '../hooks/useAuth';

// Zod validation schema (numeric values preprocessed to numbers to support <select> sources)
const contractorSchema = z.object({
  organizationID: z.string().min(1, "Organization is required"),
  companyName: z.string().max(100, "Company Name must be less than 100 characters").optional(),
  contactName: z.string().max(100, "Contact Name must be less than 100 characters").min(1, "Contact Name is required"),
  email: z.string().max(255, "Email must be less than 255 characters").optional(),
  phoneNumber: z.string().max(50, "Phone Number must be less than 50 characters").optional(),
  categoryID: z.preprocess((v) => (typeof v === 'string' ? (v.trim()==='' ? 0 : Number(v)) : v), z.number().optional()),
  status: z.string().max(50, "Status must be less than 50 characters").min(1, "Status is required").refine(v => (v ?? '') === '' || ["ACTIVE", "INACTIVE"].includes(v as any), "Invalid Status"),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
  capturedDate: z.string().optional(),
  capturedBy: z.string().max(100, "Captured By must be less than 100 characters").optional(),
  updatedDate: z.string().optional(),
  updatedBy: z.string().max(100, "Updated By must be less than 100 characters").optional(),
});

type ContractorFormData = z.infer<typeof contractorSchema>;

interface ContractorFormProps {
  onAlert?: (message: string, type: AlertType) => void;
  initialContractor?: Contractor | null;
  isEditMode?: boolean;
}

export default function ContractorForm({ onAlert, initialContractor = null, isEditMode = false }: ContractorFormProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  const [opts_organizationID, setOpts_organizationID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_organizationID_loading, setOpts_organizationID_loading] = React.useState(false);
  const [opts_categoryID, setOpts_categoryID] = React.useState<Array<{ label: string; value: string }>>([]);
  const [opts_categoryID_loading, setOpts_categoryID_loading] = React.useState(false);

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
        label: firstNonEmpty(it, ["organizationName", "name", "organizationName", "title", "fullName", "email", "description"], String(it)),
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

  async function loadOptions_categoryID(){
    try { setOpts_categoryID_loading(true);
      const url = "api/contractorcategory/get" + toQuery({pageSize: 1000, pageNumber: 1 });
     const data = await fetchData<Array<any>>(url, 'categoryID');
      if (!data) throw new Error('Failed to load options');
      const payload = (data as any)?.data;
      const arr = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      if (!Array.isArray(arr)) throw new Error('Options payload is not an array');
      const mapped = arr.map((it:any) => ({
        label: firstNonEmpty(it, ["categoryName", "name", "categoryName", "title", "fullName", "email", "description"], String(it)),
        value: firstNonEmpty(it, ["categoryID", "categoryID", "id", "ID", "categoryID", "categoryId"], String(it))
      }));
      setOpts_categoryID(mapped);
    } catch (e:any) {
      console.error('Load options error:', e);
      // soft-fail without blocking the form
    } finally {
      setOpts_categoryID_loading(false);
    }
  }

  React.useEffect(() => { loadOptions_categoryID(); }, []);

  const getDefaultValues = React.useCallback((): ContractorFormData => {
    const src = (initialContractor as any) ?? {};
    if (isEditMode && initialContractor) {
      return {
        organizationID: (src?.organizationID ?? ""),
        companyName: (src?.companyName ?? ""),
        contactName: (src?.contactName ?? ""),
        email: (src?.email ?? ""),
        phoneNumber: (src?.phoneNumber ?? ""),
        categoryID: (() => {
          if (src?.categoryID !== undefined && src?.categoryID !== null) {
            return Number(src.categoryID);
          }
          return 0;
        })(),
        status: (src?.status ?? ""),
        notes: (src?.notes ?? ""),
        capturedDate: src?.capturedDate ? new Date(src?.capturedDate as any).toISOString().split('T')[0] : "",
        capturedBy: (src?.capturedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate: src?.updatedDate ? new Date(src?.updatedDate as any).toISOString().split('T')[0] : "",
        updatedBy: (src?.updatedBy ?? ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
    }
    return {
      organizationID: "",
      companyName: "",
      contactName: "",
      email: "",
      phoneNumber: "",
      categoryID: 0,
      status: "ACTIVE",
      notes: "",
      capturedDate: new Date().toISOString().split('T')[0],
      capturedBy: ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim(),
      updatedDate: "",
      updatedBy: ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim(),
    };
  }, [isEditMode, initialContractor]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(contractorSchema),
  });

  const [hasLoadedItem, setHasLoadedItem] = React.useState(false);
  React.useEffect(() => {
    if (isEditMode && initialContractor && !hasLoadedItem) { reset(getDefaultValues()); setHasLoadedItem(true); }
    else if (!isEditMode) { setHasLoadedItem(false); }
  }, [isEditMode, initialContractor, reset, getDefaultValues, hasLoadedItem]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialContractor && opts_organizationID.length > 0) {
      const currentorganizationID = (initialContractor as any)?.organizationID ;
      if (currentorganizationID !== undefined && currentorganizationID!== null) {
        const organizationIDValue = String(currentorganizationID);
        if (opts_organizationID.some(opt => opt.value === String(organizationIDValue))) {
          setValue('organizationID', organizationIDValue);
        }
      }
    }
  }, [opts_organizationID, isEditMode, initialContractor, setValue]);

  // Set userID explicitly when options are loaded to ensure dropdown shows correct value
  React.useEffect(() => {
    if (isEditMode && initialContractor && opts_categoryID.length > 0) {
      const currentcategoryID = (initialContractor as any)?.categoryID ;
      if (currentcategoryID !== undefined && currentcategoryID!== null) {
        const categoryIDValue = String(currentcategoryID);
        if (opts_categoryID.some(opt => opt.value === String(categoryIDValue))) {
          setValue('categoryID', categoryIDValue);
        }
      }
    }
  }, [opts_categoryID, isEditMode, initialContractor, setValue]);

  const onSubmitHandler = async (data: ContractorFormData) => {
    try {
      const action = isEditMode ? 'Updating' : 'Creating';
      onAlert?.(`${action} contractor...`, 'info');
      const payload: any = {
        contractorID: (isEditMode ? ((initialContractor as any)?.contractorID ?? null) : null),
        organizationID: data.organizationID ?? '',
        companyName: data.companyName ?? '',
        contactName: data.contactName ?? '',
        email: data.email ?? '',
        phoneNumber: data.phoneNumber ?? '',
        categoryID: (data.categoryID === 0 || data.categoryID === undefined || data.categoryID === null) ? 0 : Number(data.categoryID),
        status: data.status ?? '',
        notes: data.notes ?? '',
        capturedDate: data.capturedDate || new Date().toISOString().split('T')[0],
        capturedBy: (data.capturedBy || ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
        updatedDate: data.updatedDate || null,
        updatedBy: (data.updatedBy || ((currentUser?.user?.firstName || "") + " " + (currentUser?.user?.lastName || "")).trim()),
      };
      let result: any;
      result = isEditMode ? await updateContractor(payload as Contractor) : await createContractor(payload as Contractor);
      const successAction = isEditMode ? 'updated' : 'created';
      onAlert?.(`Contractor "${result?.title ?? result?.name ?? ''}" ${successAction} successfully!`, 'success');
      navigate('/contractors');
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
      <div className="card-header"><h3 className="card-title">{isEditMode ? 'Edit Contractor' : 'Create Contractor'}</h3></div>
      <form className="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', overflow: 'hidden' }}>
          <Field label="Organization *" error={errors.organizationID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('organizationID')}>
              <option value="">Select Organization</option>
              {opts_organizationID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_organizationID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Company Name" error={errors.companyName?.message as string}>
            <input className="input" placeholder="Enter company name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('companyName')}  />
          </Field>
          <Field label="Contact Name" error={errors.contactName?.message as string}>
            <input className="input" placeholder="Enter contact name" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('contactName')}  />
          </Field>
          <Field label="Email" error={errors.email?.message as string}>
            <textarea className="input" placeholder="Enter email address" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('email')} rows={3} />
          </Field>
          <Field label="Phone Number" error={errors.phoneNumber?.message as string}>
            <input className="input" placeholder="Enter phone number" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('phoneNumber')}  />
          </Field>
          <Field label="Category " error={errors.categoryID?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('categoryID')}>
              <option value="">Select Category</option>
              {opts_categoryID.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
            {opts_categoryID_loading && <div className="muted" style={{fontSize:'12px'}}>Loading options...</div>}
          </Field>
          <Field label="Status *" error={errors.status?.message as string}>
            <select className="select" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} {...register('status')}>
              <option value="">Select Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </Field>
          <Field label="Notes" error={errors.notes?.message as string}>
            <textarea className="input" placeholder="Enter notes" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} {...register('notes')} rows={3} />
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

