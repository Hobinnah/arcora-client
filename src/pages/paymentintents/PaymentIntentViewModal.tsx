{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { PaymentIntent } from '../../types/PaymentIntent';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface PaymentIntentViewModalProps {
  paymentIntent: PaymentIntent | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentIntentViewModal({ paymentIntent, isOpen, onClose }: PaymentIntentViewModalProps) {

  const [invoiceMasterIDMap, setInvoiceMasterIDMap] = React.useState<Record<string, string>>({ });
  const [autopayMandateIDMap, setAutopayMandateIDMap] = React.useState<Record<string, string>>({ });
  const [tenantIDMap, setTenantIDMap] = React.useState<Record<string, string>>({ });
  const [paymentMethodIDMap, setPaymentMethodIDMap] = React.useState<Record<string, string>>({ });

  React.useEffect(() => {
    const loadLookups = async () => {
      try {
        const res = await fetchData('api/invoicemaster/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.invoiceMasterID ?? it.id)] = it.invoiceNumber ?? it.name ?? String(it.invoiceMasterID ?? ''); });
        setInvoiceMasterIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/autopaymandate/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.autopayMandateID ?? it.id)] = it.mandateReference ?? it.name ?? String(it.autopayMandateID ?? ''); });
        setAutopayMandateIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/tenant/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.tenantID ?? it.id)] = it.fullName ?? it.name ?? String(it.tenantID ?? ''); });
        setTenantIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/paymentmethod/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.paymentMethodID ?? it.id)] = it.methodName ?? it.name ?? String(it.paymentMethodID ?? ''); });
        setPaymentMethodIDMap(map);
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
      case 'CREATED': return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'SCHEDULED': return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'PROCESSING': return { backgroundColor: '#e0ecff', color: '#1e3a8a' };
      case 'REQUIRES_ACTION': return { backgroundColor: '#f3e8ff', color: '#6b21a8' };
      case 'SUCCEEDED': return { backgroundColor: '#ffe4e6', color: '#9f1239' };
      case 'FAILED': return { backgroundColor: '#e5e7eb', color: '#374151' };
      case 'CANCELLED': return { backgroundColor: '#dcfce7', color: '#166534' };
      default: return { backgroundColor: 'var(--surface)', color: 'var(--muted)' };
    }
  };

  if (!isOpen || !paymentIntent) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>PaymentIntent Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Currency</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {paymentIntent.currency || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Status</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500, ...getStatusStyle(paymentIntent.status || '') }}>
                    {paymentIntent.status || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Invoice Master</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMasterIDMap[String(paymentIntent.invoiceMasterID)] ?? paymentIntent.invoiceMasterID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Autopay Mandate</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {autopayMandateIDMap[String(paymentIntent.autopayMandateID)] ?? paymentIntent.autopayMandateID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Tenant</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {tenantIDMap[String(paymentIntent.tenantID)] ?? paymentIntent.tenantID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Payment Method</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {paymentMethodIDMap[String(paymentIntent.paymentMethodID)] ?? paymentIntent.paymentMethodID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Amount</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {paymentIntent.amount ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Collection Method</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {paymentIntent.collectionMethod ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Provider Name</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {paymentIntent.providerName ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Provider Payment Intent ID</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {paymentIntent.providerPaymentIntentID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Idempotency Key</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {paymentIntent.idempotencyKey ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Scheduled Charge At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {paymentIntent.scheduledChargeAt ? new Date(paymentIntent.scheduledChargeAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Started At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {paymentIntent.startedAt ? new Date(paymentIntent.startedAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Completed At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {paymentIntent.completedAt ? new Date(paymentIntent.completedAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Cancelled At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {paymentIntent.cancelledAt ? new Date(paymentIntent.cancelledAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Failure Reason</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {paymentIntent.failureReason ?? 'N/A'}
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Payment Intent ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {paymentIntent.paymentIntentID ?? 'N/A'}
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

