{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { PaymentAllocation } from '../../types/PaymentAllocation';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface PaymentAllocationViewModalProps {
  paymentAllocation: PaymentAllocation | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentAllocationViewModal({ paymentAllocation, isOpen, onClose }: PaymentAllocationViewModalProps) {

  const [paymentIDMap, setPaymentIDMap] = React.useState<Record<string, string>>({ });
  const [invoiceMasterIDMap, setInvoiceMasterIDMap] = React.useState<Record<string, string>>({ });
  const [invoiceDetailIDMap, setInvoiceDetailIDMap] = React.useState<Record<string, string>>({ });

  React.useEffect(() => {
    const loadLookups = async () => {
      try {
        const res = await fetchData('api/payment/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.paymentID ?? it.id)] = it.paymentID ?? it.name ?? String(it.paymentID ?? ''); });
        setPaymentIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/invoicemaster/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.invoiceMasterID ?? it.id)] = it.invoiceMasterID ?? it.name ?? String(it.invoiceMasterID ?? ''); });
        setInvoiceMasterIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/invoicedetail/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.invoiceDetailID ?? it.id)] = it.invoiceDetailID ?? it.name ?? String(it.invoiceDetailID ?? ''); });
        setInvoiceDetailIDMap(map);
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

  if (!isOpen || !paymentAllocation) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>PaymentAllocation Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Allocation Type</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {paymentAllocation.allocationType || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Payment</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {paymentIDMap[String(paymentAllocation.paymentID)] ?? paymentAllocation.paymentID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Invoice Master</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMasterIDMap[String(paymentAllocation.invoiceMasterID)] ?? paymentAllocation.invoiceMasterID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Invoice Detail</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceDetailIDMap[String(paymentAllocation.invoiceDetailID)] ?? paymentAllocation.invoiceDetailID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Allocated Amount</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {paymentAllocation.allocatedAmount ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Allocated At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {paymentAllocation.allocatedAt ? new Date(paymentAllocation.allocatedAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Payment Allocation ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {paymentAllocation.paymentAllocationID ?? 'N/A'}
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

