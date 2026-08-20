{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { CreditReporting } from '../../types/CreditReporting';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface CreditReportingViewModalProps {
  creditReporting: CreditReporting | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreditReportingViewModal({ creditReporting, isOpen, onClose }: CreditReportingViewModalProps) {

  const [creditReportingEnrollmentIDMap, setCreditReportingEnrollmentIDMap] = React.useState<Record<string, string>>({ });
  const [invoiceMasterIDMap, setInvoiceMasterIDMap] = React.useState<Record<string, string>>({ });
  const [paymentIDMap, setPaymentIDMap] = React.useState<Record<string, string>>({ });

  React.useEffect(() => {
    const loadLookups = async () => {
      try {
        const res = await fetchData('api/creditreportingenrollment/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.creditReportingEnrollmentID ?? it.id)] = it.providerName ?? it.name ?? String(it.creditReportingEnrollmentID ?? ''); });
        setCreditReportingEnrollmentIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/invoicemaster/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.invoiceMasterID ?? it.id)] = it.invoiceNumber ?? it.name ?? String(it.invoiceMasterID ?? ''); });
        setInvoiceMasterIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/payment/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.paymentID ?? it.id)] = it.paymentID ?? it.name ?? String(it.paymentID ?? ''); });
        setPaymentIDMap(map);
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

  if (!isOpen || !creditReporting) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>CreditReporting Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Provider Status</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {creditReporting.providerStatus || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Credit Reporting Enrollment</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {creditReportingEnrollmentIDMap[String(creditReporting.creditReportingEnrollmentID)] ?? creditReporting.creditReportingEnrollmentID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Invoice Master</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMasterIDMap[String(creditReporting.invoiceMasterID)] ?? creditReporting.invoiceMasterID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Payment</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {paymentIDMap[String(creditReporting.paymentID)] ?? creditReporting.paymentID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Reported Amount</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {creditReporting.reportedAmount ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Was Paid On Time</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <input type="checkbox" checked={creditReporting.wasPaidOnTime ?? false} readOnly style={{ cursor: 'default' }} />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Reporting Period Start</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {creditReporting.reportingPeriodStart ? new Date(creditReporting.reportingPeriodStart as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Reporting Period End</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {creditReporting.reportingPeriodEnd ? new Date(creditReporting.reportingPeriodEnd as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Provider Reference ID</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {creditReporting.providerReferenceID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Provider Response</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {creditReporting.providerResponse ?? 'N/A'}
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Credit Reporting ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {creditReporting.creditReportingID ?? 'N/A'}
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

