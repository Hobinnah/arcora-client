{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { LeaseOccupants } from '../../types/LeaseOccupants';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface LeaseOccupantsViewModalProps {
  leaseOccupants: LeaseOccupants | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaseOccupantsViewModal({ leaseOccupants, isOpen, onClose }: LeaseOccupantsViewModalProps) {

  const [leaseIDMap, setLeaseIDMap] = React.useState<Record<string, string>>({ });
  const [leaseRenewalIDMap, setLeaseRenewalIDMap] = React.useState<Record<string, string>>({ });
  const [tenantIDMap, setTenantIDMap] = React.useState<Record<string, string>>({ });
  const [userIDMap, setUserIDMap] = React.useState<Record<string, string>>({ });

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
        const res = await fetchData('api/leaserenewals/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.leaseRenewalID ?? it.id)] = it.leaseRenewalID ?? it.name ?? String(it.leaseRenewalID ?? ''); });
        setLeaseRenewalIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/tenant/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.tenantID ?? it.id)] = it.tenantID ?? it.name ?? String(it.tenantID ?? ''); });
        setTenantIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/account/getUsers?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.id ?? it.id)] = it.displayName ?? it.name ?? String(it.id ?? ''); });
        setUserIDMap(map);
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
      case 'ACTIVE': return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'INACTIVE': return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'REMOVED': return { backgroundColor: '#e0ecff', color: '#1e3a8a' };
      default: return { backgroundColor: 'var(--surface)', color: 'var(--muted)' };
    }
  };

  if (!isOpen || !leaseOccupants) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>LeaseOccupants Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">First Name</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {leaseOccupants.firstName || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Status</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500, ...getStatusStyle(leaseOccupants.status || '') }}>
                    {leaseOccupants.status || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Lease</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseIDMap[String(leaseOccupants.leaseID)] ?? leaseOccupants.leaseID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Lease Renewal</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseRenewalIDMap[String(leaseOccupants.leaseRenewalID)] ?? leaseOccupants.leaseRenewalID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Tenant</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {tenantIDMap[String(leaseOccupants.tenantID)] ?? leaseOccupants.tenantID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">User</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {userIDMap[String(leaseOccupants.userID)] ?? leaseOccupants.userID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Last Name</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseOccupants.lastName ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Date of Birth</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseOccupants.dateOfBirth ? new Date(leaseOccupants.dateOfBirth as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Email</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseOccupants.email ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Phone Number</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseOccupants.phoneNumber ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Occupant Type</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseOccupants.occupantType ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Is Primary Tenant</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <input type="checkbox" checked={leaseOccupants.isPrimaryTenant ?? false} readOnly style={{ cursor: 'default' }} />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Is Financially Responsible</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <input type="checkbox" checked={leaseOccupants.isFinanciallyResponsible ?? false} readOnly style={{ cursor: 'default' }} />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Joined At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseOccupants.joinedAt ? new Date(leaseOccupants.joinedAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Removed At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseOccupants.removedAt ? new Date(leaseOccupants.removedAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Lease Occupant ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {leaseOccupants.leaseOccupantID ?? 'N/A'}
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

