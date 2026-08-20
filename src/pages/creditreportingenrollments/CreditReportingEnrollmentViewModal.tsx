{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { CreditReportingEnrollment } from '../../types/CreditReportingEnrollment';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface CreditReportingEnrollmentViewModalProps {
  creditReportingEnrollment: CreditReportingEnrollment | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreditReportingEnrollmentViewModal({ creditReportingEnrollment, isOpen, onClose }: CreditReportingEnrollmentViewModalProps) {

  const [leaseIDMap, setLeaseIDMap] = React.useState<Record<string, string>>({ });
  const [leaseRenewalIDMap, setLeaseRenewalIDMap] = React.useState<Record<string, string>>({ });
  const [tenantIDMap, setTenantIDMap] = React.useState<Record<string, string>>({ });

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
        const res = await fetchData('api/tenant/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.tenantID ?? it.id)] = it.name ?? it.name ?? String(it.tenantID ?? ''); });
        setTenantIDMap(map);
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
      case 'Completed': return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'In Progress': return { backgroundColor: '#fef3c7', color: '#92400e' };
      default: return { backgroundColor: 'var(--surface)', color: 'var(--muted)' };
    }
  };

  if (!isOpen || !creditReportingEnrollment) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>CreditReportingEnrollment Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Status</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {creditReportingEnrollment.status || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Status</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500, ...getStatusStyle(creditReportingEnrollment.status || '') }}>
                    {creditReportingEnrollment.status || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Lease</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseIDMap[String(creditReportingEnrollment.leaseID)] ?? creditReportingEnrollment.leaseID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Lease Renewal</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseRenewalIDMap[String(creditReportingEnrollment.leaseRenewalID)] ?? creditReportingEnrollment.leaseRenewalID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Tenant</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {tenantIDMap[String(creditReportingEnrollment.tenantID)] ?? creditReportingEnrollment.tenantID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Provider Name</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {creditReportingEnrollment.providerName ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Provider Reference ID</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {creditReportingEnrollment.providerReferenceID ?? 'N/A'}
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Credit Reporting Enrollment ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {creditReportingEnrollment.creditReportingEnrollmentID ?? 'N/A'}
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

