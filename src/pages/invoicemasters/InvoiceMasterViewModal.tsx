{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { InvoiceMaster } from '../../types/InvoiceMaster';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface InvoiceMasterViewModalProps {
  invoiceMaster: InvoiceMaster | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceMasterViewModal({ invoiceMaster, isOpen, onClose }: InvoiceMasterViewModalProps) {

  const [leaseIDMap, setLeaseIDMap] = React.useState<Record<string, string>>({ });
  const [leaseRenewalIDMap, setLeaseRenewalIDMap] = React.useState<Record<string, string>>({ });
  const [organizationIDMap, setOrganizationIDMap] = React.useState<Record<string, string>>({ });
  const [tenantIDMap, setTenantIDMap] = React.useState<Record<string, string>>({ });
  const [amountPaidMap, setAmountPaidMap] = React.useState<Record<string, string>>({ });

  React.useEffect(() => {
    const loadLookups = async () => {
      try {
        const res = await fetchData('api/lease/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.leaseID ?? it.id)] = it.leaseID ?? it.name ?? String(it.leaseID ?? ''); });
        setLeaseIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/leaserenewal/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.leaseRenewalID ?? it.id)] = it.leaseRenewalID ?? it.name ?? String(it.leaseRenewalID ?? ''); });
        setLeaseRenewalIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/organization/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.organizationID ?? it.id)] = it.name ?? it.name ?? String(it.organizationID ?? ''); });
        setOrganizationIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/tenant/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.tenantID ?? it.id)] = it.name ?? it.name ?? String(it.tenantID ?? ''); });
        setTenantIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/amountpa/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.id ?? it.id)] = it.name ?? it.name ?? String(it.id ?? ''); });
        setAmountPaidMap(map);
      } catch { /* non-critical */ }
    };
    if (isOpen) loadLookups();
  }, [isOpen]);
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DRAFT': return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'OPEN': return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'PARTIALLY_PAID': return { backgroundColor: '#e0ecff', color: '#1e3a8a' };
      case 'PAID': return { backgroundColor: '#f3e8ff', color: '#6b21a8' };
      case 'OVERDUE': return { backgroundColor: '#ffe4e6', color: '#9f1239' };
      case 'VOID': return { backgroundColor: '#e5e7eb', color: '#374151' };
      case 'DISPUTED': return { backgroundColor: '#dcfce7', color: '#166534' };
      default: return { backgroundColor: 'var(--surface)', color: 'var(--muted)' };
    }
  };

  if (!isOpen || !invoiceMaster) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 1000, padding: '20px'
      }}
    >
      <div
        className="card modal-content"
        style={{ padding: 0, maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'hidden', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header">
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>InvoiceMaster Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Invoice Number</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {invoiceMaster.invoiceNumber || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Status</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500, ...getStatusStyle(invoiceMaster.status || '') }}>
                    {invoiceMaster.status || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Lease</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseIDMap[String(invoiceMaster.leaseID)] ?? invoiceMaster.leaseID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Lease Renewal</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseRenewalIDMap[String(invoiceMaster.leaseRenewalID)] ?? invoiceMaster.leaseRenewalID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Organization</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {organizationIDMap[String(invoiceMaster.organizationID)] ?? invoiceMaster.organizationID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Tenant</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {tenantIDMap[String(invoiceMaster.tenantID)] ?? invoiceMaster.tenantID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Billing Period Start</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMaster.billingPeriodStart ? new Date(invoiceMaster.billingPeriodStart as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Billing Period End</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMaster.billingPeriodEnd ? new Date(invoiceMaster.billingPeriodEnd as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Due Date</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMaster.dueDate ? new Date(invoiceMaster.dueDate as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Subtotal Amount</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMaster.subtotalAmount ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Tax Amount</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMaster.taxAmount ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Discount Amount</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMaster.discountAmount ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Late Fee Amount</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMaster.lateFeeAmount ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Adjustment Amount</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMaster.adjustmentAmount ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Total Amount</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMaster.totalAmount ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Amount Paid</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {amountPaidMap[String(invoiceMaster.amountPaid)] ?? invoiceMaster.amountPaid ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Balance Due</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMaster.balanceDue ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Currency</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMaster.currency ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Issued At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMaster.issuedAt ? new Date(invoiceMaster.issuedAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Paid At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMaster.paidAt ? new Date(invoiceMaster.paidAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Voided At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMaster.voidedAt ? new Date(invoiceMaster.voidedAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Void Reason</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMaster.voidReason ?? 'N/A'}
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Invoice Master ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {invoiceMaster.invoiceMasterID ?? 'N/A'}
              </div>
            </div>

          </div>
        </div>

        <div className="card-footer">
          <div></div>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

