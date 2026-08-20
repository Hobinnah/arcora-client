{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { LeaseSignatories } from '../../types/LeaseSignatories';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface LeaseSignatoriesViewModalProps {
  leaseSignatories: LeaseSignatories | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaseSignatoriesViewModal({ leaseSignatories, isOpen, onClose }: LeaseSignatoriesViewModalProps) {

  const [leaseDocumentIDMap, setLeaseDocumentIDMap] = React.useState<Record<string, string>>({ });
  const [userIDMap, setUserIDMap] = React.useState<Record<string, string>>({ });
  const [tenantIDMap, setTenantIDMap] = React.useState<Record<string, string>>({ });
  const [organizationMemberIDMap, setOrganizationMemberIDMap] = React.useState<Record<string, string>>({ });

  React.useEffect(() => {
    const loadLookups = async () => {
      try {
        const res = await fetchData('api/leasedocument/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.leaseDocumentID ?? it.id)] = it.name ?? it.name ?? String(it.leaseDocumentID ?? ''); });
        setLeaseDocumentIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/account/getUsers?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.id ?? it.id)] = it.displayName ?? it.name ?? String(it.id ?? ''); });
        setUserIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/tenant/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.tenantID ?? it.id)] = it.name ?? it.name ?? String(it.tenantID ?? ''); });
        setTenantIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/organizationmember/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.organizationMemberID ?? it.id)] = it.name ?? it.name ?? String(it.organizationMemberID ?? ''); });
        setOrganizationMemberIDMap(map);
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
      case 'PENDING': return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'SIGNED': return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'DECLINED': return { backgroundColor: '#e0ecff', color: '#1e3a8a' };
      default: return { backgroundColor: 'var(--surface)', color: 'var(--muted)' };
    }
  };

  if (!isOpen || !leaseSignatories) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>LeaseSignatories Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Signatory Role</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {leaseSignatories.signatoryRole || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Status</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500, ...getStatusStyle(leaseSignatories.status || '') }}>
                    {leaseSignatories.status || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Lease Document</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseDocumentIDMap[String(leaseSignatories.leaseDocumentID)] ?? leaseSignatories.leaseDocumentID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">User</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {userIDMap[String(leaseSignatories.userID)] ?? leaseSignatories.userID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Tenant</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {tenantIDMap[String(leaseSignatories.tenantID)] ?? leaseSignatories.tenantID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Organization Member</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {organizationMemberIDMap[String(leaseSignatories.organizationMemberID)] ?? leaseSignatories.organizationMemberID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Name</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseSignatories.name ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Email</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseSignatories.email ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Signature Order</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseSignatories.signatureOrder ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Provider Signer ID</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseSignatories.providerSignerID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Viewed At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseSignatories.viewedAt ? new Date(leaseSignatories.viewedAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Signed At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseSignatories.signedAt ? new Date(leaseSignatories.signedAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Declined At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseSignatories.declinedAt ? new Date(leaseSignatories.declinedAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Lease Signatory ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {leaseSignatories.leaseSignatoryID ?? 'N/A'}
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

