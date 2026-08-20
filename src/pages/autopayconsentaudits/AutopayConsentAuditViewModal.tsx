{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { AutopayConsentAudit } from '../../types/AutopayConsentAudit';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface AutopayConsentAuditViewModalProps {
  autopayConsentAudit: AutopayConsentAudit | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AutopayConsentAuditViewModal({ autopayConsentAudit, isOpen, onClose }: AutopayConsentAuditViewModalProps) {

  const [autopayMandateIDMap, setAutopayMandateIDMap] = React.useState<Record<string, string>>({ });
  const [tenantIDMap, setTenantIDMap] = React.useState<Record<string, string>>({ });

  React.useEffect(() => {
    const loadLookups = async () => {
      try {
        const res = await fetchData('api/autopaymandate/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.autopayMandateID ?? it.id)] = it.providerReferenceID ?? it.name ?? String(it.autopayMandateID ?? ''); });
        setAutopayMandateIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/tenant/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.tenantID ?? it.id)] = it.tenantName ?? it.name ?? String(it.tenantID ?? ''); });
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

  if (!isOpen || !autopayConsentAudit) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>AutopayConsentAudit Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Action</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {autopayConsentAudit.action || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Autopay Mandate</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {autopayMandateIDMap[String(autopayConsentAudit.autopayMandateID)] ?? autopayConsentAudit.autopayMandateID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Tenant</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {tenantIDMap[String(autopayConsentAudit.tenantID)] ?? autopayConsentAudit.tenantID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Consent Version</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {autopayConsentAudit.consentVersion ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Consent Text Hash</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {autopayConsentAudit.consentTextHash ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">IP Address</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {autopayConsentAudit.ipAddress ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">User Agent</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {autopayConsentAudit.userAgent ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Provider Reference ID</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {autopayConsentAudit.providerReferenceID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Action At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {autopayConsentAudit.actionAt ? new Date(autopayConsentAudit.actionAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Metadata</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {autopayConsentAudit.metadata ?? 'N/A'}
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Autopay Consent Audit ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {autopayConsentAudit.autopayConsentAuditID ?? 'N/A'}
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

